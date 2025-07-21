package com.gradpilot.recommendation.service;

import com.gradpilot.recommendation.model.Apply;
import com.gradpilot.recommendation.model.User;
import com.gradpilot.recommendation.repository.ApplyRepository;
import com.gradpilot.recommendation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ApplyService {
    
    private static final Logger logger = LoggerFactory.getLogger(ApplyService.class);
    
    @Autowired
    private ApplyRepository applyRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public String applyToScholarship(Integer scholarshipId, String userEmail) {
        logger.info("=== APPLY SERVICE - APPLY TO SCHOLARSHIP ===");
        logger.info("ScholarshipId: {}, UserEmail: {}", scholarshipId, userEmail);
        
        // Find user by email
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        logger.info("User found: {}", user.getUserId());
        
        // Check if already applied
        boolean alreadyApplied = applyRepository.existsByUserIdAndScholarshipId(user.getUserId(), scholarshipId);
        
        logger.info("Already applied: {}", alreadyApplied);
        
        if (alreadyApplied) {
            String message = "You have already applied to this scholarship";
            logger.info("Already applied message: {}", message);
            return message;
        }
        
        // Create new application
        Apply apply = new Apply(user.getUserId(), scholarshipId);
        
        logger.info("About to save application: {}", apply);
        applyRepository.save(apply);
        logger.info("Application saved successfully");
        
        String message = "Successfully applied to scholarship";
        logger.info("Success message: {}", message);
        return message;
    }
    
    public List<Map<String, Object>> getUserApplications(String userEmail) {
        logger.info("=== APPLY SERVICE - GET USER APPLICATIONS ===");
        logger.info("UserEmail: {}", userEmail);
        
        // Find user by email
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        logger.info("User found: {}", user.getUserId());
        
        // Get all applications for the user
        List<Apply> applications = applyRepository.findByUserIdOrderByCreatedAtDesc(user.getUserId());
        
        logger.info("Applications found: {}", applications.size());
        
        // Convert to Map format for frontend compatibility
        return applications.stream()
                .map(this::convertApplicationToMap)
                .toList();
    }
    
    public String removeApplication(Integer scholarshipId, String userEmail) {
        logger.info("=== APPLY SERVICE - REMOVE APPLICATION ===");
        logger.info("ScholarshipId: {}, UserEmail: {}", scholarshipId, userEmail);
        
        // Find user by email
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        logger.info("User found: {}", user.getUserId());
        
        // Check if application exists
        boolean applicationExists = applyRepository.existsByUserIdAndScholarshipId(user.getUserId(), scholarshipId);
        
        if (!applicationExists) {
            String message = "No application found for this scholarship";
            logger.info("No application found message: {}", message);
            return message;
        }
        
        // Delete the application
        applyRepository.deleteByUserIdAndScholarshipId(user.getUserId(), scholarshipId);
        logger.info("Application removed successfully");
        
        String message = "Application removed successfully";
        logger.info("Success message: {}", message);
        return message;
    }
    
    public boolean hasUserApplied(Integer scholarshipId, String userEmail) {
        logger.info("=== APPLY SERVICE - CHECK IF USER APPLIED ===");
        logger.info("ScholarshipId: {}, UserEmail: {}", scholarshipId, userEmail);
        
        try {
            // Find user by email
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            logger.info("User found: {}", user.getUserId());
            
            boolean hasApplied = applyRepository.existsByUserIdAndScholarshipId(user.getUserId(), scholarshipId);
            logger.info("Has applied: {}", hasApplied);
            
            return hasApplied;
        } catch (Exception e) {
            logger.error("Error checking application status: {}", e.getMessage());
            return false;
        }
    }
    
    private Map<String, Object> convertApplicationToMap(Apply apply) {
        Map<String, Object> applicationMap = new HashMap<>();
        applicationMap.put("userId", apply.getUserId());
        applicationMap.put("scholarshipId", apply.getScholarshipId());
        applicationMap.put("createdAt", apply.getCreatedAt());
        
        return applicationMap;
    }
}
