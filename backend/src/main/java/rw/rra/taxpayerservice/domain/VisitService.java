package rw.rra.taxpayerservice.domain;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class VisitService {

	private final VisitRepository visitRepository;
	private final TaxpayerRepository taxpayerRepository;

	public VisitService(VisitRepository visitRepository, TaxpayerRepository taxpayerRepository) {
		this.visitRepository = visitRepository;
		this.taxpayerRepository = taxpayerRepository;
	}

	@Transactional
	public VisitResponse checkIn(VisitRequest request) {
		if (request == null || request.tin() == null || request.tin().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "TIN is required");
		}
		String tin = request.tin().trim();
		Taxpayer taxpayer = taxpayerRepository.findByTin(tin)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Taxpayer not found"));
		return VisitResponse.from(visitRepository.save(new Visit(taxpayer)));
	}

	@Transactional(readOnly = true)
	public VisitResponse findById(Long id) {
		Visit visit = visitRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Visit not found"));
		return VisitResponse.from(visit);
	}

	@Transactional(readOnly = true)
	public List<VisitResponse> findByTaxpayerTin(String tin) {
		String normalizedTin = tin == null ? "" : tin.trim();
		if (!taxpayerRepository.findByTin(normalizedTin).isPresent()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Taxpayer not found");
		}
		return visitRepository.findByTaxpayer_TinOrderByArrivedAtDesc(normalizedTin).stream()
				.map(VisitResponse::from)
				.toList();
	}
}
