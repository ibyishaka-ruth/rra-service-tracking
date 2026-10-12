package rw.rra.taxpayerservice.domain;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/taxpayers")
public class TaxpayerController {

	private final TaxpayerService taxpayerService;

	public TaxpayerController(TaxpayerService taxpayerService) {
		this.taxpayerService = taxpayerService;
	}

	@GetMapping("/{tin}")
	public TaxpayerResponse findByTin(@PathVariable String tin) {
		return taxpayerService.findByTin(tin);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public TaxpayerResponse create(@Valid @RequestBody TaxpayerRequest request) {
		return taxpayerService.create(request);
	}
}