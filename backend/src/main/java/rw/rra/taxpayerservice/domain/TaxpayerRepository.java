package rw.rra.taxpayerservice.domain;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaxpayerRepository extends JpaRepository<Taxpayer, Long> {

	Optional<Taxpayer> findByTin(String tin);

	boolean existsByTinIgnoreCase(String tin);
}