package com.AutoServix.controller;

import com.AutoServix.dto.AuthResponse;
import com.AutoServix.dto.LoginRequest;
import com.AutoServix.dto.RegisterRequest;
import com.AutoServix.models.Customer;
import com.AutoServix.repository.CustomerRepository;
import com.AutoServix.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequestMapping("/api/auth")
@RestController
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private CustomerRepository customerRepo;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        Optional<Customer> customer = customerRepo.findByEmail(email);
        if (customer.isPresent()) {
            Customer c = customer.get();
            return ResponseEntity.ok(new AuthResponse.UserInfo(c.getId(), c.getName(), c.getEmail(), c.getRole()));
        }
        return ResponseEntity.notFound().build();
    }
}