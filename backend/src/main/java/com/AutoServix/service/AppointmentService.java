package com.AutoServix.service;

import com.AutoServix.dto.AppointmentRequest;
import com.AutoServix.models.Appointment;
import com.AutoServix.models.Customer;
import com.AutoServix.models.Vehicle;
import com.AutoServix.repository.AppointmentRepository;
import com.AutoServix.repository.CustomerRepository;
import com.AutoServix.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    public List<Appointment> getCustomerAppointments(String email) {
        Customer customer = customerRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Customer not found"));
        return appointmentRepository.findByCustomerId(customer.getId());
    }

    public List<Appointment> getUpcomingCustomerAppointments(String email) {
        Customer customer = customerRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Customer not found"));
        List<Appointment> all = appointmentRepository.findByCustomerId(customer.getId());
        return all.stream()
                .filter(a -> Arrays.asList("BOOKED", "ACCEPTED").contains(a.getStatus()))
                .toList();
    }

    public Appointment bookAppointment(String email, AppointmentRequest request) {
        Customer customer = customerRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Customer not found"));
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId()).orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (!vehicle.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("Unauthorized: Vehicle does not belong to user");
        }

        Appointment appointment = new Appointment(
                request.getDate(),
                request.getTimeSlot(),
                "BOOKED",
                request.getNotes(),
                customer,
                vehicle
        );
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAdminAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment updateStatus(Integer id, String status) {
        Appointment appointment = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }
}
