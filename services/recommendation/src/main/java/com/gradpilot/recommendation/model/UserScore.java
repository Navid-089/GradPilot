package com.gradpilot.recommendation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_scores")
public class UserScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "test_name", nullable = false, length = 32)
    private String testName;

    @Column(name = "score", nullable = false, length = 32)
    private String score;

    // Constructors
    public UserScore() {}

    public UserScore(Integer userId, String testName, String score) {
        this.userId = userId;
        this.testName = testName;
        this.score = score;
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

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }
}
