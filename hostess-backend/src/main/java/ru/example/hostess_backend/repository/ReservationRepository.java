package ru.example.hostess_backend.repository;

import ru.example.hostess_backend.model.Reservation;
import ru.example.hostess_backend.model.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByDate(LocalDate date);
    List<Reservation> findByDateAndType(LocalDate date, Reservation.ReservationType type);
    List<Reservation> findByDateAndTable(LocalDate date, RestaurantTable table);
    List<Reservation> findByDateAndStatusNot(LocalDate date, Reservation.ReservationStatus status);
}
