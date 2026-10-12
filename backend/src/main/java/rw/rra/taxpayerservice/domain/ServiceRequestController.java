package rw.rra.taxpayerservice.domain;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/service-requests")
public class ServiceRequestController {

	private final ServiceRequestService serviceRequestService;

	public ServiceRequestController(ServiceRequestService serviceRequestService) {
		this.serviceRequestService = serviceRequestService;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ServiceRequestResponse create(@Valid @RequestBody ServiceRequestRequest request) {
		return serviceRequestService.create(request);
	}

	@GetMapping("/{id}")
	public ServiceRequestResponse findById(@PathVariable Long id) {
		return serviceRequestService.findById(id);
	}

	@GetMapping("/visit/{visitId}")
	public List<ServiceRequestResponse> findByVisitId(@PathVariable Long visitId) {
		return serviceRequestService.findByVisitId(visitId);
	}

	@PostMapping("/{id}/outcome")
	public ServiceRequestResponse recordOutcome(
			@PathVariable Long id,
			@Valid @RequestBody ServiceRequestOutcomeRequest request) {
		return serviceRequestService.recordOutcome(id, request);
	}
}
