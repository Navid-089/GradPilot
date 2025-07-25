package com.gradpilot.controller;

import com.gradpilot.dto.ConversationDto;
import com.gradpilot.dto.MessageDto;
import com.gradpilot.dto.SendMessageDto;
import com.gradpilot.model.Conversation;
import com.gradpilot.model.Message;
import com.gradpilot.service.ChatService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;

    private Integer getCurrentUserId() {
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

    @PostMapping("/start")
    public Conversation startConversation(@RequestParam Integer userId, @RequestParam Integer mentorId) {
        return chatService.getOrCreateConversation(userId, mentorId);
    }

    @PostMapping("/send")
    public Message sendMessage(@RequestBody SendMessageDto dto) {
        Integer userId = getCurrentUserId();
        return chatService.sendMessage(dto.getConversationId(), userId, dto.getText(), dto.getType());
    }

    @GetMapping("/conversations")
    public List<ConversationDto> getUserConversations() {
        Integer userId = getCurrentUserId();
        return chatService.getUserConversations(userId);
    }

    // @GetMapping("/conversations/mentor/{mentorId}")
    // public List<ConversationDto> getMentorConversations(@PathVariable Integer mentorId) {
    //     return chatService.getMentorConversations(mentorId);
    // }

    @GetMapping("/messages/{conversationId}")
    public List<MessageDto> getMessages(@PathVariable Integer conversationId) {
        return chatService.getMessages(conversationId);
    }
}