package com.AutoServix.service;

import com.AutoServix.dto.AuthResponse;
import com.AutoServix.dto.LoginRequest;
import com.AutoServix.dto.RegisterRequest;
import com.AutoServix.models.Customer;
import com.AutoServix.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private Jwtservice jwtservice;

    public AuthResponse register(RegisterRequest request) {

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        Customer customer = new Customer(
                request.getName(),
                request.getEmail(),
                encodedPassword,
                request.getModelNo(),
                request.getBrand(),
                request.getChassisNo()
        );

        // Set role from request, default to CUSTOMER
        String role = (request.getRole() != null && !request.getRole().isEmpty())
                ? request.getRole() : "CUSTOMER";
        customer.setRole(role);

        customerRepo.save(customer);

        String token = jwtservice.generateToken(customer.getEmail());
        return new AuthResponse(token, customer.getId(), customer.getName(), customer.getEmail(), customer.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        Customer customer = customerRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtservice.generateToken(customer.getEmail());
        return new AuthResponse(token, customer.getId(), customer.getName(), customer.getEmail(), customer.getRole());
    }
}