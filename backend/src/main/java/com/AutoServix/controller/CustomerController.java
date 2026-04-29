package com.AutoServix.controller;

import com.AutoServix.models.Customer;
import com.AutoServix.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private CustomerService service;

    // GET all customers
    @GetMapping("/all")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(service.getAllCustomers());
    }

    // GET customer by ID
    @GetMapping("/id/{id}")
    public ResponseEntity<Optional<Customer>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // GET customer by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Optional<Customer>> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(service.getByEmail(email));
    }

    // GET customers by name
    @GetMapping("/name/{name}")
    public ResponseEntity<List<Customer>> getByName(@PathVariable String name) {
        return ResponseEntity.ok(service.getByName(name));
    }

    // GET customers by brand
    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<Customer>> getByBrand(@PathVariable String brand) {
        return ResponseEntity.ok(service.getByBrand(brand));
    }

    // POST register new customer
    @PostMapping("/register")
    public ResponseEntity<Customer> register(@RequestBody Customer customer) {
        return ResponseEntity.ok(service.registerCustomer(customer));
    }

    // PUT update customer details
    @PutMapping("/update/{id}")
    public ResponseEntity<Customer> update(@PathVariable Integer id, @RequestBody Customer customer) {
        return ResponseEntity.ok(service.updateCustomer(id, customer));
    }

    // PUT book a slot
    @PutMapping("/slot/{id}")
    public ResponseEntity<Customer> bookSlot(@PathVariable Integer id, @RequestParam String slot) {
        LocalDateTime slotTime = LocalDateTime.parse(slot);
        return ResponseEntity.ok(service.bookSlot(id, slotTime));
    }

    // PUT increment service count
    @PutMapping("/service-done/{id}")
    public ResponseEntity<Customer> incrementService(@PathVariable Integer id) {
        return ResponseEntity.ok(service.incrementServiceCount(id));
    }

    // DELETE customer
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        service.deleteCustomer(id);
        return ResponseEntity.ok("Customer deleted successfully.");
    }
}