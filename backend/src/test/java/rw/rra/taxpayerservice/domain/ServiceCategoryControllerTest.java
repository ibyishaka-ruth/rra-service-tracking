package rw.rra.taxpayerservice.domain;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.springframework.boot.DefaultApplicationArguments;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ServiceCategoryControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ServiceCategoryRepository categoryRepository;

	@Autowired
	private DepartmentRepository departmentRepository;

	@Autowired
	private FeedbackRepository feedbackRepository;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private VisitRepository visitRepository;

	@Autowired
	private TaxpayerRepository taxpayerRepository;

	@Autowired
	private ServiceRoutingCatalogSeeder catalogSeeder;

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
	void createsCategoryWithDefaultDepartment() throws Exception {
		Department department = departmentRepository.save(new Department("Finance"));

		mockMvc.perform(post("/api/v1/service-categories")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"Tax filing\",\"defaultDepartmentId\":" + department.getId() + "}"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.name").value("Tax filing"))
				.andExpect(jsonPath("$.defaultDepartmentName").value("Finance"))
				.andExpect(jsonPath("$.active").value(true));
	}

	@Test
	void rejectsUnknownDefaultDepartment() throws Exception {
		mockMvc.perform(post("/api/v1/service-categories")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"Tax filing\",\"defaultDepartmentId\":99999}"))
				.andExpect(status().isNotFound());
	}

	@Test
	void listsCategories() throws Exception {
		categoryRepository.save(new ServiceCategory("Tax filing", null));

		mockMvc.perform(get("/api/v1/service-categories"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].name").value("Tax filing"));
	}

	@Test
	void createsCategoryWithRoutingMetadata() throws Exception {
		Department department = departmentRepository.save(new Department("Domestic Taxes Department (DTD)"));

		mockMvc.perform(post("/api/v1/service-categories")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"EBM Support\",\"defaultDepartmentId\":" + department.getId()
						+ ",\"routingCode\":\"srv_003\",\"subUnit\":\"EBM Management Unit\","
						+ "\"commonKeywords\":[\"activate ebm\",\"ebm issue\"],\"priority\":\"Medium\"}"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.routingCode").value("srv_003"))
				.andExpect(jsonPath("$.subUnit").value("EBM Management Unit"))
				.andExpect(jsonPath("$.commonKeywords[0]").value("activate ebm"))
				.andExpect(jsonPath("$.priority").value("Medium"));
	}

	@Test
	void seedsRoutingCatalogIdempotentlyAndReturnsSearchMetadata() throws Exception {
		catalogSeeder.run(new DefaultApplicationArguments(new String[0]));
		assertEquals(14, categoryRepository.count());
		assertEquals(6, departmentRepository.count());

		catalogSeeder.run(new DefaultApplicationArguments(new String[0]));
		assertEquals(14, categoryRepository.count());
		assertEquals(6, departmentRepository.count());

		mockMvc.perform(get("/api/v1/service-categories"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[?(@.routingCode == 'srv_003')].name")
						.value(Matchers.hasItem("Electronic Billing Machine (EBM) Activation & Troubleshooting")))
				.andExpect(jsonPath("$[?(@.routingCode == 'srv_003')].defaultDepartmentName")
						.value(Matchers.hasItem("Domestic Taxes Department (DTD)")))
				.andExpect(jsonPath("$[?(@.routingCode == 'srv_003')].subUnit")
						.value(Matchers.hasItem("EBM Management Unit")))
				.andExpect(jsonPath("$[?(@.routingCode == 'srv_003')].commonKeywords[*]")
						.value(Matchers.hasItem("vuba vuba")));
	}
}
