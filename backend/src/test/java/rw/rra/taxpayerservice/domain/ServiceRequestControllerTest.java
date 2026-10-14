package rw.rra.taxpayerservice.domain;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.nullValue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ServiceRequestControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private VisitRepository visitRepository;

	@Autowired
	private ServiceCategoryRepository categoryRepository;

	@Autowired
	private DepartmentRepository departmentRepository;

	@Autowired
	private TaxpayerRepository taxpayerRepository;

	@Autowired
	private FeedbackRepository feedbackRepository;

	private Visit visit;
	private ServiceCategory category;

	@BeforeEach
	void setUp() {
		feedbackRepository.deleteAll();
		serviceRequestRepository.deleteAll();
		visitRepository.deleteAll();
		categoryRepository.deleteAll();
		departmentRepository.deleteAll();
		taxpayerRepository.deleteAll();

		Department department = departmentRepository.save(new Department("Finance"));
		Taxpayer taxpayer = taxpayerRepository.save(new Taxpayer("123456789"));
		visit = visitRepository.save(new Visit(taxpayer));
		category = categoryRepository.save(new ServiceCategory("Tax filing", department));
	}

	@Test
	void createsRequestUsingCategoryDefaultDepartment() throws Exception {
		mockMvc.perform(post("/api/v1/service-requests")
				.contentType(MediaType.APPLICATION_JSON)
				.content(requestJson()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.visitId").value(visit.getId()))
				.andExpect(jsonPath("$.serviceCategoryName").value("Tax filing"))
				.andExpect(jsonPath("$.departmentName").value("Finance"))
				.andExpect(jsonPath("$.status").value("PENDING"));
	}

	@Test
	void marksRequestCompleted() throws Exception {
		mockMvc.perform(post("/api/v1/service-requests")
				.contentType(MediaType.APPLICATION_JSON)
				.content(requestJson()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").isNumber());
		Long requestId = serviceRequestRepository.findAll().get(0).getId();

		mockMvc.perform(post("/api/v1/service-requests/{id}/outcome", requestId)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"status\":\"COMPLETED\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("COMPLETED"))
				.andExpect(jsonPath("$.outcomeRecordedAt").isNotEmpty());
	}

	@Test
	void requiresReasonForNotCompletedOutcome() throws Exception {
		mockMvc.perform(post("/api/v1/service-requests")
				.contentType(MediaType.APPLICATION_JSON)
				.content(requestJson()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").isNumber());
		Long requestId = serviceRequestRepository.findAll().get(0).getId();

		mockMvc.perform(post("/api/v1/service-requests/{id}/outcome", requestId)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"status\":\"NOT_COMPLETED\",\"nonCompletionReason\":\" \"}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void recordsUnfinishedWorkAsPendingAndAllowsLaterCompletion() throws Exception {
		mockMvc.perform(post("/api/v1/service-requests")
				.contentType(MediaType.APPLICATION_JSON)
				.content(requestJson()))
				.andExpect(status().isCreated());
		Long requestId = serviceRequestRepository.findAll().get(0).getId();

		mockMvc.perform(put("/api/v1/service-requests/{id}/assignment", requestId)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"staffName\":\"Aline\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("IN_PROGRESS"))
				.andExpect(jsonPath("$.assignedStaffName").value("Aline"))
				.andExpect(jsonPath("$.assignedAt").isNotEmpty());

		mockMvc.perform(post("/api/v1/service-requests/{id}/outcome", requestId)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"status\":\"NOT_COMPLETED\",\"nonCompletionReason\":\"Waiting for a document\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("PENDING"))
				.andExpect(jsonPath("$.assignedStaffName").value(nullValue()))
				.andExpect(jsonPath("$.nonCompletionReason").value("Waiting for a document"))
				.andExpect(jsonPath("$.outcomeRecordedAt").value(nullValue()));

		mockMvc.perform(post("/api/v1/service-requests/{id}/outcome", requestId)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"status\":\"COMPLETED\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("COMPLETED"))
				.andExpect(jsonPath("$.nonCompletionReason").value(nullValue()))
				.andExpect(jsonPath("$.outcomeRecordedAt").isNotEmpty());
	}

	@Test
	void listsRequestsForFrontDeskWithTaxpayerAndAssignmentFields() throws Exception {
		mockMvc.perform(post("/api/v1/service-requests")
				.contentType(MediaType.APPLICATION_JSON)
				.content(requestJson()))
				.andExpect(status().isCreated());

		Thread.sleep(10);
		mockMvc.perform(post("/api/v1/service-requests")
				.contentType(MediaType.APPLICATION_JSON)
				.content(requestJson()))
				.andExpect(status().isCreated());
		Long newestRequestId = serviceRequestRepository.findAll().stream()
				.map(ServiceRequest::getId)
				.max(Long::compareTo)
				.orElseThrow();

		mockMvc.perform(get("/api/v1/service-requests"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].id").value(newestRequestId))
				.andExpect(jsonPath("$[0].taxpayerTin").value("123456789"))
				.andExpect(jsonPath("$[0].serviceCategoryName").value("Tax filing"))
				.andExpect(jsonPath("$[0].assignedStaffName").value(nullValue()));
	}

	@Test
	void opensServerSentEventsStreamForFrontDeskUpdates() throws Exception {
		mockMvc.perform(get("/api/v1/service-requests/events")
				.accept(MediaType.TEXT_EVENT_STREAM))
				.andExpect(status().isOk())
				.andExpect(request().asyncStarted());
	}

	@Test
	void doesNotAllowAssignmentWhenRequestIsCompleted() throws Exception {
		mockMvc.perform(post("/api/v1/service-requests")
				.contentType(MediaType.APPLICATION_JSON)
				.content(requestJson()))
				.andExpect(status().isCreated());
		Long requestId = serviceRequestRepository.findAll().get(0).getId();
		mockMvc.perform(post("/api/v1/service-requests/{id}/outcome", requestId)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"status\":\"COMPLETED\"}"))
				.andExpect(status().isOk());

		mockMvc.perform(put("/api/v1/service-requests/{id}/assignment", requestId)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"staffName\":\"Aline\"}"))
				.andExpect(status().isConflict());
	}

	@Test
	void listsRequestsForVisit() throws Exception {
		mockMvc.perform(post("/api/v1/service-requests")
				.contentType(MediaType.APPLICATION_JSON)
				.content(requestJson()))
				.andExpect(status().isCreated());

		mockMvc.perform(get("/api/v1/service-requests/visit/{visitId}", visit.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].serviceCategoryName").value("Tax filing"));
	}

	private String requestJson() {
		return "{\"visitId\":" + visit.getId()
				+ ",\"serviceCategoryId\":" + category.getId()
				+ ",\"reason\":\"Need help filing tax\"}";
	}

}
