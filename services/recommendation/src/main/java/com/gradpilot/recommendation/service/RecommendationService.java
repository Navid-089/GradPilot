package com.gradpilot.recommendation.service;

import com.gradpilot.recommendation.dto.RecommendationDto;
import com.gradpilot.recommendation.dto.UniversityRecommendationDto;
import com.gradpilot.recommendation.model.*;
import com.gradpilot.recommendation.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    private final UserRepository userRepository;
    private final ProfessorRepository professorRepository;
    private final MLRecommendationService mlRecommendationService;

    public RecommendationService(UserRepository userRepository, ProfessorRepository professorRepository, 
                               MLRecommendationService mlRecommendationService) {
        this.userRepository = userRepository;
        this.professorRepository = professorRepository;
        this.mlRecommendationService = mlRecommendationService;
    }

    public List<RecommendationDto> getProfessorRecommendations(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        List<ResearchInterest> interests = user.getResearchInterests();
        List<String> countries = user.getTargetCountries().stream().map(Country::getName).toList();
        List<String> majors = user.getTargetMajors().stream().map(Major::getName).toList();

        List<RecommendationDto> recommendations = new ArrayList<>();

        // Fetch professors matching interests
        List<Professor> matchedProfessors = professorRepository.findByResearchInterestsIn(interests);

        for (Professor prof : matchedProfessors) {
            University uni = prof.getUniversity();
            int score = 0;
            if (countries.contains(uni.getAddress()))
                score += 30;
            if (majors.contains(prof.getDepartment()))
                score += 30;
            // Example: add more scoring logic here
            recommendations.add(new RecommendationDto(
                    uni.getName(), prof.getName(), score, uni.getWebsiteUrl()));
        }

        return recommendations.stream()
                .sorted(Comparator.comparingInt(RecommendationDto::getMatchScore).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<UniversityRecommendationDto> getUniversityRecommendations(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return mlRecommendationService.getUniversityRecommendations(user.getUserId());
    }

    public List<UniversityRecommendationDto> getUniversityRecommendationsByCategory(String email, String category, int limit) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return mlRecommendationService.getRecommendationsByCategory(user.getUserId(), category, limit);
    }

    public Map<String, Object> getAllRecommendations(String email) {
        Map<String, Object> allRecommendations = new HashMap<>();
        
        allRecommendations.put("professors", getProfessorRecommendations(email));
        allRecommendations.put("universities", getUniversityRecommendations(email));
        
        return allRecommendations;
    }
}