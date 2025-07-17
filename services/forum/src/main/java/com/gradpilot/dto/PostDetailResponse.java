package com.gradpilot.dto;

import java.util.List;

public class PostDetailResponse {
    private PostResponse post;
    private List<CommentResponse> comments;

    // Constructors
    public PostDetailResponse() {
    }

    public PostDetailResponse(PostResponse post, List<CommentResponse> comments) {
        this.post = post;
        this.comments = comments;
    }

    // Getters and Setters
    public PostResponse getPost() {
        return post;
    }

    public void setPost(PostResponse post) {
        this.post = post;
    }

    public List<CommentResponse> getComments() {
        return comments;
    }

    public void setComments(List<CommentResponse> comments) {
        this.comments = comments;
    }
}
