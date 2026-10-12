package rw.rra.taxpayerservice.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record TaxpayerRequest(
		@NotBlank(message = "TIN is required")
		@Pattern(regexp = "\\d{9}", message = "TIN must contain exactly 9 digits")
		@Size(max = 32) String tin) {
}
