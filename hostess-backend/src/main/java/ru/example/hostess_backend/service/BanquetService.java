package ru.example.hostess_backend.service;

import ru.example.hostess_backend.model.Banquet;
import ru.example.hostess_backend.model.Reservation;
import ru.example.hostess_backend.repository.BanquetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

// Сервис для управления банкетами
@Service
@RequiredArgsConstructor
public class BanquetService {

    private final BanquetRepository banquetRepository;
    private final ReservationService reservationService;

    // Получить все банкеты
    public List<Banquet> getAllBanquets() {
        return banquetRepository.findAll();
    }

    // Найти банкет по идентификатору
    public Banquet getBanquetById(Long id) {
        return banquetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Банкет не найден: " + id));
    }

    // Найти банкет по идентификатору бронирования
    public Banquet getBanquetByReservationId(Long reservationId) {
        return banquetRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new RuntimeException("Банкет не найден для брони: " + reservationId));
    }

    // Создать банкет на основе существующего бронирования
    public Banquet createBanquet(Long reservationId, Banquet banquet) {
        Reservation reservation = reservationService.getReservationById(reservationId);
        if (reservation.getType() != Reservation.ReservationType.BANQUET) {
            throw new RuntimeException("Бронирование не является банкетом!");
        }
        banquet.setReservation(reservation);
        return banquetRepository.save(banquet);
    }

    // Обновить данные банкета
    public Banquet updateBanquet(Long id, Banquet updated) {
        Banquet existing = getBanquetById(id);
        existing.setDeposit(updated.getDeposit());
        existing.setMenuNote(updated.getMenuNote());
        return banquetRepository.save(existing);
    }

    // Удалить банкет
    public void deleteBanquet(Long id) {
        banquetRepository.deleteById(id);
    }
}
