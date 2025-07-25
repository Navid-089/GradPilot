package com.gradpilot.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gradpilot.dto.MentorRegisterRequest;
import com.gradpilot.dto.MentorLoginRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;

@SpringBootTest
@AutoConfigureMockMvc
class MentorAuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void register_withValidRequest_returnsCreated() throws Exception {
        MentorRegisterRequest req = new MentorRegisterRequest();
        req.setName("Dr. Test Mentor");
        req.setEmail("testmentor" + System.currentTimeMillis() + "@university.edu");
        req.setPassword("securepass123");
        req.setBio("Test mentor biography");
        req.setLinkedin("https://linkedin.com/in/testmentor");
        req.setExpertiseAreaIds(new ArrayList<>());

        mockMvc.perform(post("/api/v1/mentor/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
    }

    @Test
    void login_withValidCredentials_returnsOk() throws Exception {
        // First register a mentor
        MentorRegisterRequest registerReq = new MentorRegisterRequest();
        String email = "logintest" + System.currentTimeMillis() + "@university.edu";
        registerReq.setName("Dr. Login Test");
        registerReq.setEmail(email);
        registerReq.setPassword("securepass123");
        registerReq.setBio("Test mentor");
        registerReq.setExpertiseAreaIds(new ArrayList<>());

        mockMvc.perform(post("/api/v1/mentor/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated());

        // Then try to login
        MentorLoginRequest loginReq = new MentorLoginRequest();
        loginReq.setEmail(email);
        loginReq.setPassword("securepass123");

        mockMvc.perform(post("/api/v1/mentor/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk());
    }
}
