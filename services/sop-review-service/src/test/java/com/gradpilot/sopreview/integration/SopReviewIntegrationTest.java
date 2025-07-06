package com.gradpilot.sopreview.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gradpilot.sopreview.dto.ReviewRequest;
import com.gradpilot.sopreview.dto.ReviewResponse;
import com.gradpilot.sopreview.service.SopReviewService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(com.gradpilot.sopreview.controller.SopReviewController.class)
class SopReviewIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SopReviewService sopReviewService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void reviewSop_IntegrationTest_WithValidRequest() throws Exception {
        // Arrange
        String sopText = "I am applying for a master's degree in Computer Science.";
        String expectedFeedback = "Excellent! No grammar or spelling errors were found.";
        
        ReviewRequest request = new ReviewRequest(sopText);
        when(sopReviewService.getSopFeedback(sopText)).thenReturn(expectedFeedback);

        // Act & Assert
        mockMvc.perform(post("/api/v1/sop/review")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.feedback").value(expectedFeedback));
    }

    @Test
    void reviewSop_IntegrationTest_WithGrammarErrors() throws Exception {
        // Arrange
        String sopText = "I has experience in programming. I am apply for the program.";
        String expectedFeedback = "Here is the feedback on your SOP:\n\n" +
                "- **Issue:** Grammar error\n" +
                "  - **Suggestion:** have\n\n" +
                "- **Issue:** Spelling error\n" +
                "  - **Suggestion:** applying\n\n";
        
        ReviewRequest request = new ReviewRequest(sopText);
        when(sopReviewService.getSopFeedback(sopText)).thenReturn(expectedFeedback);

        // Act & Assert
        mockMvc.perform(post("/api/v1/sop/review")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.feedback").value(expectedFeedback));
    }

    @Test
    void reviewSop_IntegrationTest_WithServiceError() throws Exception {
        // Arrange
        String sopText = "Test SOP text";
        String errorMessage = "Sorry, there was an error processing your request. Please try again later.";
        
        ReviewRequest request = new ReviewRequest(sopText);
        when(sopReviewService.getSopFeedback(sopText)).thenReturn(errorMessage);

        // Act & Assert
        mockMvc.perform(post("/api/v1/sop/review")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.feedback").value(errorMessage));
    }

    @Test
    void reviewSop_IntegrationTest_WithEmptyRequest() throws Exception {
        // Arrange
        String sopText = "";
        String expectedFeedback = "Excellent! No grammar or spelling errors were found.";
        
        ReviewRequest request = new ReviewRequest(sopText);
        when(sopReviewService.getSopFeedback(sopText)).thenReturn(expectedFeedback);

        // Act & Assert
        mockMvc.perform(post("/api/v1/sop/review")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.feedback").value(expectedFeedback));
    }

    @Test
    void reviewSop_IntegrationTest_WithNullRequest() throws Exception {
        // Arrange
        String sopText = null;
        String expectedFeedback = "Excellent! No grammar or spelling errors were found.";
        
        ReviewRequest request = new ReviewRequest(sopText);
        when(sopReviewService.getSopFeedback(sopText)).thenReturn(expectedFeedback);

        // Act & Assert
        mockMvc.perform(post("/api/v1/sop/review")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.feedback").value(expectedFeedback));
    }

    @Test
    void reviewSop_IntegrationTest_WithLongSopText() throws Exception {
        // Arrange
        String sopText = "This is a very long statement of purpose that contains multiple sentences. " +
                "It describes my academic background, research interests, and career goals. " +
                "I have been passionate about computer science since my undergraduate studies. " +
                "I believe this program will help me achieve my goals and contribute to the field. " +
                "My research experience includes working on machine learning algorithms and " +
                "developing software applications. I have published papers in top conferences " +
                "and have received several awards for my academic achievements.";
        String expectedFeedback = "Excellent! No grammar or spelling errors were found.";
        
        ReviewRequest request = new ReviewRequest(sopText);
        when(sopReviewService.getSopFeedback(sopText)).thenReturn(expectedFeedback);

        // Act & Assert
        mockMvc.perform(post("/api/v1/sop/review")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.feedback").value(expectedFeedback));
    }
} 