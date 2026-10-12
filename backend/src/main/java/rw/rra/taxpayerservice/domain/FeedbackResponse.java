package rw.rra.taxpayerservice.domain;

import java.time.Instant;

public record FeedbackResponse(Long id, Long serviceRequestId, Integer rating, String comment, Instant submittedAt) {

	public static FeedbackResponse from(Feedback feedback) {
		return new FeedbackResponse(feedback.getId(), feedback.getServiceRequest().getId(), feedback.getRating(),
				feedback.getComment(), feedback.getSubmittedAt());
	}
}
