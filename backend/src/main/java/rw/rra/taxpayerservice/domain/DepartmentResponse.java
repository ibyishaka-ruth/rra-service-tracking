package rw.rra.taxpayerservice.domain;

public record DepartmentResponse(Long id, String name, boolean active) {

	public static DepartmentResponse from(Department department) {
		return new DepartmentResponse(department.getId(), department.getName(), department.isActive());
	}
}
