package com.gradpilot.recommendation.service;

import com.gradpilot.recommendation.dto.UniversityRecommendationDto;
import com.gradpilot.recommendation.model.University;
import com.gradpilot.recommendation.model.User;
import com.gradpilot.recommendation.model.UserScore;
import com.gradpilot.recommendation.repository.UniversityRepository;
import com.gradpilot.recommendation.repository.UserRepository;
import com.gradpilot.recommendation.repository.UserScoreRepository;
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
    private final UserScoreRepository userScoreRepository;
    
    public MLRecommendationService(UniversityRepository universityRepository, UserRepository userRepository, UserScoreRepository userScoreRepository) {
        this.universityRepository = universityRepository;
        this.userRepository = userRepository;
        this.userScoreRepository = userScoreRepository;
    }
    
    @Transactional(readOnly = true)
    public List<UniversityRecommendationDto> getUniversityRecommendations(Integer userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            List<University> universities = universityRepository.findAll();
            
            if (universities.isEmpty()) {
                logger.warn("No universities found in database");
                return new ArrayList<>();
            }
            
            // Try to get ML predictions first
            List<UniversityRecommendationDto> recommendations = getMLPredictions(user, universities);
            
            // If ML fails, fallback to rule-based scoring
            if (recommendations.isEmpty()) {
                logger.info("ML predictions unavailable, using rule-based scoring for user: {}", user.getEmail());
                recommendations = getRuleBasedRecommendations(user, universities);
            }
            
            return recommendations;
        } catch (Exception e) {
            logger.error("Error getting university recommendations: {}", e.getMessage(), e);
            throw new RuntimeException("Error getting university recommendations: " + e.getMessage());
        }
    }
    
    private double calculateMatchScore(User user, University university) {
        double score = 0.0;
        
        // 1. Country preference match (35% weight)
        if (user.getTargetCountries() != null && !user.getTargetCountries().isEmpty()) {
            boolean countryMatch = user.getTargetCountries().stream()
                .anyMatch(country -> country.getName().equalsIgnoreCase(university.getCountry()));
            if (countryMatch) {
                score += 0.35;
            }
        }
        
        // 2. CGPA-based university tier matching (30% weight)
        if (user.getCgpa() != null && university.getRanking() != null) {
            double gpa = user.getCgpa().doubleValue();
            int ranking = university.getRanking();
            
            if (gpa >= 3.8 && ranking <= 10) {
                score += 0.30;
            } else if (gpa >= 3.6 && ranking <= 30) {
                score += 0.25;
            } else if (gpa >= 3.4 && ranking <= 50) {
                score += 0.20;
            } else if (gpa >= 3.2 && ranking <= 100) {
                score += 0.15;
            } else if (gpa >= 3.0 && ranking > 100) {
                score += 0.10;
            } else if (gpa < 3.5 && ranking <= 20) {
                score -= 0.1; // Penalty for low GPA targeting top universities
            }
        }
        
        // 3. Tuition affordability (15% weight)
        if (university.getTuitionFees() != null) {
            if (university.getTuitionFees() < 15000) {
                score += 0.15;
            } else if (university.getTuitionFees() < 30000) {
                score += 0.12;
            } else if (university.getTuitionFees() < 50000) {
                score += 0.08;
            } else {
                score += 0.03;
            }
        }
        
        // 4. Research interest match (15% weight)
        if (user.getResearchInterests() != null && !user.getResearchInterests().isEmpty()) {
            if (university.getRanking() != null && university.getRanking() <= 20) {
                score += 0.15;
            } else if (university.getRanking() != null && university.getRanking() <= 50) {
                score += 0.10;
            } else if (university.getRanking() != null && university.getRanking() <= 100) {
                score += 0.05;
            }
        }
        
        // 5. User-specific randomization for variety (5% weight)
        java.util.Random userRandom = new java.util.Random(user.getUserId().longValue());
        double randomFactor = userRandom.nextDouble() * 0.05;
        score += randomFactor;
        
        // 6. Apply year consideration
        if (user.getApplyYear() != null) {
            int currentYear = java.time.Year.now().getValue();
            int yearsToApply = user.getApplyYear() - currentYear;
            if (yearsToApply >= 1 && yearsToApply <= 2) {
                score += 0.05;
            }
        }
        
        // Cap the score at 1.0 and ensure minimum of 0.0
        return Math.max(0.0, Math.min(score, 1.0));
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
            Map<String, String> env = processBuilder.environment();
            env.put("PYTHONPATH", ".");
            
            Process process = processBuilder.start();
            
            BufferedReader outputReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            
            StringBuilder output = new StringBuilder();
            StringBuilder errorOutput = new StringBuilder();
            String line;
            
            while ((line = outputReader.readLine()) != null) {
                output.append(line).append("\n");
            }
            
            while ((line = errorReader.readLine()) != null) {
                errorOutput.append(line).append("\n");
            }
            
            int exitCode = process.waitFor();
            tempFile.delete();
            
            if (exitCode == 0) {
                String jsonOutput = output.toString().trim();
                
                if (!jsonOutput.isEmpty()) {
                    try {
                        List<Map<String, Object>> mlResults = objectMapper.readValue(
                            jsonOutput, new TypeReference<List<Map<String, Object>>>() {}
                        );
                        // print mlResults for debugging
                        logger.info("ML results: {}", mlResults);

                        return convertMLResultsToRecommendations(mlResults, universities);
                    } catch (Exception parseException) {
                        logger.error("Failed to parse ML output: {}", parseException.getMessage());
                        return new ArrayList<>();
                    }
                }
            } else {
                logger.error("ML script failed with exit code: {}", exitCode);
                if (errorOutput.length() > 0) {
                    logger.error("ML error: {}", errorOutput.toString());
                }
            }
            
            return new ArrayList<>();
            
        } catch (Exception e) {
            logger.error("ML execution failed: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
    
    private Map<String, Object> createUserProfileForML(User user) {
        Map<String, Object> profile = new HashMap<>();
        
        // Basic info - use actual user CGPA
        profile.put("CGPA", user.getCgpa() != null ? user.getCgpa().doubleValue() : 3.5);
        
        // Fetch actual test scores from user_scores table
        List<UserScore> userScores = userScoreRepository.findByUserId(user.getUserId());
        Map<String, String> scoresMap = new HashMap<>();
        for (UserScore score : userScores) {
            scoresMap.put(score.getTestName().toUpperCase(), score.getScore());
        }
        // 
        // Parse test scores with proper defaults
        profile.put("GRE", parseScore(scoresMap.get("GRE"), 320)); // Default GRE score
        profile.put("TOEFL", parseScore(scoresMap.get("TOEFL"), 100)); // Default TOEFL score
        profile.put("IELTS", parseScore(scoresMap.get("IELTS"), 0)); // Default IELTS score (0 if not taken)
        
        // Research experience based on user's research interests
        int researchInterestCount = user.getResearchInterests() != null ? user.getResearchInterests().size() : 0;
        profile.put("Paper", Math.min(researchInterestCount, 3)); // Estimate papers based on research interests
        
        // Work experience estimation (could be enhanced with actual work experience field)
        profile.put("Work_Experience", researchInterestCount > 2 ? "Yes" : "No");
        
        // Gap year calculation based on apply year
        int currentYear = java.time.Year.now().getValue();
        int targetApplyYear = user.getApplyYear() != null ? user.getApplyYear() : currentYear + 1;
        profile.put("Gap_year", Math.max(0, targetApplyYear - currentYear - 1));
        
        // Add target countries as additional context (for ML model enhancement)
        if (user.getTargetCountries() != null && !user.getTargetCountries().isEmpty()) {
            profile.put("Target_Countries", user.getTargetCountries().stream()
                .map(country -> country.getName())
                .collect(java.util.stream.Collectors.joining(",")));
        } else {
            profile.put("Target_Countries", "USA"); // Default
        }
        
        // Add target majors as additional context
        if (user.getTargetMajors() != null && !user.getTargetMajors().isEmpty()) {
            profile.put("Target_Majors", user.getTargetMajors().stream()
                .map(major -> major.getName())
                .collect(java.util.stream.Collectors.joining(",")));
        } else {
            profile.put("Target_Majors", "Computer Science"); // Default
        }
        
        // Add research interests as additional context
        if (user.getResearchInterests() != null && !user.getResearchInterests().isEmpty()) {
            profile.put("Research_Interests", user.getResearchInterests().stream()
                .map(interest -> interest.getName())
                .collect(java.util.stream.Collectors.joining(",")));
        } else {
            profile.put("Research_Interests", "Machine Learning"); // Default
        }
        
        logger.info("Created ML user profile for user: {}", user.getEmail());
        return profile;
    }
    
    /**
     * Helper method to parse score strings to double values
     */
    private double parseScore(String scoreStr, double defaultValue) {
        if (scoreStr == null || scoreStr.trim().isEmpty()) {
            return defaultValue;
        }
        try {
            return Double.parseDouble(scoreStr.trim());
        } catch (NumberFormatException e) {
            logger.warn("Failed to parse score '{}', using default value {}", scoreStr, defaultValue);
            return defaultValue;
        }
    }
    
    private List<UniversityRecommendationDto> convertMLResultsToRecommendations(
            List<Map<String, Object>> mlResults, List<University> universities) {
        
        List<UniversityRecommendationDto> recommendations = new ArrayList<>();
        
        // Create a map for quick university lookup by name
        Map<String, University> universityMap = universities.stream()
            .collect(Collectors.toMap(u -> u.getName().toLowerCase().trim(), u -> u, (u1, u2) -> u1));

        
        for (Map<String, Object> result : mlResults) {
            String universityName = (String) result.get("University");
            Double admissionProb = (Double) result.get("Admission_Probability");
            
            University university = universityMap.get(universityName.toLowerCase().trim());

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
                    university.getLocationUrl(),
                    university.getDeadline(),
                    admissionProb // Use ML prediction as match score
                );
                recommendations.add(dto);
            }
        }
        
        // Sort by ML prediction score (admission probability)
        recommendations.sort((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()));
        
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
                university.getLocationUrl(),
                university.getDeadline(),
                matchScore
            );
            
            recommendations.add(dto);
        }

        // Sort by match score in descending order
        recommendations.sort((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()));
        
        return recommendations;
    }
}