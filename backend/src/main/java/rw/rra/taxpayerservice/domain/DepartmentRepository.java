package rw.rra.taxpayerservice.domain;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

	Optional<Department> findByNameIgnoreCase(String name);

	boolean existsByNameIgnoreCase(String name);
}
