package ru.example.hostess_backend.repository;

import ru.example.hostess_backend.model.Banquet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BanquetRepository extends JpaRepository<Banquet, Long> {
    Optional<Banquet> findByReservationId(Long reservationId);
}
