package com.AutoServix.repository;

import com.AutoServix.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    // Find by email (for login)
    Optional<Customer> findByEmail(String email);

    // Find by name
    List<Customer> findByName(String name);

    // Find by brand
    List<Customer> findByBrand(String brand);

    // Find by role
    List<Customer> findByRole(String role);

    // Check if email already exists (for registration validation)
    boolean existsByEmail(String email);

    // Check if chassisNo already exists
    boolean existsByChassisNo(Integer chassisNo);
}