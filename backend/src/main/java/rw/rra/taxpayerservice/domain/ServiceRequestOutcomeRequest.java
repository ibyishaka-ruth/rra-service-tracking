package rw.rra.taxpayerservice.domain;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ServiceRequestOutcomeRequest(
		@NotNull(message = "Outcome status is required") ServiceRequestStatus status,
		@Size(max = 1000) String nonCompletionReason) {
}
