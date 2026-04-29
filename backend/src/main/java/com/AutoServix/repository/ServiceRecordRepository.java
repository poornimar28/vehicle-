package com.AutoServix.repository;

import com.AutoServix.models.ServiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRecordRepository extends JpaRepository<ServiceRecord, Integer> {
    List<ServiceRecord> findByVehicleCustomerId(Integer customerId);
    List<ServiceRecord> findByVehicleId(Integer vehicleId);
}
