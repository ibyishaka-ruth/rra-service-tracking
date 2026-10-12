package rw.rra.taxpayerservice.domain;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record FeedbackRequest(
		@NotNull(message = "Service request ID is required") Long serviceRequestId,
		@NotNull(message = "Rating is required") @Min(1) @Max(5) Integer rating,
		String comment) {
}
