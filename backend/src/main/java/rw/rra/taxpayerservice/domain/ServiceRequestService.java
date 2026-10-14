package rw.rra.taxpayerservice.domain;

import java.util.List;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class ServiceRequestService {

	private final ServiceRequestRepository serviceRequestRepository;
	private final VisitRepository visitRepository;
	private final ServiceCategoryRepository categoryRepository;
	private final DepartmentRepository departmentRepository;
	private final ApplicationEventPublisher eventPublisher;
	private final ServiceRequestEventStream eventStream;

	public ServiceRequestService(
			ServiceRequestRepository serviceRequestRepository,
			VisitRepository visitRepository,
			ServiceCategoryRepository categoryRepository,
			DepartmentRepository departmentRepository,
			ApplicationEventPublisher eventPublisher,
			ServiceRequestEventStream eventStream) {
		this.serviceRequestRepository = serviceRequestRepository;
		this.visitRepository = visitRepository;
		this.categoryRepository = categoryRepository;
		this.departmentRepository = departmentRepository;
		this.eventPublisher = eventPublisher;
		this.eventStream = eventStream;
	}

	@Transactional
	public ServiceRequestResponse create(ServiceRequestRequest request) {
		if (request == null || request.reason() == null || request.reason().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request reason is required");
		}
		Visit visit = visitRepository.findById(request.visitId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Visit not found"));
		ServiceCategory category = categoryRepository.findById(request.serviceCategoryId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service category not found"));
		if (!category.isActive()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Service category is inactive");
		}

		Department department = resolveDepartment(request.departmentId(), category);
		ServiceRequest serviceRequest = new ServiceRequest(visit, department, category, request.reason());
		ServiceRequest savedRequest = serviceRequestRepository.save(serviceRequest);
		eventPublisher.publishEvent(new ServiceRequestChangedEvent(savedRequest.getId()));
		return ServiceRequestResponse.from(savedRequest);
	}

	@Transactional(readOnly = true)
	public ServiceRequestResponse findById(Long id) {
		return ServiceRequestResponse.from(findRequest(id));
	}

	@Transactional(readOnly = true)
	public List<ServiceRequestResponse> findAll() {
		return serviceRequestRepository.findAllByOrderByCreatedAtDesc().stream()
				.map(ServiceRequestResponse::from)
				.toList();
	}

	public SseEmitter subscribeToUpdates() {
		return eventStream.subscribe();
	}

	@Transactional(readOnly = true)
	public List<ServiceRequestResponse> findByVisitId(Long visitId) {
		if (!visitRepository.existsById(visitId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Visit not found");
		}
		return serviceRequestRepository.findByVisit_IdOrderByCreatedAtDesc(visitId).stream()
				.map(ServiceRequestResponse::from)
				.toList();
	}

	@Transactional
	public ServiceRequestResponse recordOutcome(Long id, ServiceRequestOutcomeRequest request) {
		if (request == null || request.status() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Outcome status is required");
		}
		ServiceRequest serviceRequest = findRequest(id);
		if (serviceRequest.getStatus() != ServiceRequestStatus.PENDING
				&& serviceRequest.getStatus() != ServiceRequestStatus.IN_PROGRESS) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Service request already has a final outcome");
		}
		if (request.status() == ServiceRequestStatus.COMPLETED) {
			serviceRequest.markCompleted();
		} else if (request.status() == ServiceRequestStatus.NOT_COMPLETED) {
			if (request.nonCompletionReason() == null || request.nonCompletionReason().isBlank()) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
						"A reason is required when the request is not completed");
			}
			serviceRequest.recordPendingUpdate(request.nonCompletionReason());
		} else {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Outcome must be COMPLETED or NOT_COMPLETED");
		}
		ServiceRequest savedRequest = serviceRequestRepository.save(serviceRequest);
		eventPublisher.publishEvent(new ServiceRequestChangedEvent(savedRequest.getId()));
		return ServiceRequestResponse.from(savedRequest);
	}

	@Transactional
	public ServiceRequestResponse assign(Long id, ServiceRequestAssignmentRequest request) {
		if (request == null || request.staffName() == null || request.staffName().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Staff name is required");
		}
		ServiceRequest serviceRequest = findRequest(id);
		try {
			serviceRequest.assignTo(request.staffName());
		} catch (IllegalStateException exception) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, exception.getMessage());
		}
		ServiceRequest savedRequest = serviceRequestRepository.save(serviceRequest);
		eventPublisher.publishEvent(new ServiceRequestChangedEvent(savedRequest.getId()));
		return ServiceRequestResponse.from(savedRequest);
	}

	private ServiceRequest findRequest(Long id) {
		return serviceRequestRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service request not found"));
	}

	private Department resolveDepartment(Long departmentId, ServiceCategory category) {
		Department department = departmentId == null
				? category.getDefaultDepartment()
				: departmentRepository.findById(departmentId)
						.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
		if (department == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"A department is required because this service category has no default department");
		}
		if (!department.isActive()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Department is inactive");
		}
		return department;
	}
}
