package com.AutoServix.controller;

import com.AutoServix.dto.VehicleRequest;
import com.AutoServix.models.Vehicle;
import com.AutoServix.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<Vehicle>> getMyVehicles(Authentication auth) {
        return ResponseEntity.ok(vehicleService.getCustomerVehicles(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<Vehicle> addVehicle(Authentication auth, @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.addVehicle(auth.getName(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(Authentication auth, @PathVariable Integer id) {
        vehicleService.deleteVehicle(auth.getName(), id);
        return ResponseEntity.ok().build();
    }
}
