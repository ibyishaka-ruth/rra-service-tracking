package rw.rra.taxpayerservice.domain;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class DepartmentControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private DepartmentRepository departmentRepository;

	@Autowired
	private FeedbackRepository feedbackRepository;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private VisitRepository visitRepository;

	@Autowired
	private ServiceCategoryRepository categoryRepository;

	@Autowired
	private TaxpayerRepository taxpayerRepository;

	@BeforeEach
	void setUp() {
		feedbackRepository.deleteAll();
		serviceRequestRepository.deleteAll();
		visitRepository.deleteAll();
		categoryRepository.deleteAll();
		departmentRepository.deleteAll();
		taxpayerRepository.deleteAll();
	}

	@Test
	void createsDepartment() throws Exception {
		mockMvc.perform(post("/api/v1/departments")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"Finance\"}"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.name").value("Finance"))
				.andExpect(jsonPath("$.active").value(true));
	}

	@Test
	void updatesDepartmentName() throws Exception {
		Department saved = departmentRepository.save(new Department("Human Resources"));

		mockMvc.perform(put("/api/v1/departments/{id}", saved.getId())
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"HR\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("HR"));
	}

	@Test
	void deletesDepartmentSoftly() throws Exception {
		Department saved = departmentRepository.save(new Department("Support"));

		mockMvc.perform(delete("/api/v1/departments/{id}", saved.getId()))
				.andExpect(status().isNoContent());

		mockMvc.perform(get("/api/v1/departments/{id}", saved.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.active").value(false));
	}

	@Test
	void rejectsBlankDepartmentName() throws Exception {
		mockMvc.perform(post("/api/v1/departments")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"   \"}"))
				.andExpect(status().isBadRequest());
	}
}
