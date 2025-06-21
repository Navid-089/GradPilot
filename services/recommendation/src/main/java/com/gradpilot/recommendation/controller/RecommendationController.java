package com.gradpilot.recommendation.controller;

import com.gradpilot.recommendation.dto.RecommendationDto;
import com.gradpilot.recommendation.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ResponseEntity<List<RecommendationDto>> getRecommendations(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recommendationService.getRecommendations(email));
    }
}