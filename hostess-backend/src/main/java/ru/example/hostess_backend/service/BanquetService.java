package ru.example.hostess_backend.service;

import ru.example.hostess_backend.model.Banquet;
import ru.example.hostess_backend.model.Reservation;
import ru.example.hostess_backend.repository.BanquetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BanquetService {

    private final BanquetRepository banquetRepository;
    private final ReservationService reservationService;

    public List<Banquet> getAllBanquets() {
        return banquetRepository.findAll();
    }

    public Banquet getBanquetById(Long id) {
        return banquetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Банкет не найден: " + id));
    }

    public Banquet getBanquetByReservationId(Long reservationId) {
        return banquetRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new RuntimeException("Банкет не найден для брони: " + reservationId));
    }

    public Banquet createBanquet(Long reservationId, Banquet banquet) {
        Reservation reservation = reservationService.getReservationById(reservationId);
        if (reservation.getType() != Reservation.ReservationType.BANQUET) {
            throw new RuntimeException("Бронирование не является банкетом!");
        }
        banquet.setReservation(reservation);
        return banquetRepository.save(banquet);
    }

    public Banquet updateBanquet(Long id, Banquet updated) {
        Banquet existing = getBanquetById(id);
        existing.setDeposit(updated.getDeposit());
        existing.setMenuNote(updated.getMenuNote());
        return banquetRepository.save(existing);
    }

    public void deleteBanquet(Long id) {
        banquetRepository.deleteById(id);
    }
}
