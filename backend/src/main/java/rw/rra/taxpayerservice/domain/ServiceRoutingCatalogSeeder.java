package rw.rra.taxpayerservice.domain;

import java.io.IOException;
import java.util.List;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Component
public class ServiceRoutingCatalogSeeder implements ApplicationRunner {

	private final ObjectMapper objectMapper;
	private final DepartmentRepository departmentRepository;
	private final ServiceCategoryRepository categoryRepository;

	public ServiceRoutingCatalogSeeder(
			ObjectMapper objectMapper,
			DepartmentRepository departmentRepository,
			ServiceCategoryRepository categoryRepository) {
		this.objectMapper = objectMapper;
		this.departmentRepository = departmentRepository;
		this.categoryRepository = categoryRepository;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		for (RoutingDefinition definition : readCatalog()) {
			Department department = departmentRepository.findByNameIgnoreCase(definition.targetDepartment())
					.orElseGet(() -> departmentRepository.save(new Department(definition.targetDepartment())));

			ServiceCategory category = categoryRepository.findByRoutingCode(definition.id())
					.orElseGet(() -> new ServiceCategory(
							definition.serviceName(),
							department,
							definition.id(),
							definition.subUnit(),
							definition.commonKeywords(),
							definition.priority()));
			category.setName(definition.serviceName());
			category.setDefaultDepartment(department);
			category.setRoutingCode(definition.id());
			category.setSubUnit(definition.subUnit());
			category.setCommonKeywords(definition.commonKeywords());
			category.setPriority(definition.priority());
			categoryRepository.save(category);
		}
	}

	private List<RoutingDefinition> readCatalog() {
		try {
			return objectMapper.readValue(
					new ClassPathResource("rra-service-routing.json").getInputStream(),
					new TypeReference<>() {
					});
		} catch (IOException exception) {
			throw new IllegalStateException("Unable to load the RRA service-routing catalog", exception);
		}
	}

	private record RoutingDefinition(
			String id,
			String serviceName,
			List<String> commonKeywords,
			String targetDepartment,
			String subUnit,
			String priority) {
	}
}
