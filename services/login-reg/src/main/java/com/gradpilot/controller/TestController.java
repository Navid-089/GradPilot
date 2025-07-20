package com.gradpilot.controller;

import com.gradpilot.model.User;
import com.gradpilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Application is running");
        return response;
    }

    @GetMapping("/db")
    public Map<String, Object> testDb() {
        Map<String, Object> response = new HashMap<>();
        try (Connection connection = dataSource.getConnection()) {
            response.put("status", "SUCCESS");
            response.put("database", "Connected to PostgreSQL");
            response.put("url", connection.getMetaData().getURL());
        } catch (Exception e) {
            response.put("status", "FAILED");
            response.put("error", e.getMessage());
        }
        return response;
    }

    @GetMapping("/count")
    public Map<String, Object> userCount() {
        Map<String, Object> response = new HashMap<>();
        try {
            Long count = userRepository.countAllUsers();
            response.put("status", "SUCCESS");
            response.put("userCount", count);
        } catch (Exception e) {
            response.put("status", "FAILED");
            response.put("error", e.getMessage());
        }
        return response;
    }

    @PostMapping("/create-test-user")
    public Map<String, Object> createTestUser() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Check if test user already exists
            if (userRepository.existsByEmail("student@example.com")) {
                response.put("status", "EXISTS");
                response.put("message", "Test user already exists");
                return response;
            }

            User testUser = new User();
            testUser.setName("John Doe");
            testUser.setEmail("student@example.com");
            testUser.setPassword(passwordEncoder.encode("securepass123")); // Encoded password
            testUser.setCreatedAt(LocalDateTime.now());

            User savedUser = userRepository.save(testUser);

            response.put("status", "SUCCESS");
            response.put("message", "Test user created successfully");
            response.put("email", "student@example.com");
            response.put("password", "securepass123");
            response.put("userId", savedUser.getUserId());

        } catch (Exception e) {
            response.put("status", "FAILED");
            response.put("error", e.getMessage());
        }
        return response;
    }
}