package com.AutoServix.repository;

import com.AutoServix.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByCustomerId(Integer customerId);
    List<Appointment> findByVehicleId(Integer vehicleId);
    List<Appointment> findByStatusIn(List<String> statuses);
}
