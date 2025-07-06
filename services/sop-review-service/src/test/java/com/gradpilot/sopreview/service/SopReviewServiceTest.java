package com.gradpilot.sopreview.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SopReviewServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private SopReviewService sopReviewService;

    @BeforeEach
    void setUp() {
        // Inject the mocked RestTemplate into the service
        ReflectionTestUtils.setField(sopReviewService, "restTemplate", restTemplate);
    }

    @Test
    void getSopFeedback_WithNoErrors_ReturnsSuccessMessage() {
        // Arrange
        String sopText = "I am applying for a master's degree in Computer Science.";
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("matches", new ArrayList<>());

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = sopReviewService.getSopFeedback(sopText);

        // Assert
        assertEquals("Excellent! No grammar or spelling errors were found.", result);
        verify(restTemplate).postForEntity(anyString(), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    void getSopFeedback_WithGrammarErrors_ReturnsFormattedFeedback() {
        // Arrange
        String sopText = "I has experience in programming.";

        Map<String, Object> replacement = new HashMap<>();
        replacement.put("value", "have");

        Map<String, Object> match = new HashMap<>();
        match.put("message", "Grammar error");
        match.put("replacements", Arrays.asList(replacement));

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("matches", Arrays.asList(match));

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = sopReviewService.getSopFeedback(sopText);

        // Assert
        assertTrue(result.contains("Here is the feedback on your SOP:"));
        assertTrue(result.contains("**Issue:** Grammar error"));
        assertTrue(result.contains("**Suggestion:** have"));
        verify(restTemplate).postForEntity(anyString(), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    void getSopFeedback_WithMultipleErrors_ReturnsAllFeedback() {
        // Arrange
        String sopText = "I has experience in programming. I am apply for the program.";

        Map<String, Object> replacement1 = new HashMap<>();
        replacement1.put("value", "have");

        Map<String, Object> replacement2 = new HashMap<>();
        replacement2.put("value", "applying");

        Map<String, Object> match1 = new HashMap<>();
        match1.put("message", "Grammar error");
        match1.put("replacements", Arrays.asList(replacement1));

        Map<String, Object> match2 = new HashMap<>();
        match2.put("message", "Spelling error");
        match2.put("replacements", Arrays.asList(replacement2));

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("matches", Arrays.asList(match1, match2));

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = sopReviewService.getSopFeedback(sopText);

        // Assert
        assertTrue(result.contains("**Issue:** Grammar error"));
        assertTrue(result.contains("**Suggestion:** have"));
        assertTrue(result.contains("**Issue:** Spelling error"));
        assertTrue(result.contains("**Suggestion:** applying"));
        verify(restTemplate).postForEntity(anyString(), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    void getSopFeedback_WithEmptyReplacements_ReturnsFeedbackWithoutSuggestions() {
        // Arrange
        String sopText = "Test text with error.";

        Map<String, Object> match = new HashMap<>();
        match.put("message", "Some error");
        match.put("replacements", new ArrayList<>());

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("matches", Arrays.asList(match));

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = sopReviewService.getSopFeedback(sopText);

        // Assert
        assertTrue(result.contains("**Issue:** Some error"));
        assertFalse(result.contains("**Suggestion:**"));
        verify(restTemplate).postForEntity(anyString(), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    void getSopFeedback_WithRestTemplateException_ReturnsErrorMessage() {
        // Arrange
        String sopText = "Test text";
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenThrow(new RuntimeException("API Error"));

        // Act
        String result = sopReviewService.getSopFeedback(sopText);

        // Assert
        assertEquals("Sorry, there was an error processing your request. Please try again later.", result);
        verify(restTemplate).postForEntity(anyString(), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    void getSopFeedback_WithNullResponseBody_ReturnsErrorMessage() {
        // Arrange
        String sopText = "Test text";
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(null, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = sopReviewService.getSopFeedback(sopText);

        // Assert
        assertEquals("Sorry, there was an error processing your request. Please try again later.", result);
        verify(restTemplate).postForEntity(anyString(), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    void getSopFeedback_WithNullMatches_ReturnsErrorMessage() {
        // Arrange
        String sopText = "Test text";
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("matches", null);

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = sopReviewService.getSopFeedback(sopText);

        // Assert
        assertEquals("Sorry, there was an error processing your request. Please try again later.", result);
        verify(restTemplate).postForEntity(anyString(), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    void getSopFeedback_WithEmptyText_ReturnsSuccessMessage() {
        // Arrange
        String sopText = "";
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("matches", new ArrayList<>());

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = sopReviewService.getSopFeedback(sopText);

        // Assert
        assertEquals("Excellent! No grammar or spelling errors were found.", result);
        verify(restTemplate).postForEntity(anyString(), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    void getSopFeedback_WithNullText_ReturnsSuccessMessage() {
        // Arrange
        String sopText = null;
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("matches", new ArrayList<>());

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = sopReviewService.getSopFeedback(sopText);

        // Assert
        assertEquals("Excellent! No grammar or spelling errors were found.", result);
        verify(restTemplate).postForEntity(anyString(), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    void getSopFeedback_WithLongText_ReturnsSuccessMessage() {
        // Arrange
        String sopText = "This is a very long statement of purpose that contains multiple sentences. " +
                "It describes my academic background, research interests, and career goals. " +
                "I have been passionate about computer science since my undergraduate studies. " +
                "I believe this program will help me achieve my goals and contribute to the field.";

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("matches", new ArrayList<>());

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = sopReviewService.getSopFeedback(sopText);

        // Assert
        assertEquals("Excellent! No grammar or spelling errors were found.", result);
        verify(restTemplate).postForEntity(anyString(), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    void getSopFeedback_VerifiesCorrectApiUrl() {
        // Arrange
        String sopText = "Test text";
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("matches", new ArrayList<>());

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        sopReviewService.getSopFeedback(sopText);

        // Assert
        verify(restTemplate).postForEntity(
                eq("https://api.languagetool.org/v2/check"),
                any(HttpEntity.class),
                eq(Map.class));
    }

    @Test
    void getSopFeedback_VerifiesCorrectRequestParameters() {
        // Arrange
        String sopText = "Test text";
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("matches", new ArrayList<>());

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        sopReviewService.getSopFeedback(sopText);

        // Assert
        verify(restTemplate).postForEntity(
                anyString(),
                argThat(entity -> {
                    HttpEntity<?> httpEntity = (HttpEntity<?>) entity;
                    HttpHeaders headers = httpEntity.getHeaders();

                    // Check content type
                    return headers.getContentType().toString().contains("application/x-www-form-urlencoded");
                }),
                eq(Map.class));
    }
}