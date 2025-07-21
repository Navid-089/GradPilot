package com.gradpilot.recommendation.service;

import com.gradpilot.recommendation.dto.RecommendationDto;
import com.gradpilot.recommendation.dto.UniversityRecommendationDto;
import com.gradpilot.recommendation.model.*;
import com.gradpilot.recommendation.repository.*;

import jakarta.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;



@Service
public class RecommendationService {
    private final UserRepository userRepository;

    @Autowired
    private final ProfessorRepository professorRepository;

    @Autowired
    private EntityManager entityManager;

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
        // For now, just return the regular university recommendations
        return getUniversityRecommendations(email);
    }

    public List<Professor> getProfessorRecommendationsByInterests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        Integer userId = user.getUserId();

        // Get all professors
        List<Professor> allProfessors = professorRepository.findAll();

        // Get matching professors (those with same research interests as user)
        List<Professor> matching = professorRepository.findProfessorsMatchingUserInterests(userId);
        Set<Integer> matchedIds = matching.stream()
                .map(Professor::getId)
                .collect(Collectors.toSet());

        // Sort: professors with matching interests first, then others
        allProfessors.sort((p1, p2) -> {
            boolean p1Match = matchedIds.contains(p1.getId());
            boolean p2Match = matchedIds.contains(p2.getId());
            return Boolean.compare(!p1Match, !p2Match); // true comes after false, so matches first
        });

        return allProfessors;
    }

    public List<ResearchInterest> getUserResearchInterests(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return user.getResearchInterests();
    }
}