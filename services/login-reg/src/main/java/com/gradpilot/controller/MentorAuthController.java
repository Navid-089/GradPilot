package com.gradpilot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import com.gradpilot.dto.MentorLoginRequest;
import com.gradpilot.dto.MentorLoginResponse;
import com.gradpilot.dto.MentorRegisterRequest;
import com.gradpilot.dto.MentorRegisterResponse;

import com.gradpilot.dto.MentorProfileUpdateRequest;
import com.gradpilot.dto.MentorDto;
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

    // GET /api/v1/mentor/profile?email=...
    @GetMapping("/profile")
    public ResponseEntity<MentorDto> getMentorProfile(@RequestParam String email) {
        MentorDto mentorDto = mentorAuthService.getMentorProfileByEmail(email);
        if (mentorDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mentorDto);
    }

    // PUT /api/v1/mentor/profile
    @PutMapping("/profile")
    public ResponseEntity<MentorDto> updateMentorProfile(@Valid @RequestBody MentorProfileUpdateRequest updateRequest) {
        MentorDto updated = mentorAuthService.updateMentorProfile(updateRequest);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}
