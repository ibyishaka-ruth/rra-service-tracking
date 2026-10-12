package rw.rra.taxpayerservice.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "visits")
public class Visit {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "taxpayer_id", nullable = false)
	private Taxpayer taxpayer;

	private Instant arrivedAt;

	protected Visit() {
	}

	public Visit(Taxpayer taxpayer) {
		this.taxpayer = Objects.requireNonNull(taxpayer, "Taxpayer is required");
		this.arrivedAt = Instant.now();
	}

	public Long getId() {
		return id;
	}

	public Taxpayer getTaxpayer() {
		return taxpayer;
	}

	public Instant getArrivedAt() {
		return arrivedAt;
	}
}