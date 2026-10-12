package rw.rra.taxpayerservice.domain;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

	Optional<Feedback> findByServiceRequestId(Long serviceRequestId);
}
