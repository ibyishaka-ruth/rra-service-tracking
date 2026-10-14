package rw.rra.taxpayerservice.domain;

import java.time.Instant;

public record ServiceRequestResponse(
		Long id,
		Long visitId,
		String taxpayerTin,
		Long serviceCategoryId,
		String serviceCode,
		String serviceCategoryName,
		String subUnit,
		Long departmentId,
		String departmentName,
		String reason,
		ServiceRequestStatus status,
		String assignedStaffName,
		Instant assignedAt,
		String nonCompletionReason,
		Instant createdAt,
		Instant outcomeRecordedAt) {

	public static ServiceRequestResponse from(ServiceRequest request) {
		return new ServiceRequestResponse(
				request.getId(),
				request.getVisit().getId(),
				request.getVisit().getTaxpayer().getTin(),
				request.getServiceCategory().getId(),
				request.getServiceCategory().getRoutingCode(),
				request.getServiceCategory().getName(),
				request.getServiceCategory().getSubUnit(),
				request.getDepartment().getId(),
				request.getDepartment().getName(),
				request.getReason(),
				request.getStatus(),
				request.getAssignedStaffName(),
				request.getAssignedAt(),
				request.getNonCompletionReason(),
				request.getCreatedAt(),
				request.getOutcomeRecordedAt());
	}
}
