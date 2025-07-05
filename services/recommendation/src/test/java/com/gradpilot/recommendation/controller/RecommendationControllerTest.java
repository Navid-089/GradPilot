package com.gradpilot.recommendation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gradpilot.recommendation.config.CustomUserDetailsService;
import com.gradpilot.recommendation.config.JwtTokenProvider;
import com.gradpilot.recommendation.dto.RecommendationDto;
import com.gradpilot.recommendation.service.RecommendationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RecommendationController.class)
class RecommendationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RecommendationService recommendationService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "test@example.com")
    void getProfessorRecommendations() throws Exception {
        RecommendationDto rec1 = new RecommendationDto("Test University 1", "Dr. Smith", 60, "http://test1.com");
        RecommendationDto rec2 = new RecommendationDto("Test University 2", "Dr. Jones", 0, "http://test2.com");
        List<RecommendationDto> recommendations = List.of(rec1, rec2);

        when(recommendationService.getProfessorRecommendations("test@example.com")).thenReturn(recommendations);

        mockMvc.perform(get("/api/recommendations/professors"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(recommendations)));
    }
}