package rw.rra.taxpayerservice.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

	List<Feedback> findAllByOrderBySubmittedAtDesc();

	Optional<Feedback> findByServiceRequestId(Long serviceRequestId);
}
