package rw.rra.taxpayerservice.domain;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class FeedbackControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private FeedbackRepository feedbackRepository;

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

	private ServiceRequest completedRequest;

	@BeforeEach
	void setUp() {
		feedbackRepository.deleteAll();
		serviceRequestRepository.deleteAll();
		visitRepository.deleteAll();
		categoryRepository.deleteAll();
		departmentRepository.deleteAll();
		taxpayerRepository.deleteAll();

		Department department = departmentRepository.save(new Department("Taxpayer Services"));
		Taxpayer taxpayer = taxpayerRepository.save(new Taxpayer("TEST-TIN-001"));
		Visit visit = visitRepository.save(new Visit(taxpayer));
		ServiceCategory category = categoryRepository.save(new ServiceCategory("Taxpayer Support", department));
		completedRequest = serviceRequestRepository.save(new ServiceRequest(visit, department, category, "Need help"));
		completedRequest.markCompleted();
		serviceRequestRepository.save(completedRequest);
	}

	@Test
	void createsFeedbackForCompletedRequest() throws Exception {
		mockMvc.perform(post("/api/v1/feedback")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"serviceRequestId\":" + completedRequest.getId() + ",\"rating\":5,\"comment\":\"Very helpful\"}"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.serviceRequestId").value(completedRequest.getId()))
				.andExpect(jsonPath("$.rating").value(5))
				.andExpect(jsonPath("$.comment").value("Very helpful"));
	}

	@Test
	void rejectsFeedbackForInProgressRequest() throws Exception {
		ServiceRequest inProgress = serviceRequestRepository.save(new ServiceRequest(
				visitRepository.findAll().get(0),
				departmentRepository.findAll().get(0),
				categoryRepository.findAll().get(0),
				"Need more help"));

		mockMvc.perform(post("/api/v1/feedback")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"serviceRequestId\":" + inProgress.getId() + ",\"rating\":4,\"comment\":\"Okay\"}"))
				.andExpect(status().isConflict());
	}

	@Test
	void retrievesFeedbackByServiceRequestId() throws Exception {
		Feedback feedback = feedbackRepository.save(new Feedback(completedRequest, 4, "Good service"));

		mockMvc.perform(get("/api/v1/feedback/service-request/{serviceRequestId}", completedRequest.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(feedback.getId()))
				.andExpect(jsonPath("$.rating").value(4));
	}
}
