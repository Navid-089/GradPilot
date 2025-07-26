package com.gradpilot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gradpilot.dto.ConversationDto;
import com.gradpilot.dto.MessageDto;
import com.gradpilot.dto.SendMessageDto;
import com.gradpilot.model.Message;
import com.gradpilot.service.ChatService;

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
    public ConversationDto startConversation(@RequestParam Integer mentorId) {
        return chatService.getOrCreateConversation(getCurrentUserId(), mentorId);
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