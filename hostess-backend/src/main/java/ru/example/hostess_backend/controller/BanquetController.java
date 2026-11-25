package ru.example.hostess_backend.controller;

import ru.example.hostess_backend.model.Banquet;
import ru.example.hostess_backend.service.BanquetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/banquets")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BanquetController {

    private final BanquetService banquetService;

    @GetMapping
    public List<Banquet> getAllBanquets() {
        return banquetService.getAllBanquets();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Banquet> getBanquetById(@PathVariable Long id) {
        return ResponseEntity.ok(banquetService.getBanquetById(id));
    }

    @GetMapping("/by-reservation/{reservationId}")
    public ResponseEntity<Banquet> getBanquetByReservationId(@PathVariable Long reservationId) {
        return ResponseEntity.ok(banquetService.getBanquetByReservationId(reservationId));
    }

    @PostMapping
    public ResponseEntity<Banquet> createBanquet(
            @RequestParam Long reservationId,
            @RequestBody Banquet banquet) {
        return ResponseEntity.ok(banquetService.createBanquet(reservationId, banquet));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Banquet> updateBanquet(
            @PathVariable Long id,
            @RequestBody Banquet banquet) {
        return ResponseEntity.ok(banquetService.updateBanquet(id, banquet));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanquet(@PathVariable Long id) {
        banquetService.deleteBanquet(id);
        return ResponseEntity.noContent().build();
    }
}
