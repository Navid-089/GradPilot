package com.gradpilot.controller;

import com.gradpilot.dto.ConversationDto;
import com.gradpilot.dto.MessageDto;
import com.gradpilot.dto.SendMessageDto;
import com.gradpilot.model.Conversation;
import com.gradpilot.model.Message;
import com.gradpilot.service.MentorChatService;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/chat")
public class MentorChatController {
    @Autowired
    private MentorChatService mentorChatService;

    private Integer getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }
        @SuppressWarnings("unchecked")
        var principal = (java.util.Map<String, Object>) authentication.getPrincipal();
        return (Integer) principal.get("userId");
    }

    private Integer getCurrentMentorId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }
        @SuppressWarnings("unchecked")
        var principal = (java.util.Map<String, Object>) authentication.getPrincipal();
        return (Integer) principal.get("userId");
    }

    private Integer getCurrentUserIdOptional() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() ||
                    "anonymousUser".equals(authentication.getPrincipal())) {
                return null;
            }
            @SuppressWarnings("unchecked")
            var principal = (java.util.Map<String, Object>) authentication.getPrincipal();
            return (Integer) principal.get("userId");
        } catch (Exception e) {
            return null;
        }
    }

    @PostMapping("/mentor/start")
    public Conversation startConversation(@RequestParam Integer userId, @RequestParam Integer mentorId) {
        return mentorChatService.getOrCreateConversation(userId, mentorId);
    }

    @PostMapping("/mentor/send")
    public Message sendMessage(@RequestBody SendMessageDto dto) {
        // Integer userId = getCurrentUserId();
        Integer mentorId = getCurrentMentorId();
        return mentorChatService.sendMessage(dto.getConversationId(), mentorId, dto.getText(), dto.getType());
    }

    // @GetMapping("/user/conversations")
    // public List<ConversationDto> getUserConversations() {
    // Integer userId = getCurrentUserId();
    // return mentorChatService.getUserConversations(userId);
    // }

    @GetMapping("/mentor/conversations")
    public ResponseEntity<?> getMentorConversations() {
        Integer mentorId = getCurrentMentorId();
        if (mentorId == null) {
            return ResponseEntity.status(HttpStatus.SC_UNAUTHORIZED).body("User not authenticated");
        }
        try {
            List<ConversationDto> conversations = mentorChatService.getMentorConversations(mentorId);
            return ResponseEntity.ok(conversations);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body("Mentor not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @GetMapping("/mentor/messages/{conversationId}")
    public List<MessageDto> getMessages(@PathVariable Integer conversationId) {
        return mentorChatService.getMessages(conversationId);
    }
}