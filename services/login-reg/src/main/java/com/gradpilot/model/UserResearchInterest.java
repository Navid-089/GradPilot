package com.gradpilot.model;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_research_interests")
@IdClass(UserResearchInterest.UserResearchInterestId.class)
public class UserResearchInterest {

    @Id
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Id
    @Column(name = "research_interest_id", nullable = false)
    private Integer researchInterestId;

    // Default constructor
    public UserResearchInterest() {
    }

    // Constructor
    public UserResearchInterest(Integer userId, Integer researchInterestId) {
        this.userId = userId;
        this.researchInterestId = researchInterestId;
    }

    // Getters and setters
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getResearchInterestId() {
        return researchInterestId;
    }

    public void setResearchInterestId(Integer researchInterestId) {
        this.researchInterestId = researchInterestId;
    }

    // Composite primary key class
    public static class UserResearchInterestId implements Serializable {

        private Integer userId;
        private Integer researchInterestId;

        public UserResearchInterestId() {
        }

        public UserResearchInterestId(Integer userId, Integer researchInterestId) {
            this.userId = userId;
            this.researchInterestId = researchInterestId;
        }

        public Integer getUserId() {
            return userId;
        }

        public void setUserId(Integer userId) {
            this.userId = userId;
        }

        public Integer getResearchInterestId() {
            return researchInterestId;
        }

        public void setResearchInterestId(Integer researchInterestId) {
            this.researchInterestId = researchInterestId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) {
                return true;
            }
            if (o == null || getClass() != o.getClass()) {
                return false;
            }
            UserResearchInterestId that = (UserResearchInterestId) o;
            return Objects.equals(userId, that.userId)
                    && Objects.equals(researchInterestId, that.researchInterestId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(userId, researchInterestId);
        }
    }
}
