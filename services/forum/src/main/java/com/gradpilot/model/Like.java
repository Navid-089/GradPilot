package com.gradpilot.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "likes")
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private Comment comment;

    @Column(name = "is_like", nullable = false)
    private Boolean isLike;

    @Column(name = "is_dislike", nullable = false)
    private Boolean isDislike;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public Like() {
    }

    public Like(Integer userId, Post post) {
        this.userId = userId;
        this.post = post;
        this.isLike = true; // Default to like
        this.isDislike = false; // Default to not dislike
    }

    public Like(Integer userId, Comment comment) {
        this.userId = userId;
        this.comment = comment;
        this.isLike = true; // Default to like
        this.isDislike = false; // Default to not dislike
    }

    public Like(Integer userId, Post post, Boolean isLike) {
        this.userId = userId;
        this.post = post;
        this.isLike = isLike;
        this.isDislike = false; // Set dislike based on like status
    }

    public Like(Integer userId, Comment comment, Boolean isLike) {
        this.userId = userId;
        this.comment = comment;
        this.isLike = isLike;
        this.isDislike = false; // Default to not dislike
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Comment getComment() {
        return comment;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }

    public Boolean getIsLike() {
        return isLike;
    }

    public void setIsLike(Boolean isLike) {
        this.isLike = isLike;
        this.isDislike = false; // Ensure isDislike is false when isLike is set
    }

    public Boolean getIsDislike() {
        return isDislike;
    }

    public void setIsDislike(Boolean isDislike) {
        this.isDislike = isDislike;
        this.isLike = false; // Ensure isLike is false when isDislike is set
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
