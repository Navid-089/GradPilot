package com.gradpilot.recommendation.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "applies")
@IdClass(ApplyId.class)
public class Apply {
    
    @Id
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    @Id
    @Column(name = "scholarship_id", nullable = false)
    private Integer scholarshipId;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public Apply() {}
    
    public Apply(Integer userId, Integer scholarshipId) {
        this.userId = userId;
        this.scholarshipId = scholarshipId;
    }
    
    // Getters and Setters
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    public Integer getScholarshipId() {
        return scholarshipId;
    }
    
    public void setScholarshipId(Integer scholarshipId) {
        this.scholarshipId = scholarshipId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "Apply{" +
                "userId=" + userId +
                ", scholarshipId=" + scholarshipId +
                ", createdAt=" + createdAt +
                '}';
    }
}
