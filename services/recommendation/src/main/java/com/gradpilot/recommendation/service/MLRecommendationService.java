package com.gradpilot.recommendation.service;

import com.gradpilot.recommendation.dto.UniversityRecommendationDto;
import com.gradpilot.recommendation.model.University;
import com.gradpilot.recommendation.model.User;
import com.gradpilot.recommendation.repository.UniversityRepository;
import com.gradpilot.recommendation.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MLRecommendationService {
    
    private static final Logger logger = LoggerFactory.getLogger(MLRecommendationService.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UniversityRepository universityRepository;
    private final UserRepository userRepository;
    
    public MLRecommendationService(UniversityRepository universityRepository, UserRepository userRepository) {
        this.universityRepository = universityRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional(readOnly = true)
    public List<UniversityRecommendationDto> getUniversityRecommendations(Integer userId) {
        try {
            logger.info("Getting university recommendations for user ID: {}", userId);
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            List<University> universities = universityRepository.findAll();
            logger.info("Found {} universities in database", universities.size());
            
            if (universities.isEmpty()) {
                logger.warn("No universities found in database, returning empty list");
                return new ArrayList<>();
            }
            
            List<UniversityRecommendationDto> recommendations = new ArrayList<>();

            for (University university : universities) {
                // Calculate match score based on user preferences and university data
                double matchScore = calculateMatchScore(user, university);
                
                UniversityRecommendationDto dto = new UniversityRecommendationDto(
                    university.getId(),
                    university.getName(),
                    university.getDescription(),
                    university.getEmail(),
                    university.getRanking(),
                    university.getTuitionFees(),
                    university.getCountry(),
                    university.getAddress(),
                    university.getWebsiteUrl(),
                    matchScore
                );
                
                recommendations.add(dto);
            }

            // Sort by match score in descending order
            recommendations.sort((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()));
            
            logger.info("Generated {} recommendations", recommendations.size());
            return recommendations;
        } catch (Exception e) {
            logger.error("Error getting university recommendations: {}", e.getMessage(), e);
            throw new RuntimeException("Error getting university recommendations: " + e.getMessage());
        }
    }
    
    private double calculateMatchScore(User user, University university) {
        // Simple scoring algorithm - can be enhanced based on user preferences
        double score = 0.5; // Base score
        
        // Factor in ranking (lower ranking = higher score)
        if (university.getRanking() != null) {
            if (university.getRanking() <= 50) {
                score += 0.3;
            } else if (university.getRanking() <= 100) {
                score += 0.2;
            } else if (university.getRanking() <= 200) {
                score += 0.1;
            }
        }
        
        // Factor in tuition fees (lower fees = higher score)
        if (university.getTuitionFees() != null) {
            if (university.getTuitionFees() < 30000) {
                score += 0.2;
            } else if (university.getTuitionFees() < 50000) {
                score += 0.1;
            }
        }
        
        // Add some randomness to make it more interesting
        score += new Random().nextDouble() * 0.1;
        
        return Math.min(score, 1.0); // Cap at 1.0
    }
    
    public List<UniversityRecommendationDto> getRecommendationsByCategory(Integer userId, String category, int limit) {
        List<UniversityRecommendationDto> allRecommendations = getUniversityRecommendations(userId);
        
        // For now, return all recommendations since we don't have category in the new DTO
        // This can be enhanced later based on match score ranges
        return allRecommendations.stream()
            .limit(limit)
            .collect(Collectors.toList());
    }
} 