package ru.example.hostess_backend.service;

import ru.example.hostess_backend.model.Reservation;
import ru.example.hostess_backend.model.RestaurantTable;
import ru.example.hostess_backend.repository.ReservationRepository;
import ru.example.hostess_backend.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

// Сервис для работы со столами ресторана
@Service
@RequiredArgsConstructor
public class TableService {

    private final TableRepository tableRepository;
    private final ReservationRepository reservationRepository;

    // Получить все столы
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    // Найти стол по идентификатору
    public RestaurantTable getTableById(Long id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Стол не найден: " + id));
    }

    // Сохранить новый стол
    public RestaurantTable createTable(RestaurantTable table) {
        return tableRepository.save(table);
    }

    // Удалить стол
    public void deleteTable(Long id) {
        tableRepository.deleteById(id);
    }

    // Проверяет свободен ли стол в указанное время
    public boolean isTableAvailable(RestaurantTable table, LocalDate date,
                                     LocalTime timeStart, Integer durationHours) {
        List<Reservation> reservations = reservationRepository.findByDateAndTable(date, table);
        LocalTime timeEnd = timeStart.plusHours(durationHours);

        for (Reservation r : reservations) {
            // Пропускаем отменённые бронирования
            if (r.getStatus() == Reservation.ReservationStatus.CANCELLED) continue;
            LocalTime rStart = r.getTimeStart();
            LocalTime rEnd = rStart.plusHours(r.getDurationHours());
            // Проверяем пересечение временных интервалов
            boolean overlaps = timeStart.isBefore(rEnd) && timeEnd.isAfter(rStart);
            if (overlaps) return false;
        }
        return true;
    }
}
