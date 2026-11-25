package ru.example.hostess_backend.controller;

import ru.example.hostess_backend.model.Guest;
import ru.example.hostess_backend.service.GuestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/guests")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class GuestController {

    private final GuestService guestService;

    @GetMapping
    public List<Guest> getAllGuests() {
        return guestService.getAllGuests();
    }

    @GetMapping("/search")
    public List<Guest> searchGuests(@RequestParam(required = false) String name,
                                     @RequestParam(required = false) String phone) {
        if (name != null && !name.isEmpty()) {
            return guestService.searchByName(name);
        }
        if (phone != null && !phone.isEmpty()) {
            return guestService.searchByPhone(phone);
        }
        return guestService.getAllGuests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Guest> getGuestById(@PathVariable Long id) {
        return ResponseEntity.ok(guestService.getGuestById(id));
    }

    @PostMapping
    public ResponseEntity<Guest> createGuest(@Valid @RequestBody Guest guest) {
        return ResponseEntity.ok(guestService.createGuest(guest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Guest> updateGuest(@PathVariable Long id,
                                              @Valid @RequestBody Guest guest) {
        return ResponseEntity.ok(guestService.updateGuest(id, guest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuest(@PathVariable Long id) {
        guestService.deleteGuest(id);
        return ResponseEntity.noContent().build();
    }
}
