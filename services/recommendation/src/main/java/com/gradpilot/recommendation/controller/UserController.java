package com.gradpilot.recommendation.controller;

import com.gradpilot.recommendation.model.ResearchInterest;
import com.gradpilot.recommendation.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final RecommendationService recommendationService;

    public UserController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/research-interests")
    public ResponseEntity<List<ResearchInterest>> getUserResearchInterests(Authentication authentication) {
        try {
            String email = authentication.getName();
            logger.info("Getting research interests for user: {}", email);
            List<ResearchInterest> interests = recommendationService.getUserResearchInterests(email);
            return ResponseEntity.ok(interests);
        } catch (Exception e) {
            logger.error("Error getting user research interests: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
}
