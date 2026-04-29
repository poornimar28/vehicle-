package com.AutoServix.service;

import com.AutoServix.models.Customer;
import com.AutoServix.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repo;

    // Get all customers
    public List<Customer> getAllCustomers() {
        return repo.findAll();
    }

    // Get customer by ID
    public Optional<Customer> getById(Integer id) {
        return repo.findById(id);
    }

    // Get customer by email
    public Optional<Customer> getByEmail(String email) {
        return repo.findByEmail(email);
    }

    // Get customers by name
    public List<Customer> getByName(String name) {
        return repo.findByName(name);
    }

    // Get customers by brand
    public List<Customer> getByBrand(String brand) {
        return repo.findByBrand(brand);
    }

    // Register new customer
    public Customer registerCustomer(Customer customer) {
        if (repo.existsByEmail(customer.getEmail())) {
            throw new RuntimeException("Email already registered: " + customer.getEmail());
        }
        if (repo.existsByChassisNo(customer.getChassisNo())) {
            throw new RuntimeException("Chassis number already registered: " + customer.getChassisNo());
        }
        customer.setRole("USER");
        if (customer.getServiceCount() == null) {
            customer.setServiceCount(0);
        }
        return repo.save(customer);
    }

    // Update customer details
    public Customer updateCustomer(Integer id, Customer updatedData) {
        Customer existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        existing.setName(updatedData.getName());
        existing.setEmail(updatedData.getEmail());
        existing.setModelNo(updatedData.getModelNo());
        existing.setBrand(updatedData.getBrand());
        existing.setChassisNo(updatedData.getChassisNo());
        existing.setSlot(updatedData.getSlot());

        return repo.save(existing);
    }

    // Update slot (book appointment)
    public Customer bookSlot(Integer id, java.time.LocalDateTime slot) {
        Customer existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        existing.setSlot(slot);
        return repo.save(existing);
    }

    // Increment service count after a service is done
    public Customer incrementServiceCount(Integer id) {
        Customer existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        existing.setServiceCount(existing.getServiceCount() + 1);
        return repo.save(existing);
    }

    // Delete customer
    public void deleteCustomer(Integer id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Customer not found with id: " + id);
        }
        repo.deleteById(id);
    }
}