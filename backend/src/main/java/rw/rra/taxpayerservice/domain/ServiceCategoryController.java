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
@RequestMapping("/api/v1/service-categories")
public class ServiceCategoryController {

	private final ServiceCategoryService categoryService;

	public ServiceCategoryController(ServiceCategoryService categoryService) {
		this.categoryService = categoryService;
	}

	@GetMapping
	public List<ServiceCategoryResponse> findAll() {
		return categoryService.findAll();
	}

	@GetMapping("/{id}")
	public ServiceCategoryResponse findById(@PathVariable Long id) {
		return categoryService.findById(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ServiceCategoryResponse create(@Valid @RequestBody ServiceCategoryRequest request) {
		return categoryService.create(request);
	}

	@PutMapping("/{id}")
	public ServiceCategoryResponse update(@PathVariable Long id, @Valid @RequestBody ServiceCategoryRequest request) {
		return categoryService.update(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		categoryService.delete(id);
	}
}
