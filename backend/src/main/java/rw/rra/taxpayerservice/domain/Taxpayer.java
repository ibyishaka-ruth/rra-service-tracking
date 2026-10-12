package rw.rra.taxpayerservice.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

@Entity
@Table(name = "taxpayers")
public class Taxpayer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Column(nullable = false, unique = true, length = 32)
	private String tin;

	@Column(nullable = false, updatable = false)
	private Instant createdAt;

	protected Taxpayer() {
	}

	public Taxpayer(String tin) {
		if (tin == null || tin.isBlank()) {
			throw new IllegalArgumentException("TIN is required");
		}
		this.tin = tin.trim();
		this.createdAt = Instant.now();
	}

	public Long getId() {
		return id;
	}

	public String getTin() {
		return tin;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}
}