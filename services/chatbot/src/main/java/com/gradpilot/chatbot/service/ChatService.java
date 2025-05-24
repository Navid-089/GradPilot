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
import org.springframework.stereotype.Service;
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

    public ChatResponse chat(ChatRequest req) {
        try {
            // Fetch user using UserRepository
            User user = userRepo.findById(Integer.valueOf(req.userId())).orElse(null);

            System.out.println("User: " + (user != null ? user.getName() : "Unknown"));
            System.out.println("Message: " + req.message());

            String customPrompt = (user != null) ? String.format(
                    "You are helping %s. They have a CGPA of %s and are interested in applying in %d. Their bio: %s. Give tailored advice.",
                    user.getName(),
                    user.getCgpa() != null ? user.getCgpa() : "not specified",
                    user.getApplyYear() != null ? user.getApplyYear() : 2025,
                    user.getBio() != null ? user.getBio() : "not specified")
                    : "You are an admissions advisor for US MS/PhD applicants.";

            String fullPrompt = customPrompt + "\n\nUser: " + req.message();

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

        } catch (Exception e) {
            e.printStackTrace(); // Show error in logs
            return new ChatResponse("An error occurred: " + e.getMessage());
        }
    }
}
