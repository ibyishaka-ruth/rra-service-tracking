package rw.rra.taxpayerservice.domain;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/departments")
public class DepartmentController {

	private final DepartmentService departmentService;

	public DepartmentController(DepartmentService departmentService) {
		this.departmentService = departmentService;
	}

	@GetMapping
	public List<DepartmentResponse> findAll() {
		return departmentService.findAll();
	}

	@GetMapping("/{id}")
	public DepartmentResponse findById(@PathVariable Long id) {
		return departmentService.findById(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public DepartmentResponse create(@Valid @RequestBody DepartmentRequest request) {
		return departmentService.create(request);
	}

	@PutMapping("/{id}")
	public DepartmentResponse update(@PathVariable Long id, @Valid @RequestBody DepartmentRequest request) {
		return departmentService.update(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		departmentService.delete(id);
	}
}
