package rw.rra.taxpayerservice.domain;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {

	boolean existsByNameIgnoreCase(String name);

	boolean existsByRoutingCode(String routingCode);

	Optional<ServiceCategory> findByRoutingCode(String routingCode);
}
