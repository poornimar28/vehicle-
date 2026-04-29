package com.AutoServix.repository;

import com.AutoServix.models.Mechanic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MechanicRepository extends JpaRepository<Mechanic, Integer> {
    List<Mechanic> findByMechName(String mechName);

    List<Mechanic> findByCustomerName(String customerName);

    List<Mechanic> findByCustomerId(Integer customerId);
}
