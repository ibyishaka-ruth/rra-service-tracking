package rw.rra.taxpayerservice.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ServiceCategoryRequest(
		@NotBlank(message = "Service category name is required") String name,
		Long defaultDepartmentId,
		@Pattern(regexp = "srv_\\d{3}", message = "Routing code must use the format srv_001")
		String routingCode,
		@Size(max = 180) String subUnit,
		@Size(max = 30) List<@Size(max = 120) String> commonKeywords,
		@Pattern(regexp = "High|Medium|Low", message = "Priority must be High, Medium, or Low")
		String priority) {
}
