package rw.rra.taxpayerservice.domain;

import java.time.Instant;

public record VisitResponse(Long id, Long taxpayerId, String tin, Instant arrivedAt) {

	public static VisitResponse from(Visit visit) {
		Taxpayer taxpayer = visit.getTaxpayer();
		return new VisitResponse(visit.getId(), taxpayer.getId(), taxpayer.getTin(), visit.getArrivedAt());
	}
}
