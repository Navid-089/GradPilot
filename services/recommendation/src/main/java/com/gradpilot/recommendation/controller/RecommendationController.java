package com.gradpilot.recommendation.controller;

import com.gradpilot.recommendation.dto.RecommendationDto;
import com.gradpilot.recommendation.dto.UniversityRecommendationDto;
import com.gradpilot.recommendation.service.RecommendationService;
import com.gradpilot.recommendation.service.TrackerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private final RecommendationService recommendationService;
    private final TrackerService trackerService;

    public RecommendationController(RecommendationService recommendationService, TrackerService trackerService) {
        this.recommendationService = recommendationService;
        this.trackerService = trackerService;
    }

    // Existing endpoint for professor recommendations
    @GetMapping("/professors")
    public ResponseEntity<List<RecommendationDto>> getProfessorRecommendations(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recommendationService.getProfessorRecommendations(email));
    }

    // New endpoint for university recommendations
    @GetMapping("/universities")
    public ResponseEntity<List<UniversityRecommendationDto>> getUniversityRecommendations(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recommendationService.getUniversityRecommendations(email));
    }

    // Alternative endpoint for university recommendations with email in request body
    @PostMapping("/universities")
    public ResponseEntity<List<UniversityRecommendationDto>> getUniversityRecommendationsByEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(recommendationService.getUniversityRecommendations(email));
    }

    // Get university recommendations by category
    @GetMapping("/universities/category/{category}")
    public ResponseEntity<List<UniversityRecommendationDto>> getUniversityRecommendationsByCategory(
            Authentication authentication,
            @PathVariable String category,
            @RequestParam(defaultValue = "20") int limit) {
        String email = authentication.getName();
        return ResponseEntity.ok(recommendationService.getUniversityRecommendationsByCategory(email, category, limit));
    }

    // Get all recommendations (both professors and universities)
    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllRecommendations(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recommendationService.getAllRecommendations(email));
    }

    // Legacy endpoint for backward compatibility
    @GetMapping
    public ResponseEntity<List<RecommendationDto>> getRecommendations(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recommendationService.getProfessorRecommendations(email));
    }

    // Tracker endpoints
   @PostMapping("/tracker/save")
   public ResponseEntity<Map<String, String>> saveTask(@RequestBody Map<String, Object> request, Authentication authentication) {
       try {
           String userEmail = authentication.getName();
           String type = (String) request.get("type");
           String taskId = request.get("taskId").toString();
           String message = trackerService.saveTask(type, taskId, userEmail);
           return ResponseEntity.ok(Map.of("message", message));
       } catch (Exception e) {
           return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
       }
   }

   @GetMapping("/tracker/tasks")
   public ResponseEntity<List<Map<String, Object>>> getUserTasks(Authentication authentication) {
       try {
           String userEmail = authentication.getName();
           List<Map<String, Object>> tasks = trackerService.getUserTasks(userEmail);
           return ResponseEntity.ok(tasks);
       } catch (Exception e) {
           return ResponseEntity.badRequest().build();
       }
   }

   @GetMapping("/tracker/tasks/{type}")
   public ResponseEntity<List<Map<String, Object>>> getUserTasksByType(@PathVariable String type, Authentication authentication) {
       try {
           String userEmail = authentication.getName();
           List<Map<String, Object>> tasks = trackerService.getUserTasksByType(userEmail, type);
           return ResponseEntity.ok(tasks);
       } catch (Exception e) {
           return ResponseEntity.badRequest().build();
       }
   }

   @DeleteMapping("/tracker/remove")
   public ResponseEntity<Map<String, String>> removeTask(@RequestBody Map<String, Object> request, Authentication authentication) {
       try {
           String userEmail = authentication.getName();
           String type = (String) request.get("type");
           String taskId = request.get("taskId").toString();
           String message = trackerService.removeTask(type, taskId, userEmail);
           return ResponseEntity.ok(Map.of("message", message));
       } catch (Exception e) {
           return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
       }
   }
}