package com.gradpilot.dto;

import java.time.LocalDateTime;

public class CommentResponse {
    private Integer id;
    private String authorName;
    private String content;
    private Long likeCount;
    private Long dislikeCount;
    private LocalDateTime createdAt;
    private Boolean userLiked;
    private Boolean userDisliked;
    private Integer userId; // Added userId to identify the comment's author
    private Boolean isAnonymous; // Indicates if the comment is anonymous
    private String userGender;

    // Constructors
    public CommentResponse() {
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Long likeCount) {
        this.likeCount = likeCount;
    }

    public Long getDislikeCount() {
        return dislikeCount;
    }

    public void setDislikeCount(Long dislikeCount) {
        this.dislikeCount = dislikeCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getUserLiked() {
        return userLiked;
    }

    public void setUserLiked(Boolean userLiked) {
        this.userLiked = userLiked;
    }

    public Boolean getUserDisliked() {
        return userDisliked;
    }

    public void setUserDisliked(Boolean userDisliked) {
        this.userDisliked = userDisliked;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Boolean getIsAnonymous() {
        return isAnonymous;
    }

    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }

    public void setUserGender(String gender) {
        this.userGender = gender;
    }

    public String getUserGender() {
        return this.userGender;
    }
}
