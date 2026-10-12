package rw.rra.taxpayerservice.domain;

import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FeedbackService {

	private final FeedbackRepository feedbackRepository;
	private final ServiceRequestRepository serviceRequestRepository;

	public FeedbackService(FeedbackRepository feedbackRepository, ServiceRequestRepository serviceRequestRepository) {
		this.feedbackRepository = feedbackRepository;
		this.serviceRequestRepository = serviceRequestRepository;
	}

	@Transactional
	public FeedbackResponse create(FeedbackRequest request) {
		if (request == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Feedback payload is required");
		}
		ServiceRequest serviceRequest = serviceRequestRepository.findById(request.serviceRequestId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service request not found"));
		if (serviceRequest.getStatus() != ServiceRequestStatus.COMPLETED) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Feedback can only be submitted after the service request is completed");
		}
		Optional<Feedback> existingFeedback = feedbackRepository.findByServiceRequestId(serviceRequest.getId());
		if (existingFeedback.isPresent()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Feedback already exists for this service request");
		}
		Feedback feedback = new Feedback(serviceRequest, request.rating(), request.comment());
		return FeedbackResponse.from(feedbackRepository.save(feedback));
	}

	@Transactional(readOnly = true)
	public FeedbackResponse findByServiceRequestId(Long serviceRequestId) {
		Feedback feedback = feedbackRepository.findByServiceRequestId(serviceRequestId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found"));
		return FeedbackResponse.from(feedback);
	}
}
