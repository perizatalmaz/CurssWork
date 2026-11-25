package ru.example.hostess_backend.service;

import ru.example.hostess_backend.model.Guest;
import ru.example.hostess_backend.repository.GuestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

// Сервис для работы с гостями ресторана
@Service
@RequiredArgsConstructor
public class GuestService {

    private final GuestRepository guestRepository;

    // Получить список всех гостей
    public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }

    // Найти гостя по идентификатору
    public Guest getGuestById(Long id) {
        return guestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Гость не найден: " + id));
    }

    // Поиск гостей по имени
    public List<Guest> searchByName(String name) {
        return guestRepository.findByNameContainingIgnoreCase(name);
    }

    // Поиск гостей по телефону
    public List<Guest> searchByPhone(String phone) {
        return guestRepository.findByPhoneContaining(phone);
    }

    // Создать нового гостя
    public Guest createGuest(Guest guest) {
        return guestRepository.save(guest);
    }

    // Обновить данные гостя
    public Guest updateGuest(Long id, Guest updatedGuest) {
        Guest existing = getGuestById(id);
        existing.setName(updatedGuest.getName());
        existing.setSurname(updatedGuest.getSurname());
        existing.setPhone(updatedGuest.getPhone());
        existing.setComment(updatedGuest.getComment());
        return guestRepository.save(existing);
    }

    // Удалить гостя по идентификатору
    public void deleteGuest(Long id) {
        guestRepository.deleteById(id);
    }
}
