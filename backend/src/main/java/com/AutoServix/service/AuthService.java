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

    public AuthResponse register (RegisterRequest request) {

        String encodedpassword = passwordEncoder.encode(request.getPassword());

        Customer customer = new Customer(
                request.getName(),
                request.getEmail(),
                encodedpassword,
                request.getModelNo(),
                request.getBrand(),
                request.getChassisNo()
        );
        customerRepo.save(customer);

        String token = jwtservice.generateToken(request.getEmail());
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        Customer customer = customerRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtservice.generateToken(customer.getEmail());
        return new AuthResponse(token);
    }

}