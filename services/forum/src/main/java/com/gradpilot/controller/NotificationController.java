package com.gradpilot.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gradpilot.model.Notification;
import com.gradpilot.repository.NotificationRepository;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationRepository notificationRepository;

    // private Integer getCurrentUserId() {
    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // if (authentication == null || !authentication.isAuthenticated()) {
    // throw new RuntimeException("User is not authenticated");
    // }
    // @SuppressWarnings("unchecked")
    // var principal = (java.util.Map<String, Object>)
    // authentication.getPrincipal();
    // return (Integer) principal.get("userId");
    // }

    private Integer getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }

        Object principalObj = authentication.getPrincipal();
        if (principalObj instanceof Map<?, ?> principal) {
            Object userIdObj = principal.get("userId");
            if (userIdObj instanceof Integer userId) {
                return userId;
            } else if (userIdObj instanceof Number number) {
                return number.intValue();
            } else {
                throw new RuntimeException("User ID is missing or not an integer");
            }
        } else if (principalObj instanceof String principalStr && "anonymousUser".equals(principalStr)) {
            throw new RuntimeException("User is anonymous");
        } else {
            throw new RuntimeException("Unknown principal type: " + principalObj.getClass());
        }
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

    // Get all notifications for the logged-in user
    @GetMapping
    public Page<Notification> getNotifications(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        // Integer userId = Integer.valueOf(principal.getName());
        Integer userId = getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("User ID not found in principal");
        }
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    // Mark notification as read
    @PostMapping("/{id}/read")
    public void markAsRead(@PathVariable Integer id) {
        Integer userId = getCurrentUserId();
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getUserId().equals(userId)) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
    }
}
