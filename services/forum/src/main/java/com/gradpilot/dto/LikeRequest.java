package com.gradpilot.dto;

public class LikeRequest {
    private Boolean isLike;

    // Constructors
    public LikeRequest() {
    }

    public LikeRequest(Boolean isLike) {
        this.isLike = isLike;
    }

    // Getters and Setters
    public Boolean getIsLike() {
        return isLike;
    }

    public void setIsLike(Boolean isLike) {
        this.isLike = isLike;
    }
}
