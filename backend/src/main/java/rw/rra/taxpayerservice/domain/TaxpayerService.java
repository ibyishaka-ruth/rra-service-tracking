package rw.rra.taxpayerservice.domain;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TaxpayerService {

	private final TaxpayerRepository taxpayerRepository;

	public TaxpayerService(TaxpayerRepository taxpayerRepository) {
		this.taxpayerRepository = taxpayerRepository;
	}

	public TaxpayerResponse findByTin(String tin) {
		return taxpayerRepository.findByTin(tin.trim())
				.map(TaxpayerResponse::from)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Taxpayer not found"));
	}

	@Transactional
	public TaxpayerResponse create(TaxpayerRequest request) {
		if (request == null || request.tin() == null || request.tin().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "TIN is required");
		}
		String tin = request.tin().trim();
		if (taxpayerRepository.existsByTinIgnoreCase(tin)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Taxpayer with this TIN already exists");
		}
		return TaxpayerResponse.from(taxpayerRepository.save(new Taxpayer(tin)));
	}
}