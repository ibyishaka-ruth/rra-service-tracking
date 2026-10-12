package rw.rra.taxpayerservice.domain;

import java.util.List;

public record ServiceCategoryResponse(Long id, String name, Long defaultDepartmentId, String defaultDepartmentName,
		boolean active, String routingCode, String subUnit, List<String> commonKeywords, String priority) {

	public static ServiceCategoryResponse from(ServiceCategory category) {
		Department department = category.getDefaultDepartment();
		return new ServiceCategoryResponse(category.getId(), category.getName(),
				department == null ? null : department.getId(),
				department == null ? null : department.getName(), category.isActive(), category.getRoutingCode(),
				category.getSubUnit(), category.getCommonKeywords(), category.getPriority());
	}
}
