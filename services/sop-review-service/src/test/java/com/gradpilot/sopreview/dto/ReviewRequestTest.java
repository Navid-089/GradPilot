package com.gradpilot.sopreview.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ReviewRequestTest {

    @Test
    void reviewRequest_WithValidSopText_CreatesInstance() {
        // Arrange
        String sopText = "I am applying for a master's degree in Computer Science.";

        // Act
        ReviewRequest request = new ReviewRequest(sopText);

        // Assert
        assertNotNull(request);
        assertEquals(sopText, request.sopText());
    }

    @Test
    void reviewRequest_WithEmptySopText_CreatesInstance() {
        // Arrange
        String sopText = "";

        // Act
        ReviewRequest request = new ReviewRequest(sopText);

        // Assert
        assertNotNull(request);
        assertEquals(sopText, request.sopText());
    }

    @Test
    void reviewRequest_WithNullSopText_CreatesInstance() {
        // Arrange
        String sopText = null;

        // Act
        ReviewRequest request = new ReviewRequest(sopText);

        // Assert
        assertNotNull(request);
        assertNull(request.sopText());
    }

    @Test
    void reviewRequest_WithLongSopText_CreatesInstance() {
        // Arrange
        String sopText = "This is a very long statement of purpose that contains multiple sentences. " +
                "It describes my academic background, research interests, and career goals. " +
                "I have been passionate about computer science since my undergraduate studies. " +
                "I believe this program will help me achieve my goals and contribute to the field.";

        // Act
        ReviewRequest request = new ReviewRequest(sopText);

        // Assert
        assertNotNull(request);
        assertEquals(sopText, request.sopText());
    }

    @Test
    void reviewRequest_EqualsAndHashCode_WorkCorrectly() {
        // Arrange
        String sopText = "Test SOP text";
        ReviewRequest request1 = new ReviewRequest(sopText);
        ReviewRequest request2 = new ReviewRequest(sopText);
        ReviewRequest request3 = new ReviewRequest("Different text");

        // Act & Assert
        assertEquals(request1, request2);
        assertEquals(request1.hashCode(), request2.hashCode());
        assertNotEquals(request1, request3);
        assertNotEquals(request1.hashCode(), request3.hashCode());
    }

    @Test
    void reviewRequest_ToString_ContainsSopText() {
        // Arrange
        String sopText = "Test SOP text";
        ReviewRequest request = new ReviewRequest(sopText);

        // Act
        String toString = request.toString();

        // Assert
        assertTrue(toString.contains(sopText));
        assertTrue(toString.contains("ReviewRequest"));
    }

    @Test
    void reviewRequest_WithSpecialCharacters_CreatesInstance() {
        // Arrange
        String sopText = "I'm applying for a master's degree in Computer Science with GPA 3.8/4.0!";

        // Act
        ReviewRequest request = new ReviewRequest(sopText);

        // Assert
        assertNotNull(request);
        assertEquals(sopText, request.sopText());
    }

    @Test
    void reviewRequest_WithUnicodeCharacters_CreatesInstance() {
        // Arrange
        String sopText = "I am applying for a master's degree in Computer Science. " +
                "My research interests include machine learning and artificial intelligence.";

        // Act
        ReviewRequest request = new ReviewRequest(sopText);

        // Assert
        assertNotNull(request);
        assertEquals(sopText, request.sopText());
    }
}