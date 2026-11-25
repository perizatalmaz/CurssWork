package ru.example.hostess_backend.service;

import ru.example.hostess_backend.model.Guest;
import ru.example.hostess_backend.model.Reservation;
import ru.example.hostess_backend.model.RestaurantTable;
import ru.example.hostess_backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

// Сервис для управления бронированиями
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final GuestService guestService;
    private final TableService tableService;

    // Получить все бронирования на указанную дату
    public List<Reservation> getReservationsByDate(LocalDate date) {
        return reservationRepository.findByDate(date);
    }

    // Получить бронирования по дате и типу
    public List<Reservation> getReservationsByDateAndType(LocalDate date,
                                                           Reservation.ReservationType type) {
        return reservationRepository.findByDateAndType(date, type);
    }

    // Найти бронирование по идентификатору
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Бронь не найдена: " + id));
    }

    // Создать новое бронирование с проверкой занятости стола
    public Reservation createReservation(Long guestId, Long tableId, Reservation reservation) {
        Guest guest = guestService.getGuestById(guestId);
        RestaurantTable table = tableService.getTableById(tableId);

        // Проверяем что стол свободен в указанное время
        boolean available = tableService.isTableAvailable(
                table, reservation.getDate(),
                reservation.getTimeStart(), reservation.getDurationHours());

        if (!available) {
            throw new RuntimeException("Стол № " + table.getNumber() + " уже занят!");
        }

        reservation.setGuest(guest);
        reservation.setTable(table);
        reservation.setStatus(Reservation.ReservationStatus.NEW);
        return reservationRepository.save(reservation);
    }

    // Изменить статус бронирования
    public Reservation updateStatus(Long id, Reservation.ReservationStatus status) {
        Reservation reservation = getReservationById(id);
        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }

    // Отменить бронирование
    public Reservation cancelReservation(Long id) {
        return updateStatus(id, Reservation.ReservationStatus.CANCELLED);
    }

    // Обновить данные бронирования
    public Reservation updateReservation(Long id, Reservation updated) {
        Reservation existing = getReservationById(id);
        existing.setDate(updated.getDate());
        existing.setTimeStart(updated.getTimeStart());
        existing.setDurationHours(updated.getDurationHours());
        existing.setGuestsCount(updated.getGuestsCount());
        existing.setComment(updated.getComment());
        return reservationRepository.save(existing);
    }

    // Удалить бронирование
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }
}
