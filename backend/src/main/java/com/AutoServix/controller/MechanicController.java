package com.AutoServix.controller;

import com.AutoServix.models.Mechanic;
import com.AutoServix.service.MechanicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/mechanic")
public class MechanicController {
    @Autowired
    private MechanicService serv;

    @GetMapping("/all")
    public ResponseEntity<List<Mechanic>> getAllMech() {
        return ResponseEntity.ok(serv.getAllMechanics());
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Optional<Mechanic>> getMechanicById(@PathVariable Integer id) {
        return ResponseEntity.ok(serv.getByid(id));
    }

    @GetMapping("/name/{mechName}")
    public ResponseEntity<List<Mechanic>> getByName(@PathVariable String mechName) {
        return ResponseEntity.ok(serv.getbyName(mechName));
    }

    @GetMapping("/customername/{customerName}")
    public ResponseEntity<List<Mechanic>> getByCustomerName(@PathVariable String customerName) {
        return ResponseEntity.ok(serv.getByCustomerName(customerName));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Mechanic>> getByCustomerId(@PathVariable Integer customerId) {
        return ResponseEntity.ok(serv.getByCustomerId(customerId));
    }

    @PostMapping("/add")
    public ResponseEntity<Mechanic> addMechanic(@RequestBody Mechanic mechanic) {
        return ResponseEntity.ok(serv.addMechanic(mechanic));
    }
}
