package rw.rra.taxpayerservice.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ServiceRequestRequest(
		@NotNull(message = "Visit ID is required") Long visitId,
		@NotNull(message = "Service category ID is required") Long serviceCategoryId,
		Long departmentId,
		@NotBlank(message = "Request reason is required") @Size(max = 1000) String reason) {
}
