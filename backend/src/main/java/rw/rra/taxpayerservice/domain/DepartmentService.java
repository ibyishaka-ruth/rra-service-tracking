package rw.rra.taxpayerservice.domain;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DepartmentService {

	private final DepartmentRepository departmentRepository;

	public DepartmentService(DepartmentRepository departmentRepository) {
		this.departmentRepository = departmentRepository;
	}

	@Transactional(readOnly = true)
	public List<DepartmentResponse> findAll() {
		return departmentRepository.findAll().stream()
				.map(DepartmentResponse::from)
				.toList();
	}

	@Transactional(readOnly = true)
	public DepartmentResponse findById(Long id) {
		Department department = departmentRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
		return DepartmentResponse.from(department);
	}

	@Transactional
	public DepartmentResponse create(DepartmentRequest request) {
		String normalizedName = normalizeName(request);
		if (departmentRepository.existsByNameIgnoreCase(normalizedName)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Department already exists");
		}
		Department department = new Department(normalizedName);
		return DepartmentResponse.from(departmentRepository.save(department));
	}

	@Transactional
	public DepartmentResponse update(Long id, DepartmentRequest request) {
		Department department = departmentRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
		String normalizedName = normalizeName(request);
		if (departmentRepository.existsByNameIgnoreCase(normalizedName) && !department.getName().equalsIgnoreCase(normalizedName)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Department already exists");
		}
		department.setName(normalizedName);
		return DepartmentResponse.from(departmentRepository.save(department));
	}

	@Transactional
	public void delete(Long id) {
		Department department = departmentRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
		department.setActive(false);
		departmentRepository.save(department);
	}

	private String normalizeName(DepartmentRequest request) {
		if (request == null || request.name() == null || request.name().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Department name is required");
		}
		return request.name().trim();
	}
}
