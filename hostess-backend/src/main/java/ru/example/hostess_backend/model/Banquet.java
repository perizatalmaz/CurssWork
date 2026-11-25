package ru.example.hostess_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "banquets")
public class Banquet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    private Double deposit;

    private String menuNote;

    @OneToMany(mappedBy = "banquet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MenuItem> menuItems;
}
