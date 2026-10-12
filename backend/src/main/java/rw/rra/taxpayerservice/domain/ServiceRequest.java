package rw.rra.taxpayerservice.domain;

import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.Objects;
import org.hibernate.annotations.Check;

@Entity
@Table(name = "service_requests")
@Check(constraints = "status <> 'NOT_COMPLETED' OR non_completion_reason IS NOT NULL")
public class ServiceRequest {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "visit_id", nullable = false)
	private Visit visit;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "department_id", nullable = false)
	private Department department;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "service_category_id", nullable = false)
	private ServiceCategory serviceCategory;

	@NotBlank
	@Column(nullable = false, length = 1000)
	private String reason;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private ServiceRequestStatus status;

	@Column(name = "non_completion_reason", length = 1000)
	private String nonCompletionReason;

	@Column(nullable = false, updatable = false)
	private Instant createdAt;

	private Instant outcomeRecordedAt;

	protected ServiceRequest() {
	}

	public ServiceRequest(Visit visit, Department department, ServiceCategory serviceCategory, String reason) {
		this.visit = Objects.requireNonNull(visit, "Visit is required");
		this.department = Objects.requireNonNull(department, "Department is required");
		this.serviceCategory = Objects.requireNonNull(serviceCategory, "Service category is required");
		if (reason == null || reason.isBlank()) {
			throw new IllegalArgumentException("Reason for the request is required");
		}
		this.reason = reason.trim();
		this.status = ServiceRequestStatus.PENDING;
		this.createdAt = Instant.now();
	}

	public void markCompleted() {
		if (this.status != ServiceRequestStatus.PENDING && this.status != ServiceRequestStatus.IN_PROGRESS) {
			throw new IllegalStateException("Only a pending service request can be completed");
		}
		this.status = ServiceRequestStatus.COMPLETED;
		this.nonCompletionReason = null;
		this.outcomeRecordedAt = Instant.now();
	}

	public void recordPendingUpdate(String reason) {
		if (reason == null || reason.isBlank()) {
			throw new IllegalArgumentException("A reason is required when the request remains pending");
		}
		this.nonCompletionReason = reason.trim();
		this.status = ServiceRequestStatus.PENDING;
		this.outcomeRecordedAt = null;
	}

	public Long getId() {
		return id;
	}

	public Visit getVisit() {
		return visit;
	}

	public Department getDepartment() {
		return department;
	}

	public ServiceCategory getServiceCategory() {
		return serviceCategory;
	}

	public String getReason() {
		return reason;
	}

	public ServiceRequestStatus getStatus() {
		return status;
	}

	public String getNonCompletionReason() {
		return nonCompletionReason;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getOutcomeRecordedAt() {
		return outcomeRecordedAt;
	}
}