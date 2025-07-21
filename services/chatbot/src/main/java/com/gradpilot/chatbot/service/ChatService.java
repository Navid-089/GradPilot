package com.gradpilot.chatbot.service;

import com.gradpilot.chatbot.dto.ChatRequest;
import com.gradpilot.chatbot.dto.ChatResponse;
import com.gradpilot.chatbot.model.User;
import com.gradpilot.chatbot.repo.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

        private final RestTemplate restTemplate;
        private final UserRepository userRepo;
        private final String apiKey;

        public ChatService(@Value("${gemini.api.key}") String apiKey, UserRepository userRepo) {
                this.userRepo = userRepo;
                this.apiKey = apiKey;
                this.restTemplate = new RestTemplate();
        }

        private record GeminiResponse(
                        List<Candidate> candidates) {
        }

        private record Candidate(
                        Content content) {
        }

        private record Content(
                        List<Part> parts) {
        }

        private record Part(
                        String text) {
        }

        @Transactional(readOnly = true)
        public ChatResponse chat(ChatRequest req) {
                try {
                        // Get user ID from authentication context
                        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                        if (authentication == null || !authentication.isAuthenticated()) {
                                // Return a response for unauthenticated users
                                String fullPrompt = "You are an admissions advisor for US MS/PhD applicants. The user is not logged in, so provide general advice.\n\nUser: "
                                                + req.message();
                                return generateGeminiResponse(fullPrompt);
                        }

                        @SuppressWarnings("unchecked")
                        Map<String, Object> principal = (Map<String, Object>) authentication.getPrincipal();
                        Integer userId = (Integer) principal.get("userId");

                        if (userId == null) {
                                // If no user ID in principal, treat as unauthenticated
                                String fullPrompt = "You are an admissions advisor for US MS/PhD applicants. The user is not properly authenticated, so provide general advice.\n\nUser: "
                                                + req.message();
                                return generateGeminiResponse(fullPrompt);
                        }

                        // Fetch user using UserRepository
                        User user = userRepo.findById(userId).orElse(null);
                        System.out.println(
                                        "Database query result - User: " + (user != null ? user.getName() : "Unknown"));

                        String customPrompt = (user != null) ? String.format(
                                        "Remember, you are an admissions advisor for US MS/PhD applicants. You are helping %s. They have a CGPA of %s and are interested in applying in %d. Give tailored advice based on the next question (This is the actual question %s asked):",
                                        user.getName(),
                                        user.getCgpa() != null ? user.getCgpa() : "not specified",
                                        user.getApplyYear() != null ? user.getApplyYear() : 2025,
                                        user.getName())
                                        : "You are an admissions advisor for US MS/PhD applicants.";

                        System.out.println("Custom Prompt: " + customPrompt);
                        String fullPrompt = customPrompt + "\n\nUser: " + req.message();
                        return generateGeminiResponse(fullPrompt);

                } catch (Exception e) {
                        e.printStackTrace(); // Show error in logs
                        return new ChatResponse("An error occurred: " + e.getMessage());
                }
        }

        private ChatResponse generateGeminiResponse(String fullPrompt) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("x-goog-api-key", apiKey);

                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("contents", new Object[] {
                                Map.of(
                                                "parts", new Object[] {
                                                                Map.of("text", fullPrompt)
                                                })
                });

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

                String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
                                + apiKey;
                GeminiResponse geminiResponse = restTemplate.exchange(
                                url,
                                HttpMethod.POST,
                                request,
                                GeminiResponse.class).getBody();

                if (geminiResponse == null || geminiResponse.candidates() == null
                                || geminiResponse.candidates().isEmpty()) {
                        throw new RuntimeException("No response from Gemini API");
                }

                String reply = geminiResponse.candidates().get(0).content().parts().get(0).text();
                return new ChatResponse(reply);
        }

        @Transactional(readOnly = true)
        public ChatResponse sopReview(ChatRequest req) {
                try {
                        // Get user ID from authentication context
                        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                        if (authentication == null || !authentication.isAuthenticated()) {
                                // Return a response for unauthenticated users
                                String fullPrompt = "You are an SOP reviewer for US MS/PhD applicants. The user is not logged in, so provide general advice.\n\nUser: "
                                                + req.message();
                                return generateGeminiResponse(fullPrompt);
                        }

                        @SuppressWarnings("unchecked")
                        Map<String, Object> principal = (Map<String, Object>) authentication.getPrincipal();
                        Integer userId = (Integer) principal.get("userId");

                        if (userId == null) {
                                // If no user ID in principal, treat as unauthenticated
                                String fullPrompt = "You are an SOP reviewer for US MS/PhD applicants. The user is not properly authenticated, so provide general advice. Give tailored advice based on his/her SOP (This is the SOP he/she uploaded):\n\nUser: "
                                                + req.message();
                                return generateGeminiResponse(fullPrompt);
                        }

                        // Fetch user using UserRepository
                        User user = userRepo.findById(userId).orElse(null);
                        System.out.println(
                                        "Database query result - User: " + (user != null ? user.getName() : "Unknown"));

                        String customPrompt = (user != null) ? String.format(
                                        "Remember, you are an SOP reviewer for US MS/PhD applicants. You are helping %s. They have a CGPA of %s and are interested in applying in %d. Give tailored advice based on his/her SOP (This is the SOP he/she uploaded):",
                                        user.getName(),
                                        user.getCgpa() != null ? user.getCgpa() : "not specified",
                                        user.getApplyYear() != null ? user.getApplyYear() : 2025,
                                        user.getName())
                                        : "You are an SOP reviewer for US MS/PhD applicants. Give tailored advice based on his/her SOP (This is the SOP he/she uploaded):";

                        System.out.println("Custom Prompt: " + customPrompt);
                        String fullPrompt = customPrompt + "\n\nUser: " + req.message();
                        return generateGeminiResponse(fullPrompt);

                } catch (Exception e) {
                        e.printStackTrace(); // Show error in logs
                        return new ChatResponse("An error occurred: " + e.getMessage());
                }
        }
}
