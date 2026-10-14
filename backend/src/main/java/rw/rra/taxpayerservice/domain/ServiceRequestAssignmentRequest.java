package rw.rra.taxpayerservice.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ServiceRequestAssignmentRequest(
		@NotBlank(message = "Staff name is required") @Size(max = 120) String staffName) {
}
