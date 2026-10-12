package rw.rra.taxpayerservice.domain;

import jakarta.validation.constraints.NotBlank;

public record DepartmentRequest(@NotBlank(message = "Department name is required") String name) {

	public String normalizedName() {
		return name == null ? "" : name.trim();
	}
}
