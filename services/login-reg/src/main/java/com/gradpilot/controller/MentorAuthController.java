package com.gradpilot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gradpilot.dto.MentorLoginRequest;
import com.gradpilot.dto.MentorLoginResponse;
import com.gradpilot.dto.MentorRegisterRequest;
import com.gradpilot.dto.MentorRegisterResponse;
import com.gradpilot.service.MentorAuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/mentor/auth")
@CrossOrigin(origins = "*") // For testing purposes
public class MentorAuthController {

    @Autowired
    private MentorAuthService mentorAuthService;

    @PostMapping("/register")
    public ResponseEntity<MentorRegisterResponse> register(@Valid @RequestBody MentorRegisterRequest registerRequest) {
        MentorRegisterResponse response = mentorAuthService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<MentorLoginResponse> login(@Valid @RequestBody MentorLoginRequest loginRequest) {
        MentorLoginResponse response = mentorAuthService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}
