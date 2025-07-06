package com.gradpilot.controller;

import com.gradpilot.dto.LoginRequest;
import com.gradpilot.dto.LoginResponse;
import com.gradpilot.dto.RegisterRequest;
import com.gradpilot.dto.RegisterResponse;
import com.gradpilot.dto.UpdateProfileResponse;
import com.gradpilot.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.gradpilot.dto.UserProfileUpdate;
import com.gradpilot.model.User;
import org.springframework.security.core.Authentication;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*") // For testing purposes
public class AuthController {

    @Autowired
    private AuthService authService;

    // @Autowired
    // private JwtTokenProvider jwtTokenProvider;

    // @Autowired
    // private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        RegisterResponse response = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<UpdateProfileResponse> updateProfile(@Valid @RequestBody UserProfileUpdate dto) {
        UpdateProfileResponse response = authService.updateProfile(dto);
        return ResponseEntity.ok(response);
        // try {
        //     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //     if (authentication == null || !authentication.isAuthenticated()) {
        //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        //     }

        //     @SuppressWarnings("unchecked")
        //     Map<String, Object> principal = (Map<String, Object>) authentication.getPrincipal();
        //     Integer userId = (Integer) principal.get("userId");

        //     if (userId == null) {
        //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        //     }

        //     UpdateProfileResponse response = authService.updateProfile(dto);
        //     return ResponseEntity.ok(response);

        // } catch (Exception e) {
        //     e.printStackTrace();
        //     return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        // }
    }

}
