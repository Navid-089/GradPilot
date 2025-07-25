package com.gradpilot.service;

import com.gradpilot.dto.MentorRegisterRequest;
import com.gradpilot.dto.MentorRegisterResponse;
import com.gradpilot.dto.MentorLoginRequest;
import com.gradpilot.dto.MentorLoginResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MentorAuthServiceTest {

    @Autowired
    private MentorAuthService mentorAuthService;

    @Test
    void register_withValidRequest_returnsSuccess() {
        MentorRegisterRequest req = new MentorRegisterRequest();
        req.setName("Dr. Jane Smith");
        req.setEmail("mentor" + System.currentTimeMillis() + "@university.edu");
        req.setPassword("securepass123");
        req.setBio("Experienced mentor in Computer Science");
        req.setLinkedin("https://linkedin.com/in/drjanesmith");

        MentorRegisterResponse response = mentorAuthService.register(req);
        assertNotNull(response);
        assertEquals("Mentor registration successful", response.getMessage());
        assertNotNull(response.getToken());
        assertNotNull(response.getMentor());
        assertEquals("Dr. Jane Smith", response.getMentor().getName());
    }

    @Test
    void login_withValidCredentials_returnsSuccess() {
        // First register a mentor
        MentorRegisterRequest registerReq = new MentorRegisterRequest();
        String email = "mentorlogin" + System.currentTimeMillis() + "@university.edu";
        registerReq.setName("Dr. John Doe");
        registerReq.setEmail(email);
        registerReq.setPassword("securepass123");
        registerReq.setBio("Experienced mentor");

        mentorAuthService.register(registerReq);

        // Then try to login
        MentorLoginRequest loginReq = new MentorLoginRequest();
        loginReq.setEmail(email);
        loginReq.setPassword("securepass123");

        MentorLoginResponse response = mentorAuthService.login(loginReq);
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertNotNull(response.getMentor());
        assertEquals("Dr. John Doe", response.getMentor().getName());
        assertEquals(email, response.getMentor().getEmail());
        assertFalse(response.getMentor().getIsVerified()); // New mentors should not be verified
    }
}
