package rw.rra.taxpayerservice.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class ServiceRequestTest {

	@Test
	void newRequestStartsPending() {
		ServiceRequest request = createRequest();

		assertEquals(ServiceRequestStatus.PENDING, request.getStatus());
	}

	@Test
	void pendingRequestRequiresAReasonForAnUpdate() {
		ServiceRequest request = createRequest();

		assertThrows(IllegalArgumentException.class, () -> request.recordPendingUpdate("  "));
		assertEquals(ServiceRequestStatus.PENDING, request.getStatus());
	}

	@Test
	void pendingRequestCanRecordAnUpdateAndStayPending() {
		ServiceRequest request = createRequest();

		request.recordPendingUpdate("Waiting for a supporting document");

		assertEquals(ServiceRequestStatus.PENDING, request.getStatus());
		assertEquals("Waiting for a supporting document", request.getNonCompletionReason());
		assertNull(request.getOutcomeRecordedAt());
	}

	@Test
	void completedRequestCanReceiveLowRatingFeedback() {
		ServiceRequest request = createRequest();
		request.markCompleted();
		Feedback feedback = new Feedback(request, 1, "Service was slow");

		assertEquals(ServiceRequestStatus.COMPLETED, request.getStatus());
		assertEquals(1, feedback.getRating());
	}

	private ServiceRequest createRequest() {
		Taxpayer taxpayer = new Taxpayer("123456789");
		Visit visit = new Visit(taxpayer);
		Department department = new Department("Generic Department");
		ServiceCategory serviceCategory = new ServiceCategory("Generic Service", department);
		return new ServiceRequest(visit, department, serviceCategory, "Example request");
	}
}