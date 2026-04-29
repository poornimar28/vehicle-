package com.AutoServix.service;

import com.AutoServix.models.Mechanic;
import com.AutoServix.repository.MechanicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MechanicService {
    @Autowired
    private MechanicRepository repo;

    public List<Mechanic> getAllMechanics() {
        return repo.findAll();
    }

    public Optional<Mechanic> getByid(Integer Id) {
        Optional<Mechanic> val = repo.findById(Id);
        return val;
    }

    public List<Mechanic> getbyName(String name) {
        return repo.findByMechName(name);
    }

    public List<Mechanic> getByCustomerName(String customerName) {
        return repo.findByCustomerName(customerName);
    }

    public List<Mechanic> getByCustomerId(Integer customerId) {
        return repo.findByCustomerId(customerId);
    }

    public Mechanic addMechanic(Mechanic mechanic) {
        return repo.save(mechanic);
    }

}
