package rw.rra.taxpayerservice.domain;

import jakarta.persistence.Column;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Entity;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "service_categories")
public class ServiceCategory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Column(nullable = false, unique = true, length = 120)
	private String name;

	@Column(name = "routing_code", unique = true, length = 7)
	private String routingCode;

	@Column(name = "sub_unit", length = 180)
	private String subUnit;

	@Column(length = 10)
	private String priority;

	@ElementCollection
	@CollectionTable(name = "service_category_keywords", joinColumns = @JoinColumn(name = "service_category_id"))
	@Column(name = "keyword", nullable = false, length = 120)
	private List<String> commonKeywords = new ArrayList<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "default_department_id")
	private Department defaultDepartment;

	@Column(nullable = false)
	private boolean active = true;

	protected ServiceCategory() {
	}

	public ServiceCategory(String name, Department defaultDepartment) {
		this(name, defaultDepartment, null, null, List.of(), null);
	}

	public ServiceCategory(
			String name,
			Department defaultDepartment,
			String routingCode,
			String subUnit,
			List<String> commonKeywords,
			String priority) {
		if (name == null || name.isBlank()) {
			throw new IllegalArgumentException("Service category name is required");
		}
		this.name = name.trim();
		this.defaultDepartment = defaultDepartment;
		setRoutingCode(routingCode);
		setSubUnit(subUnit);
		setCommonKeywords(commonKeywords);
		setPriority(priority);
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getRoutingCode() {
		return routingCode;
	}

	public void setRoutingCode(String routingCode) {
		if (routingCode != null && !routingCode.matches("srv_\\d{3}")) {
			throw new IllegalArgumentException("Routing code must use the format srv_001");
		}
		this.routingCode = routingCode;
	}

	public String getSubUnit() {
		return subUnit;
	}

	public void setSubUnit(String subUnit) {
		this.subUnit = subUnit == null || subUnit.isBlank() ? null : subUnit.trim();
	}

	public List<String> getCommonKeywords() {
		return List.copyOf(commonKeywords);
	}

	public void setCommonKeywords(List<String> commonKeywords) {
		this.commonKeywords = commonKeywords == null
				? new ArrayList<>()
				: new ArrayList<>(commonKeywords.stream()
						.filter(keyword -> keyword != null && !keyword.isBlank())
						.map(String::trim)
						.distinct()
						.toList());
	}

	public String getPriority() {
		return priority;
	}

	public void setPriority(String priority) {
		if (priority != null && !List.of("High", "Medium", "Low").contains(priority)) {
			throw new IllegalArgumentException("Priority must be High, Medium, or Low");
		}
		this.priority = priority;
	}

	public void setName(String name) {
		if (name == null || name.isBlank()) {
			throw new IllegalArgumentException("Service category name is required");
		}
		this.name = name.trim();
	}

	public Department getDefaultDepartment() {
		return defaultDepartment;
	}

	public void setDefaultDepartment(Department defaultDepartment) {
		this.defaultDepartment = defaultDepartment;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}
}