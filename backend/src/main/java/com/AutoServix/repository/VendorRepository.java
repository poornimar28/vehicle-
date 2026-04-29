package com.AutoServix.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AutoServix.models.Vendor;

public interface VendorRepository extends JpaRepository<Vendor , Integer> {

    List<Vendor> findByMechanicMechId(Integer mechanicId);

    List<Vendor> findByServiceid(Integer serviceid);

    List<Vendor> findByCustomerId(Integer customerId);

    List<Vendor> findAll();


}