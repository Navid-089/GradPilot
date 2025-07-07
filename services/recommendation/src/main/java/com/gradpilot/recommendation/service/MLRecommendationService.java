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

            // Log user preferences for debugging
            logger.info("User preferences - Email: {}, CGPA: {}, Apply Year: {}", 
                user.getEmail(), user.getCgpa(), user.getApplyYear());
            logger.info("Target Countries: {}", 
                user.getTargetCountries() != null ? 
                    user.getTargetCountries().stream().map(c -> c.getName()).toList() : "None");
            logger.info("Target Majors: {}", 
                user.getTargetMajors() != null ? 
                    user.getTargetMajors().stream().map(m -> m.getName()).toList() : "None");
            logger.info("Research Interests: {}", 
                user.getResearchInterests() != null ? 
                    user.getResearchInterests().stream().map(r -> r.getName()).toList() : "None");

            List<University> universities = universityRepository.findAll();
            logger.info("Found {} universities in database", universities.size());
            
            if (universities.isEmpty()) {
                logger.warn("No universities found in database, returning empty list");
                return new ArrayList<>();
            }
            
            // Try to get ML predictions first
            List<UniversityRecommendationDto> recommendations = getMLPredictions(user, universities);
            
            // If ML fails, fallback to rule-based scoring
            if (recommendations.isEmpty()) {
                logger.warn("ML predictions failed, falling back to rule-based scoring");
                recommendations = getRuleBasedRecommendations(user, universities);
            }
            
            logger.info("Generated {} recommendations", recommendations.size());
            return recommendations;
        } catch (Exception e) {
            logger.error("Error getting university recommendations: {}", e.getMessage(), e);
            throw new RuntimeException("Error getting university recommendations: " + e.getMessage());
        }
    }
    
    private double calculateMatchScore(User user, University university) {
        double score = 0.0;
        
        // 1. Country preference match (30% weight)
        if (user.getTargetCountries() != null && !user.getTargetCountries().isEmpty()) {
            boolean countryMatch = user.getTargetCountries().stream()
                .anyMatch(country -> country.getName().equalsIgnoreCase(university.getCountry()));
            if (countryMatch) {
                score += 0.3;
            }
        }
        
        // 2. Ranking score (25% weight) - lower ranking is better
        if (university.getRanking() != null) {
            if (university.getRanking() <= 10) {
                score += 0.25;
            } else if (university.getRanking() <= 50) {
                score += 0.20;
            } else if (university.getRanking() <= 100) {
                score += 0.15;
            } else if (university.getRanking() <= 200) {
                score += 0.10;
            } else {
                score += 0.05;
            }
        }
        
        // 3. Tuition affordability (20% weight)
        if (university.getTuitionFees() != null) {
            if (university.getTuitionFees() < 10000) {
                score += 0.20; // Very affordable
            } else if (university.getTuitionFees() < 30000) {
                score += 0.15; // Affordable
            } else if (university.getTuitionFees() < 50000) {
                score += 0.10; // Moderate
            } else {
                score += 0.05; // Expensive
            }
        }
        
        // 4. GPA-based university tier matching (15% weight)
        if (user.getCgpa() != null) {
            double gpa = user.getCgpa().doubleValue();
            if (gpa >= 3.7 && university.getRanking() != null && university.getRanking() <= 50) {
                score += 0.15; // High GPA matches top universities
            } else if (gpa >= 3.3 && university.getRanking() != null && university.getRanking() <= 100) {
                score += 0.12; // Good GPA matches good universities
            } else if (gpa >= 3.0) {
                score += 0.08; // Decent GPA matches decent universities
            }
        }
        
        // 5. Research interest match (10% weight)
        // This is simplified - in a real system, you'd have university research areas
        if (user.getResearchInterests() != null && !user.getResearchInterests().isEmpty()) {
            // For now, give bonus to top-tier universities for research
            if (university.getRanking() != null && university.getRanking() <= 20) {
                score += 0.10; // Top universities likely have good research
            } else if (university.getRanking() != null && university.getRanking() <= 50) {
                score += 0.05;
            }
        }
        
        // Add small random factor to break ties and create some variety
        score += new Random(user.getUserId()).nextDouble() * 0.05; // Seeded by user ID for consistency
        
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
    
    private List<UniversityRecommendationDto> getMLPredictions(User user, List<University> universities) {
        try {
            logger.info("Attempting to get ML predictions for user {}", user.getEmail());
            
            // Create user profile JSON for ML model
            Map<String, Object> userProfile = createUserProfileForML(user);
            
            // Write user profile to temporary file
            File tempFile = File.createTempFile("user_profile_", ".json");
            objectMapper.writeValue(tempFile, userProfile);
            
            // Execute Python ML script
            ProcessBuilder processBuilder = new ProcessBuilder(
                "python3", "ml/ml_predict.py", 
                "--profile", tempFile.getAbsolutePath(),
                "--model", "ml/models/improved_university_recommender.pkl"
            );
            processBuilder.directory(new File("."));
            
            Process process = processBuilder.start();
            
            // Read the output
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            
            // Wait for process to complete
            int exitCode = process.waitFor();
            
            // Clean up temp file
            tempFile.delete();
            
            if (exitCode == 0) {
                // Parse ML results
                String jsonOutput = output.toString().trim();
                if (!jsonOutput.isEmpty()) {
                    List<Map<String, Object>> mlResults = objectMapper.readValue(
                        jsonOutput, new TypeReference<List<Map<String, Object>>>() {}
                    );
                    
                    return convertMLResultsToRecommendations(mlResults, universities);
                }
            } else {
                logger.error("ML script failed with exit code: {}", exitCode);
                // Read error stream
                BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
                StringBuilder errorOutput = new StringBuilder();
                while ((line = errorReader.readLine()) != null) {
                    errorOutput.append(line).append("\n");
                }
                logger.error("ML script error output: {}", errorOutput.toString());
            }
            
        } catch (Exception e) {
            logger.error("Failed to execute ML predictions: {}", e.getMessage(), e);
        }
        
        return new ArrayList<>();
    }
    
    private Map<String, Object> createUserProfileForML(User user) {
        Map<String, Object> profile = new HashMap<>();
        
        // Basic info
        profile.put("CGPA", user.getCgpa() != null ? user.getCgpa().doubleValue() : 3.5);
        
        // Default test scores (you might want to get these from user_scores table)
        profile.put("GRE", 320); // Default, should be fetched from user_scores
        profile.put("TOEFL", 100); // Default, should be fetched from user_scores
        profile.put("IELTS", 0); // Default
        
        // Experience and research
        profile.put("Paper", 0); // Default, should be from user profile
        profile.put("Work_Experience", "No"); // Default, should be from user profile
        profile.put("Gap_year", 0); // Default
        
        // You can add more fields based on your ML model requirements
        logger.info("Created ML user profile: {}", profile);
        return profile;
    }
    
    private List<UniversityRecommendationDto> convertMLResultsToRecommendations(
            List<Map<String, Object>> mlResults, List<University> universities) {
        
        List<UniversityRecommendationDto> recommendations = new ArrayList<>();
        
        // Create a map for quick university lookup by name
        Map<String, University> universityMap = universities.stream()
            .collect(Collectors.toMap(University::getName, u -> u, (u1, u2) -> u1));
        
        for (Map<String, Object> result : mlResults) {
            String universityName = (String) result.get("University");
            Double admissionProb = (Double) result.get("Admission_Probability");
            
            University university = universityMap.get(universityName);
            if (university != null && admissionProb != null) {
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
                    admissionProb // Use ML prediction as match score
                );
                recommendations.add(dto);
            }
        }
        
        // Sort by ML prediction score (admission probability)
        recommendations.sort((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()));
        
        logger.info("Converted {} ML results to recommendations", recommendations.size());
        return recommendations;
    }
    
    private List<UniversityRecommendationDto> getRuleBasedRecommendations(User user, List<University> universities) {
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
        
        return recommendations;
    }
}