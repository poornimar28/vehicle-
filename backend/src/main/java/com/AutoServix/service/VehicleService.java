package com.AutoServix.service;

import com.AutoServix.dto.VehicleRequest;
import com.AutoServix.models.Customer;
import com.AutoServix.models.Vehicle;
import com.AutoServix.repository.CustomerRepository;
import com.AutoServix.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public List<Vehicle> getCustomerVehicles(String email) {
        Customer customer = customerRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Customer not found"));
        return vehicleRepository.findByCustomerId(customer.getId());
    }

    public Vehicle addVehicle(String email, VehicleRequest request) {
        Customer customer = customerRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Customer not found"));
        Vehicle vehicle = new Vehicle(
                request.getMake(),
                request.getModel(),
                request.getModelNumber(),
                request.getYear(),
                request.getChassisNumber(),
                customer
        );
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(String email, Integer vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new RuntimeException("Vehicle not found"));
        if (!vehicle.getCustomer().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        vehicleRepository.delete(vehicle);
    }
}
