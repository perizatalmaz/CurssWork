package ru.example.hostess_backend.repository;

import ru.example.hostess_backend.model.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<RestaurantTable, Long> {
    List<RestaurantTable> findByCapacityGreaterThanEqual(Integer capacity);
    List<RestaurantTable> findByHallName(String hallName);
}
