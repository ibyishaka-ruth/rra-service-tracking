package rw.rra.taxpayerservice;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import rw.rra.taxpayerservice.domain.DepartmentRepository;
import rw.rra.taxpayerservice.domain.FeedbackRepository;
import rw.rra.taxpayerservice.domain.ServiceCategoryRepository;
import rw.rra.taxpayerservice.domain.ServiceRequestRepository;
import rw.rra.taxpayerservice.domain.Taxpayer;
import rw.rra.taxpayerservice.domain.TaxpayerRepository;
import rw.rra.taxpayerservice.domain.VisitRepository;

@SpringBootTest
@AutoConfigureMockMvc
class TaxpayerControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private TaxpayerRepository taxpayerRepository;

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
	void findsTaxpayerByTin() throws Exception {
		mockMvc.perform(get("/api/v1/taxpayers/123456789"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.tin").value("123456789"));
	}

	@Test
	void returnsNotFoundForUnknownTin() throws Exception {
		mockMvc.perform(get("/api/v1/taxpayers/000000000"))
				.andExpect(status().isNotFound());
	}

	@Test
	void createsTaxpayer() throws Exception {
		mockMvc.perform(post("/api/v1/taxpayers")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"tin\":\"987654321\"}"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").isNumber())
				.andExpect(jsonPath("$.tin").value("987654321"));
	}

	@Test
	void rejectsDuplicateTin() throws Exception {
		mockMvc.perform(post("/api/v1/taxpayers")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"tin\":\"123456789\"}"))
				.andExpect(status().isConflict());
	}

	@Test
	void rejectsBlankTin() throws Exception {
		mockMvc.perform(post("/api/v1/taxpayers")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"tin\":\" \"}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void rejectsTinThatDoesNotContainNineDigits() throws Exception {
		mockMvc.perform(post("/api/v1/taxpayers")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"tin\":\"12345ABCD\"}"))
				.andExpect(status().isBadRequest());
	}
}