package com.AutoServix.config;

import com.AutoServix.models.Appointment;
import com.AutoServix.models.Customer;
import com.AutoServix.models.ServiceRecord;
import com.AutoServix.models.Vehicle;
import com.AutoServix.repository.AppointmentRepository;
import com.AutoServix.repository.CustomerRepository;
import com.AutoServix.repository.ServiceRecordRepository;
import com.AutoServix.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private CustomerRepository customerRepo;
    @Autowired private VehicleRepository vehicleRepo;
    @Autowired private AppointmentRepository appointmentRepo;
    @Autowired private ServiceRecordRepository serviceRecordRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (customerRepo.count() > 0) {
            System.out.println("Database already has data, skipping seed.");
            return;
        }

        String password = passwordEncoder.encode("demo123");

        // --- Users ---
        Customer customer = new Customer("Rahul Sharma", "customer@demo.com", password);
        customer.setRole("CUSTOMER");
        customerRepo.save(customer);

        Customer admin = new Customer("Admin User", "admin@demo.com", password);
        admin.setRole("ADMIN");
        customerRepo.save(admin);

        // --- Vehicles ---
        Vehicle vehicle1 = new Vehicle("Honda", "City", "MH12-AB-1234", 2020, "CHN-2020-HONDA-001", customer);
        vehicleRepo.save(vehicle1);

        Vehicle vehicle2 = new Vehicle("Maruti", "Swift", "MH14-CD-5678", 2019, "MRU-2019-SWIFT-002", customer);
        vehicleRepo.save(vehicle2);

        // --- Appointments ---
        Appointment upcoming = new Appointment(
                LocalDate.now().plusDays(3), "10:00 AM", "BOOKED",
                "Regular oil change and tyre check", customer, vehicle1);
        appointmentRepo.save(upcoming);

        Appointment accepted = new Appointment(
                LocalDate.now().plusDays(7), "02:00 PM", "ACCEPTED",
                "AC not cooling well — check refrigerant", customer, vehicle2);
        appointmentRepo.save(accepted);

        Appointment past = new Appointment(
                LocalDate.now().minusDays(15), "11:00 AM", "COMPLETED",
                "Brake pads replacement", customer, vehicle1);
        appointmentRepo.save(past);

        Appointment past2 = new Appointment(
                LocalDate.now().minusDays(60), "09:00 AM", "COMPLETED",
                "Full service — 20,000 km", customer, vehicle2);
        appointmentRepo.save(past2);

        // --- Service Records ---
        ServiceRecord record1 = new ServiceRecord(
                LocalDate.now().minusDays(15),
                "Front brake pads worn out",
                "Replaced front brake pads. Rear brakes in good condition.",
                3500.0, "Good", "Ramesh Patil", 5, vehicle1);
        serviceRecordRepo.save(record1);

        ServiceRecord record2 = new ServiceRecord(
                LocalDate.now().minusDays(60),
                "Engine air filter clogged. Minor oil leak near gasket.",
                "Full 20k service completed. Air filter replaced. Gasket sealed.",
                8200.0, "Moderate", "Sunil Jadhav", 4, vehicle2);
        serviceRecordRepo.save(record2);

        System.out.println("✅ Seeded: customer@demo.com, admin@demo.com (password: demo123)");
    }
}
