package ru.example.hostess_backend.service;

import ru.example.hostess_backend.model.Guest;
import ru.example.hostess_backend.repository.GuestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GuestService {

    private final GuestRepository guestRepository;

    public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }

    public Guest getGuestById(Long id) {
        return guestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Гость не найден: " + id));
    }

    public List<Guest> searchByName(String name) {
        return guestRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Guest> searchByPhone(String phone) {
        return guestRepository.findByPhoneContaining(phone);
    }

    public Guest createGuest(Guest guest) {
        return guestRepository.save(guest);
    }

    public Guest updateGuest(Long id, Guest updatedGuest) {
        Guest existing = getGuestById(id);
        existing.setName(updatedGuest.getName());
        existing.setSurname(updatedGuest.getSurname());
        existing.setPhone(updatedGuest.getPhone());
        existing.setComment(updatedGuest.getComment());
        return guestRepository.save(existing);
    }

    public void deleteGuest(Long id) {
        guestRepository.deleteById(id);
    }
}
