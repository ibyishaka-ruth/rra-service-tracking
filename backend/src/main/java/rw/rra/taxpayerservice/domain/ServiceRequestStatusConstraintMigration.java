package rw.rra.taxpayerservice.domain;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ServiceRequestStatusConstraintMigration implements ApplicationRunner {

	private static final Logger logger = LoggerFactory.getLogger(ServiceRequestStatusConstraintMigration.class);
	private static final String CONSTRAINT_NAME = "service_requests_status_check";
	private static final String STATUS_CHECK =
			"CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'NOT_COMPLETED'))";

	private final DataSource dataSource;
	private final JdbcTemplate jdbcTemplate;

	public ServiceRequestStatusConstraintMigration(DataSource dataSource, JdbcTemplate jdbcTemplate) {
		this.dataSource = dataSource;
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		if (!isPostgreSql()) {
			return;
		}

		List<String> definitions = jdbcTemplate.query(
				"SELECT pg_get_constraintdef(oid) FROM pg_constraint "
						+ "WHERE conrelid = 'service_requests'::regclass AND conname = ?",
				(resultSet, rowNumber) -> resultSet.getString(1),
				CONSTRAINT_NAME);
		if (definitions.stream().anyMatch(definition -> definition.contains("'PENDING'"))) {
			return;
		}

		jdbcTemplate.execute("ALTER TABLE service_requests DROP CONSTRAINT IF EXISTS " + CONSTRAINT_NAME);
		jdbcTemplate.execute("ALTER TABLE service_requests ADD CONSTRAINT " + CONSTRAINT_NAME + " " + STATUS_CHECK);
		logger.info("Updated {} to allow pending service requests", CONSTRAINT_NAME);
	}

	private boolean isPostgreSql() {
		try (Connection connection = dataSource.getConnection()) {
			return connection.getMetaData().getDatabaseProductName().equalsIgnoreCase("PostgreSQL");
		} catch (SQLException exception) {
			throw new IllegalStateException("Unable to determine the database before updating service request statuses",
					exception);
		}
	}
}
