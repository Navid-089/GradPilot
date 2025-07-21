package com.gradpilot.sopreview.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ReviewResponseTest {

    @Test
    void reviewResponse_WithValidFeedback_CreatesInstance() {
        // Arrange
        String feedback = "Excellent! No grammar or spelling errors were found.";

        // Act
        ReviewResponse response = new ReviewResponse(feedback);

        // Assert
        assertNotNull(response);
        assertEquals(feedback, response.feedback());
    }

    @Test
    void reviewResponse_WithEmptyFeedback_CreatesInstance() {
        // Arrange
        String feedback = "";

        // Act
        ReviewResponse response = new ReviewResponse(feedback);

        // Assert
        assertNotNull(response);
        assertEquals(feedback, response.feedback());
    }

    @Test
    void reviewResponse_WithNullFeedback_CreatesInstance() {
        // Arrange
        String feedback = null;

        // Act
        ReviewResponse response = new ReviewResponse(feedback);

        // Assert
        assertNotNull(response);
        assertNull(response.feedback());
    }

    @Test
    void reviewResponse_WithLongFeedback_CreatesInstance() {
        // Arrange
        String feedback = "Here is the feedback on your SOP:\n\n" +
                "- **Issue:** Grammar error\n" +
                "  - **Suggestion:** have\n\n" +
                "- **Issue:** Spelling error\n" +
                "  - **Suggestion:** applying\n\n" +
                "- **Issue:** Punctuation error\n" +
                "  - **Suggestion:** Add comma\n\n";

        // Act
        ReviewResponse response = new ReviewResponse(feedback);

        // Assert
        assertNotNull(response);
        assertEquals(feedback, response.feedback());
    }

    @Test
    void reviewResponse_EqualsAndHashCode_WorkCorrectly() {
        // Arrange
        String feedback = "Test feedback";
        ReviewResponse response1 = new ReviewResponse(feedback);
        ReviewResponse response2 = new ReviewResponse(feedback);
        ReviewResponse response3 = new ReviewResponse("Different feedback");

        // Act & Assert
        assertEquals(response1, response2);
        assertEquals(response1.hashCode(), response2.hashCode());
        assertNotEquals(response1, response3);
        assertNotEquals(response1.hashCode(), response3.hashCode());
    }

    @Test
    void reviewResponse_ToString_ContainsFeedback() {
        // Arrange
        String feedback = "Test feedback";
        ReviewResponse response = new ReviewResponse(feedback);

        // Act
        String toString = response.toString();

        // Assert
        assertTrue(toString.contains(feedback));
        assertTrue(toString.contains("ReviewResponse"));
    }

    @Test
    void reviewResponse_WithSpecialCharacters_CreatesInstance() {
        // Arrange
        String feedback = "Here is the feedback on your SOP:\n\n" +
                "- **Issue:** Grammar error (subject-verb agreement)\n" +
                "  - **Suggestion:** have\n\n" +
                "- **Issue:** Punctuation error\n" +
                "  - **Suggestion:** Add comma after 'However'\n\n";

        // Act
        ReviewResponse response = new ReviewResponse(feedback);

        // Assert
        assertNotNull(response);
        assertEquals(feedback, response.feedback());
    }

    @Test
    void reviewResponse_WithMarkdownFormatting_CreatesInstance() {
        // Arrange
        String feedback = "**Excellent work!** Your SOP is well-written with only minor issues:\n\n" +
                "1. **Grammar:** Consider using 'have' instead of 'has'\n" +
                "2. **Style:** The sentence could be more concise\n" +
                "3. **Content:** Great job explaining your motivation";

        // Act
        ReviewResponse response = new ReviewResponse(feedback);

        // Assert
        assertNotNull(response);
        assertEquals(feedback, response.feedback());
    }

    @Test
    void reviewResponse_WithErrorFeedback_CreatesInstance() {
        // Arrange
        String feedback = "Sorry, there was an error processing your request. Please try again later.";

        // Act
        ReviewResponse response = new ReviewResponse(feedback);

        // Assert
        assertNotNull(response);
        assertEquals(feedback, response.feedback());
    }

    @Test
    void reviewResponse_WithMultipleLines_CreatesInstance() {
        // Arrange
        String feedback = "Line 1: Grammar error\n" +
                "Line 2: Spelling error\n" +
                "Line 3: Punctuation error\n" +
                "Line 4: Style suggestion";

        // Act
        ReviewResponse response = new ReviewResponse(feedback);

        // Assert
        assertNotNull(response);
        assertEquals(feedback, response.feedback());
    }
}