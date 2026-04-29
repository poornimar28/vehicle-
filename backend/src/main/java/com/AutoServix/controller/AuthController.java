package com.AutoServix.controller;

import com.AutoServix.dto.AuthResponse;
import com.AutoServix.dto.LoginRequest;
import com.AutoServix.dto.RegisterRequest;
import com.AutoServix.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/auth")
@RestController
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest registerRequest){
        return authService.register(registerRequest);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest){
        return authService.login(loginRequest);
    }

}