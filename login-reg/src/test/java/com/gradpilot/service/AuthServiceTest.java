package com.gradpilot.service;

import com.gradpilot.dto.RegisterRequest;
import com.gradpilot.dto.RegisterResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    void register_withValidRequest_returnsSuccess() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Test User");
        req.setEmail("testuser" + System.currentTimeMillis() + "@example.com");
        req.setPassword("testpass123");
        req.setGpa(new java.math.BigDecimal("3.5"));
        req.setDeadlineYear(2025);

        RegisterResponse response = authService.register(req);
        assertNotNull(response);
        assertEquals("Registration successful", response.getMessage());
    }
}