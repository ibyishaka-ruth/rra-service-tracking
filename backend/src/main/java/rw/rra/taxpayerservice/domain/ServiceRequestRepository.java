package rw.rra.taxpayerservice.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

	List<ServiceRequest> findByVisit_IdOrderByCreatedAtDesc(Long visitId);
}
