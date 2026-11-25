package ru.example.hostess_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Название блюда не может быть пустым")
    @Column(nullable = false)
    private String name;

    private Double price;

    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "banquet_id", nullable = false)
    private Banquet banquet;
}
