package com.example.accessing_data_jpa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/properties")
@CrossOrigin(origins = "*")
public class PropertyController {

    private final PropertyRepository propertyRepository;

    public PropertyController(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    // Obtener propiedades con paginación
    @GetMapping
    public ResponseEntity<Page<Property>> getProperties(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Property> properties = propertyRepository.findAll(pageable);
        return ResponseEntity.ok(properties);
    }

    // Buscar propiedades por dirección
    @GetMapping("/search")
    public ResponseEntity<List<Property>> searchProperties(@RequestParam(required = false) String address) {
        if (address == null || address.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(propertyRepository.findByAddressContainingIgnoreCase(address));
    }

    @GetMapping("/filter")
    public List<Property> findByFilters(
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minSize,
            @RequestParam(required = false) Double maxSize) {

        List<Property> filteredProperties = propertyRepository.findAll();

        if (minPrice != null && maxPrice != null) {
            filteredProperties = propertyRepository.findByPriceBetween(minPrice, maxPrice);
        }

        if (minSize != null && maxSize != null) {
            filteredProperties.retainAll(propertyRepository.findBySizeBetween(minSize, maxSize));
        }

        return filteredProperties;
    }

    // Obtener una propiedad por ID
    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        return propertyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear una nueva propiedad
    @PostMapping
    public ResponseEntity<Property> createProperty(@RequestBody Property property) {
        if (property.getAddress() == null || property.getAddress().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Property savedProperty = propertyRepository.save(property);
        return ResponseEntity.ok(savedProperty);
    }

    // Actualizar una propiedad existente
    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id, @RequestBody Property updatedProperty) {
        return propertyRepository.findById(id)
                .map(property -> {
                    property.setAddress(updatedProperty.getAddress());
                    property.setPrice(updatedProperty.getPrice());
                    property.setSize(updatedProperty.getSize());
                    property.setDescription(updatedProperty.getDescription());
                    return ResponseEntity.ok(propertyRepository.save(property));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar una propiedad por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        if (!propertyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        propertyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
