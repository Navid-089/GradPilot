package com.gradpilot.recommendation.controller;

import com.gradpilot.recommendation.dto.RecommendationDto;
import com.gradpilot.recommendation.dto.UniversityRecommendationDto;
import com.gradpilot.recommendation.model.User;
import com.gradpilot.recommendation.model.University;
import com.gradpilot.recommendation.model.Professor;
import com.gradpilot.recommendation.repository.UserRepository;
import com.gradpilot.recommendation.repository.UniversityRepository;
import com.gradpilot.recommendation.service.RecommendationService;
import com.gradpilot.recommendation.service.TrackerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private static final Logger logger = LoggerFactory.getLogger(RecommendationController.class);
    private final RecommendationService recommendationService;
    private final TrackerService trackerService;
    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;

    public RecommendationController(RecommendationService recommendationService, TrackerService trackerService, 
                                  UserRepository userRepository, UniversityRepository universityRepository) {
        this.recommendationService = recommendationService;
        this.trackerService = trackerService;
        this.userRepository = userRepository;
        this.universityRepository = universityRepository;
    }

    // Existing endpoint for professor recommendations
    @GetMapping("/professors")
    public ResponseEntity<List<RecommendationDto>> getProfessorRecommendations(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recommendationService.getProfessorRecommendations(email));
    }

    // New endpoint for professors filtered by research interests
    @GetMapping("/professors/research")
    public ResponseEntity<List<Professor>> getProfessorsByResearchInterests(Authentication authentication) {
        try {
            String email = authentication.getName();
            logger.info("Getting professor recommendations by research interests for email: {}", email);
            List<Professor> professors = recommendationService.getProfessorRecommendationsByInterests(email);
            return ResponseEntity.ok(professors);
        } catch (Exception e) {
            logger.error("Error in getProfessorsByResearchInterests: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    // New endpoint for university recommendations
    @GetMapping("/universities")
    public ResponseEntity<List<UniversityRecommendationDto>> getUniversityRecommendations(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<UniversityRecommendationDto> recommendations = recommendationService.getUniversityRecommendations(email);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            logger.error("Error in getUniversityRecommendations: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    // Alternative endpoint for university recommendations with email in request body
    @PostMapping("/universities")
    public ResponseEntity<List<UniversityRecommendationDto>> getUniversityRecommendationsByEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            logger.info("Getting university recommendations for email: {}", email);
            List<UniversityRecommendationDto> recommendations = recommendationService.getUniversityRecommendations(email);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            logger.error("Error in getUniversityRecommendationsByEmail: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
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
        try {
            String email = authentication.getName();
            Map<String, Object> allRecommendations = new HashMap<>();
            allRecommendations.put("professors", recommendationService.getProfessorRecommendationsByInterests(email));
            allRecommendations.put("universities", recommendationService.getUniversityRecommendations(email));
            return ResponseEntity.ok(allRecommendations);
        } catch (Exception e) {
            logger.error("Error in getAllRecommendations: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
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

    // Debug endpoints
    @GetMapping("/debug/user/{email}")
    public ResponseEntity<Map<String, Object>> debugUser(@PathVariable String email) {
        try {
            User user = userRepository.findByEmail(email).orElse(null);
            Map<String, Object> result = new HashMap<>();
            result.put("userExists", user != null);
            if (user != null) {
                result.put("userId", user.getUserId());
                result.put("name", user.getName());
                result.put("email", user.getEmail());
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/debug/universities/count")
    public ResponseEntity<Map<String, Object>> debugUniversities() {
        try {
            List<University> universities = universityRepository.findAll();
            Map<String, Object> result = new HashMap<>();
            result.put("count", universities.size());
            result.put("universities", universities.stream()
                .limit(5)
                .map(u -> Map.of("id", u.getId(), "name", u.getName()))
                .collect(Collectors.toList()));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}