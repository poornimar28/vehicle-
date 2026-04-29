package com.AutoServix.Config;

import com.AutoServix.models.Customer;
import com.AutoServix.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Only seed if no users exist yet
        if (customerRepo.count() > 0) {
            System.out.println("Database already has data, skipping seed.");
            return;
        }

        String password = passwordEncoder.encode("demo123");

        Customer customer = new Customer("Customer Demo", "customer@demo.com", password);
        customer.setRole("CUSTOMER");
        customerRepo.save(customer);

        Customer admin = new Customer("Admin Demo", "admin@demo.com", password);
        admin.setRole("ADMIN");
        customerRepo.save(admin);

        Customer mechanic = new Customer("Mechanic Demo", "mechanic@demo.com", password);
        mechanic.setRole("MECHANIC");
        customerRepo.save(mechanic);

        System.out.println("Seeded 3 demo users: customer@demo.com, admin@demo.com, mechanic@demo.com (password: demo123)");
    }
}
