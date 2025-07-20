package com.gradpilot.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gradpilot.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.HashMap;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void register_withValidRequest_returnsOk() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setName("Test User");
        req.setEmail("testuser" + System.currentTimeMillis() + "@example.com");
        req.setPassword("testpass123");
        req.setGpa(new java.math.BigDecimal("3.5"));
        req.setDeadlineYear(2025);
        req.setTestScores(new HashMap<>());
        req.setTargetCountries(new ArrayList<>());
        req.setTargetMajors(new ArrayList<>());
        req.setResearchInterests(new ArrayList<>());
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
    }

    @Test
    void register_withInvalidRequest_returnsBadRequest() throws Exception {
        // TODO: Add negative test case
    }
}