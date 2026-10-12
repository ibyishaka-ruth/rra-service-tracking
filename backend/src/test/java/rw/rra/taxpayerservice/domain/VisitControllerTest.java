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
import rw.rra.taxpayerservice.domain.Taxpayer;
import rw.rra.taxpayerservice.domain.TaxpayerRepository;

@SpringBootTest
@AutoConfigureMockMvc
class VisitControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private VisitRepository visitRepository;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private TaxpayerRepository taxpayerRepository;

	@Autowired
	private FeedbackRepository feedbackRepository;

	@Autowired
	private ServiceCategoryRepository categoryRepository;

	@Autowired
	private DepartmentRepository departmentRepository;

	@BeforeEach
	void setUp() {
		feedbackRepository.deleteAll();
		serviceRequestRepository.deleteAll();
		visitRepository.deleteAll();
		categoryRepository.deleteAll();
		departmentRepository.deleteAll();
		taxpayerRepository.deleteAll();
		taxpayerRepository.save(new Taxpayer("123456789"));
	}

	@Test
	void checksInKnownTaxpayer() throws Exception {
		mockMvc.perform(post("/api/v1/visits")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"tin\":\"123456789\"}"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").isNumber())
				.andExpect(jsonPath("$.tin").value("123456789"))
				.andExpect(jsonPath("$.arrivedAt").isNotEmpty());
	}

	@Test
	void rejectsUnknownTaxpayer() throws Exception {
		mockMvc.perform(post("/api/v1/visits")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"tin\":\"000000000\"}"))
				.andExpect(status().isNotFound());
	}

	@Test
	void rejectsTinThatDoesNotContainNineDigits() throws Exception {
		mockMvc.perform(post("/api/v1/visits")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"tin\":\"12345ABCD\"}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void listsVisitsForTaxpayer() throws Exception {
		mockMvc.perform(post("/api/v1/visits")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"tin\":\"123456789\"}"))
				.andExpect(status().isCreated());

		mockMvc.perform(get("/api/v1/visits/taxpayer/123456789"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].tin").value("123456789"));
	}
}
