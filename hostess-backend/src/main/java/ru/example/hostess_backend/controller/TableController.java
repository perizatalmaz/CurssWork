package ru.example.hostess_backend.controller;

import ru.example.hostess_backend.model.RestaurantTable;
import ru.example.hostess_backend.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    @GetMapping
    public List<RestaurantTable> getAllTables() {
        return tableService.getAllTables();
    }

    @GetMapping("/available")
    public List<RestaurantTable> getAvailableTables(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime timeStart,
            @RequestParam(defaultValue = "2") Integer durationHours,
            @RequestParam(defaultValue = "1") Integer guestsCount) {
        return tableService.getAllTables();
    }

    @PostMapping
    public ResponseEntity<RestaurantTable> createTable(@RequestBody RestaurantTable table) {
        return ResponseEntity.ok(tableService.createTable(table));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }
}
