package com.gradpilot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gradpilot.dto.ForgotPasswordRequest;
import com.gradpilot.dto.MentorLoginRequest;
import com.gradpilot.dto.MentorLoginResponse;
import com.gradpilot.dto.MentorRegisterRequest;
import com.gradpilot.dto.MentorRegisterResponse;
import com.gradpilot.dto.ResetPasswordRequest;
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

    @PostMapping("/mentor-forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            mentorAuthService.sendPasswordResetEmail(request.getEmail());
            return ResponseEntity.ok("If the email exists in our system, a password reset link has been sent.");
        } catch (Exception e) {
            // Log error but return generic message for security
            System.err.println("Error in forgot password: " + e.getMessage());
            return ResponseEntity.ok("If the email exists in our system, a password reset link has been sent.");
        }
    }

    @PostMapping("/mentor-reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            mentorAuthService.resetPassword(request);
            return ResponseEntity.ok("Password has been reset successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/mentor-validate-reset-token")
    public ResponseEntity<Boolean> validateResetToken(@RequestParam String token) {
        try {
            boolean isValid = mentorAuthService.validateResetToken(token);
            return ResponseEntity.ok(isValid);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }
}
