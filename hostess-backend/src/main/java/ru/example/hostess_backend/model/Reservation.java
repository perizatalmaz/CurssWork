package ru.example.hostess_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status = ReservationStatus.NEW;

    @NotNull(message = "Дата обязательна")
    @Column(nullable = false)
    private LocalDate date;

    @NotNull(message = "Время начала обязательно")
    @Column(nullable = false)
    private LocalTime timeStart;

    @Column(nullable = false)
    private Integer durationHours = 2;

    @Min(value = 1, message = "Минимум 1 гость")
    @Column(nullable = false)
    private Integer guestsCount;

    private String comment;

    @ManyToOne
    @JoinColumn(name = "guest_id", nullable = false)
    private Guest guest;

    @ManyToOne
    @JoinColumn(name = "table_id", nullable = false)
    private RestaurantTable table;

    public enum ReservationType {
        RESERVE, BANQUET
    }

    public enum ReservationStatus {
        NEW, ACTIVE, LATE, PREPARING, COMPLETED, CANCELLED
    }
}
