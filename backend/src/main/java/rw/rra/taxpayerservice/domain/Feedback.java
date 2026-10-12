package rw.rra.taxpayerservice.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "feedback")
public class Feedback {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "service_request_id", nullable = false, unique = true)
	private ServiceRequest serviceRequest;

	@Min(1)
	@Max(5)
	@Column(nullable = false)
	private int rating;

	@Column(length = 1000)
	private String comment;

	@Column(nullable = false, updatable = false)
	private Instant submittedAt;

	protected Feedback() {
	}

	public Feedback(ServiceRequest serviceRequest, int rating, String comment) {
		this.serviceRequest = Objects.requireNonNull(serviceRequest, "Service request is required");
		if (rating < 1 || rating > 5) {
			throw new IllegalArgumentException("Rating must be between 1 and 5");
		}
		this.rating = rating;
		this.comment = comment == null || comment.isBlank() ? null : comment.trim();
		this.submittedAt = Instant.now();
	}

	public Long getId() {
		return id;
	}

	public ServiceRequest getServiceRequest() {
		return serviceRequest;
	}

	public int getRating() {
		return rating;
	}

	public String getComment() {
		return comment;
	}

	public Instant getSubmittedAt() {
		return submittedAt;
	}
}