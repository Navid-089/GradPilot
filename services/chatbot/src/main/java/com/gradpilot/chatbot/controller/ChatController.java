// src/main/java/com/gradpilot/chatbot/controller/ChatController.java
package com.gradpilot.chatbot.controller;

import com.gradpilot.chatbot.dto.ChatRequest;
import com.gradpilot.chatbot.dto.ChatResponse;
import com.gradpilot.chatbot.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = {"http://localhost:3000", "https://gradpilot.me", "https://www.gradpilot.me"}, 
             allowedHeaders = {"*"}, 
             allowCredentials = "true",
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class ChatController {
    private final ChatService svc;
    public ChatController(ChatService svc) { this.svc = svc; }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest req) {
        return ResponseEntity.ok(svc.chat(req));
    }
}
