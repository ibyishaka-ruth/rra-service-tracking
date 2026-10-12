package rw.rra.taxpayerservice.domain;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ServiceCategoryService {

	private final ServiceCategoryRepository categoryRepository;
	private final DepartmentRepository departmentRepository;

	public ServiceCategoryService(ServiceCategoryRepository categoryRepository, DepartmentRepository departmentRepository) {
		this.categoryRepository = categoryRepository;
		this.departmentRepository = departmentRepository;
	}

	@Transactional(readOnly = true)
	public List<ServiceCategoryResponse> findAll() {
		return categoryRepository.findAll().stream().map(ServiceCategoryResponse::from).toList();
	}

	@Transactional(readOnly = true)
	public ServiceCategoryResponse findById(Long id) {
		return ServiceCategoryResponse.from(findCategory(id));
	}

	@Transactional
	public ServiceCategoryResponse create(ServiceCategoryRequest request) {
		String name = normalizeName(request);
		if (categoryRepository.existsByNameIgnoreCase(name)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Service category already exists");
		}
		if (request.routingCode() != null && categoryRepository.existsByRoutingCode(request.routingCode())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Service routing code already exists");
		}
		ServiceCategory category = new ServiceCategory(
				name,
				findDepartment(request.defaultDepartmentId()),
				request.routingCode(),
				request.subUnit(),
				request.commonKeywords(),
				request.priority());
		return ServiceCategoryResponse.from(categoryRepository.save(category));
	}

	@Transactional
	public ServiceCategoryResponse update(Long id, ServiceCategoryRequest request) {
		ServiceCategory category = findCategory(id);
		String name = normalizeName(request);
		if (categoryRepository.existsByNameIgnoreCase(name) && !category.getName().equalsIgnoreCase(name)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Service category already exists");
		}
		if (request.routingCode() != null
				&& categoryRepository.findByRoutingCode(request.routingCode())
						.filter(existing -> !existing.getId().equals(id))
						.isPresent()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Service routing code already exists");
		}
		category.setName(name);
		category.setDefaultDepartment(findDepartment(request.defaultDepartmentId()));
		category.setRoutingCode(request.routingCode());
		category.setSubUnit(request.subUnit());
		category.setCommonKeywords(request.commonKeywords());
		category.setPriority(request.priority());
		return ServiceCategoryResponse.from(categoryRepository.save(category));
	}

	@Transactional
	public void delete(Long id) {
		ServiceCategory category = findCategory(id);
		category.setActive(false);
		categoryRepository.save(category);
	}

	private ServiceCategory findCategory(Long id) {
		return categoryRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service category not found"));
	}

	private Department findDepartment(Long departmentId) {
		if (departmentId == null) {
			return null;
		}
		return departmentRepository.findById(departmentId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
	}

	private String normalizeName(ServiceCategoryRequest request) {
		if (request == null || request.name() == null || request.name().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service category name is required");
		}
		return request.name().trim();
	}
}
