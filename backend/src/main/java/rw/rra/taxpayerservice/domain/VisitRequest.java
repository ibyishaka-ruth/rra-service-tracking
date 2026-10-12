package rw.rra.taxpayerservice.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VisitRequest(
		@NotBlank(message = "TIN is required")
		@Pattern(regexp = "\\d{9}", message = "TIN must contain exactly 9 digits")
		String tin) {
}
