package com.gradpilot.sopreview.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.List;
import java.util.Map;

@Service
public class SopReviewService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String getSopFeedback(String sopText) {
        String apiUrl = "https://api.languagetool.org/v2/check";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("text", sopText);
        map.add("language", "auto");
        map.add("level", "picky"); // For more suggestions

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);
            List<Map<String, Object>> matches = (List<Map<String, Object>>) response.getBody().get("matches");

            if (matches.isEmpty()) {
                return "Excellent! No grammar or spelling errors were found.";
            }

            StringBuilder feedback = new StringBuilder("Here is the feedback on your SOP:\n\n");
            for (Map<String, Object> match : matches) {
                feedback.append("- **Issue:** ").append(match.get("message")).append("\n");
                
                List<Map<String, Object>> replacements = (List<Map<String, Object>>) match.get("replacements");
                if (!replacements.isEmpty()) {
                    feedback.append("  - **Suggestion:** ").append(replacements.get(0).get("value")).append("\n\n");
                }
            }

            return feedback.toString();
        } catch (Exception e) {
            return "Sorry, there was an error processing your request. Please try again later.";
        }
    }
}