package com.AutoServix.controller;

import com.AutoServix.dto.AppointmentRequest;
import com.AutoServix.models.Appointment;
import com.AutoServix.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication auth) {
        return ResponseEntity.ok(appointmentService.getCustomerAppointments(auth.getName()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Appointment>> getMyUpcomingAppointments(Authentication auth) {
        return ResponseEntity.ok(appointmentService.getUpcomingCustomerAppointments(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<Appointment> bookAppointment(Authentication auth, @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.bookAppointment(auth.getName(), request));
    }
}
