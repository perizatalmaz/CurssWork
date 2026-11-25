package ru.example.hostess_backend.repository;

import ru.example.hostess_backend.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {
    List<Guest> findByNameContainingIgnoreCase(String name);
    List<Guest> findByPhoneContaining(String phone);
}
