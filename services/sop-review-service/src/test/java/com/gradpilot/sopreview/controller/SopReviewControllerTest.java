package com.gradpilot.sopreview.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gradpilot.sopreview.dto.ReviewRequest;
import com.gradpilot.sopreview.dto.ReviewResponse;
import com.gradpilot.sopreview.service.SopReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class SopReviewControllerTest {

    @Mock
    private SopReviewService sopReviewService;

    @InjectMocks
    private SopReviewController sopReviewController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(sopReviewController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void reviewSop_WithValidRequest_ReturnsSuccessResponse() throws Exception {
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
    void reviewSop_WithGrammarErrors_ReturnsFeedbackWithSuggestions() throws Exception {
        // Arrange
        String sopText = "I am applying for a master's degree in Computer Science. I has experience in programming.";
        String expectedFeedback = "Here is the feedback on your SOP:\n\n- **Issue:** Grammar error\n  - **Suggestion:** have\n\n";

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
    void reviewSop_WithEmptySopText_ReturnsSuccessResponse() throws Exception {
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
    void reviewSop_WithServiceException_ReturnsErrorResponse() throws Exception {
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
    void reviewSop_WithNullSopText_ReturnsSuccessResponse() throws Exception {
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
    void reviewSop_WithLongSopText_ReturnsSuccessResponse() throws Exception {
        // Arrange
        String sopText = "This is a very long statement of purpose that contains multiple sentences. " +
                "It describes my academic background, research interests, and career goals. " +
                "I have been passionate about computer science since my undergraduate studies. " +
                "I believe this program will help me achieve my goals and contribute to the field.";
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