package rw.rra.taxpayerservice.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitRepository extends JpaRepository<Visit, Long> {

	List<Visit> findByTaxpayer_TinOrderByArrivedAtDesc(String tin);
}
