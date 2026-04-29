package com.AutoServix.controller;

import com.AutoServix.models.Appointment;
import com.AutoServix.models.ServiceRecord;
import com.AutoServix.service.AppointmentService;
import com.AutoServix.service.ServiceRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private ServiceRecordService serviceRecordService;

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAdminAppointments());
    }

    @PatchMapping("/appointments/{id}/accept")
    public ResponseEntity<Appointment> acceptAppointment(@PathVariable Integer id) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, "ACCEPTED"));
    }

    @PatchMapping("/appointments/{id}/reject")
    public ResponseEntity<Appointment> rejectAppointment(@PathVariable Integer id) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, "REJECTED"));
    }

    @GetMapping("/services")
    public ResponseEntity<List<ServiceRecord>> getAllServiceHistory() {
        return ResponseEntity.ok(serviceRecordService.getAllAdminServiceHistory());
    }
}
