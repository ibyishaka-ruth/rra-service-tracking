package rw.rra.taxpayerservice.domain;

import java.time.Instant;

public record FeedbackResponse(
		Long id,
		Long serviceRequestId,
		String serviceCategoryName,
		String departmentName,
		Integer rating,
		String comment,
		Instant submittedAt) {

	public static FeedbackResponse from(Feedback feedback) {
		ServiceRequest serviceRequest = feedback.getServiceRequest();
		return new FeedbackResponse(
				feedback.getId(),
				serviceRequest.getId(),
				serviceRequest.getServiceCategory().getName(),
				serviceRequest.getDepartment().getName(),
				feedback.getRating(),
				feedback.getComment(),
				feedback.getSubmittedAt());
	}
}
