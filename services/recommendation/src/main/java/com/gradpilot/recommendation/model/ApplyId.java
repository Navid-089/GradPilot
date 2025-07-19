package com.gradpilot.recommendation.model;

import java.io.Serializable;
import java.util.Objects;

public class ApplyId implements Serializable {
    private Integer userId;
    private Integer scholarshipId;
    
    public ApplyId() {}
    
    public ApplyId(Integer userId, Integer scholarshipId) {
        this.userId = userId;
        this.scholarshipId = scholarshipId;
    }
    
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
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ApplyId applyId = (ApplyId) o;
        return Objects.equals(userId, applyId.userId) &&
               Objects.equals(scholarshipId, applyId.scholarshipId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(userId, scholarshipId);
    }
}
