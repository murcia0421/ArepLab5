package com.example.accessing_data_jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByAddressContainingIgnoreCase(String address);

    List<Property> findByPriceBetween(Double minPrice, Double maxPrice);

    List<Property> findBySizeBetween(Double minSize, Double maxSize);
}
