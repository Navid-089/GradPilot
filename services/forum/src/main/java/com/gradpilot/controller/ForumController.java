package com.gradpilot.controller;

import com.gradpilot.dto.*;
import com.gradpilot.service.ForumService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
@CrossOrigin(origins = "*")
public class ForumController {

    @Autowired
    private ForumService forumService;

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

    // Create a new post
    @PostMapping("/posts")
    public ResponseEntity<PostResponse> createPost(
            @Valid @RequestBody CreatePostRequest request,
            HttpServletRequest httpRequest) {
        Integer userId = getCurrentUserId();
        PostResponse response = forumService.createPost(request, userId);
        return ResponseEntity.ok(response);
    }

    // Get posts with pagination and filtering
    @GetMapping("/posts")
    public ResponseEntity<Page<PostResponse>> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String title,
            HttpServletRequest httpRequest) {
        Integer userId = getCurrentUserIdOptional();
        Page<PostResponse> posts = forumService.getPosts(page, size, tag, title, userId);
        return ResponseEntity.ok(posts);
    }

    // Get single post with comments
    @GetMapping("/posts/{id}")
    public ResponseEntity<PostDetailResponse> getPostDetails(
            @PathVariable Integer id,
            HttpServletRequest httpRequest) {
        Integer userId = getCurrentUserIdOptional();
        PostDetailResponse response = forumService.getPostDetails(id, userId);
        return ResponseEntity.ok(response);
    }

    // Add comment to post
    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Integer id,
            @Valid @RequestBody CreateCommentRequest request,
            HttpServletRequest httpRequest) {
        Integer userId = getCurrentUserIdOptional();
        if (userId == null) {
            // For testing purposes, use a default user ID
            userId = 1; // You should replace this with proper authentication
        }
        CommentResponse response = forumService.createComment(id, request, userId);
        return ResponseEntity.ok(response);
    }

    // Like/Unlike a post
    @PostMapping("/posts/{id}/like")
    public ResponseEntity<Void> togglePostLike(
            @PathVariable Integer id,
            @RequestBody LikeRequest request,
            HttpServletRequest httpRequest) {
        Integer userId = getCurrentUserIdOptional();
        if (userId == null) {
            // For testing purposes, use a default user ID
            userId = 1; // You should replace this with proper authentication
        }
        forumService.togglePostLike(id, request, userId);
        return ResponseEntity.ok().build();
    }

    // Like/Unlike a comment
    @PostMapping("/comments/{id}/like")
    public ResponseEntity<Void> toggleCommentLike(
            @PathVariable Integer id,
            @RequestBody LikeRequest request,
            HttpServletRequest httpRequest) {
        Integer userId = getCurrentUserIdOptional();
        if (userId == null) {
            // For testing purposes, use a default user ID
            userId = 1; // You should replace this with proper authentication
        }
        forumService.toggleCommentLike(id, request, userId);
        return ResponseEntity.ok().build();
    }

    // Get all available tags
    @GetMapping("/tags")
    public ResponseEntity<List<String>> getAllTags() {
        List<String> tags = forumService.getAllTags();
        return ResponseEntity.ok(tags);
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Integer postId) {
        forumService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Integer commentId) {
        forumService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
