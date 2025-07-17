package com.gradpilot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateCommentRequest {
    @NotBlank(message = "Content is required")
    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String content;

    private Boolean isAnonymous = false;

    // Constructors
    public CreateCommentRequest() {
    }

    public CreateCommentRequest(String content, Boolean isAnonymous) {
        this.content = content;
        this.isAnonymous = isAnonymous;
    }

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getIsAnonymous() {
        return isAnonymous;
    }

    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }
}
