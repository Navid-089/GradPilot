// src/main/java/com/gradpilot/chatbot/controller/ChatController.java
package com.gradpilot.chatbot.controller;

import com.gradpilot.chatbot.dto.ChatRequest;
import com.gradpilot.chatbot.dto.ChatResponse;
import com.gradpilot.chatbot.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sop-review")
@CrossOrigin(origins = { "http://localhost:3000", "https://gradpilot.me", "https://www.gradpilot.me" }) // Add this
public class SopReviewController {
    private final ChatService svc;

    public SopReviewController(ChatService svc) {
        this.svc = svc;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> sopReview(@RequestBody ChatRequest req) {
        return ResponseEntity.ok(svc.sopReview(req));
    }
}
