package com.gradpilot.recommendation.service;

import com.gradpilot.recommendation.dto.RecommendationDto;
import com.gradpilot.recommendation.model.*;
import com.gradpilot.recommendation.repository.ProfessorRepository;
import com.gradpilot.recommendation.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProfessorRepository professorRepository;

    @InjectMocks
    private RecommendationService recommendationService;

    private User user;
    private Professor professor1;
    private Professor professor2;
    private University university1;
    private University university2;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setEmail("test@example.com");
        UserTestHelper.setResearchInterests(user, List.of(new ResearchInterest("AI"), new ResearchInterest("ML")));
        UserTestHelper.setTargetCountries(user, List.of(new Country("USA")));
        UserTestHelper.setTargetMajors(user, List.of(new Major("Computer Science")));

        university1 = new University("Test University 1", "desc1", "test1@uni.com", 0, 50000.0, "USA", "address1", "http://test1.com");
        university2 = new University("Test University 2", "desc2", "test2@uni.com", 0, 45000.0, "Canada", "address2", "http://test2.com");

        professor1 = new Professor();
        ProfessorTestHelper.setName(professor1, "Dr. Smith");
        ProfessorTestHelper.setDepartment(professor1, "Computer Science");
        professor1.setUniversity(university1);
        professor1.setResearchInterests(List.of(new ResearchInterest("AI")));

        professor2 = new Professor();
        ProfessorTestHelper.setName(professor2, "Dr. Jones");
        ProfessorTestHelper.setDepartment(professor2, "Electrical Engineering");
        professor2.setUniversity(university2);
        professor2.setResearchInterests(List.of(new ResearchInterest("ML")));
    }

    @Test
    void getProfessorRecommendations() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(professorRepository.findByResearchInterestsIn(any())).thenReturn(List.of(professor1, professor2));

        List<RecommendationDto> recommendations = recommendationService.getProfessorRecommendations("test@example.com");

        assertNotNull(recommendations);
        assertEquals(2, recommendations.size());

        RecommendationDto rec1 = recommendations.get(0);
        assertEquals("Test University 1", rec1.getUniversity());
        assertEquals("Dr. Smith", rec1.getProfessor());
        assertEquals(60, rec1.getMatchScore()); // 30 for country + 30 for major

        RecommendationDto rec2 = recommendations.get(1);
        assertEquals("Test University 2", rec2.getUniversity());
        assertEquals("Dr. Jones", rec2.getProfessor());
        assertEquals(0, rec2.getMatchScore());
    }

    @Test
    void getProfessorRecommendations_NoMatchingProfessors() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(professorRepository.findByResearchInterestsIn(any())).thenReturn(Collections.emptyList());

        List<RecommendationDto> recommendations = recommendationService.getProfessorRecommendations("test@example.com");

        assertNotNull(recommendations);
        assertTrue(recommendations.isEmpty());
    }
}

class UserTestHelper {
    public static void setResearchInterests(User user, List<ResearchInterest> interests) {
        try {
            var field = user.getClass().getDeclaredField("researchInterests");
            field.setAccessible(true);
            field.set(user, interests);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static void setTargetCountries(User user, List<Country> countries) {
        try {
            var field = user.getClass().getDeclaredField("targetCountries");
            field.setAccessible(true);
            field.set(user, countries);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static void setTargetMajors(User user, List<Major> majors) {
        try {
            var field = user.getClass().getDeclaredField("targetMajors");
            field.setAccessible(true);
            field.set(user, majors);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

class ProfessorTestHelper {
    public static void setName(Professor professor, String name) {
        try {
            var field = professor.getClass().getDeclaredField("name");
            field.setAccessible(true);
            field.set(professor, name);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static void setDepartment(Professor professor, String department) {
        try {
            var field = professor.getClass().getDeclaredField("department");
            field.setAccessible(true);
            field.set(professor, department);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}