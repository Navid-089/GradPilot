package com.gradpilot.dto;

import java.time.LocalDateTime;

public class ConversationDto {
    private Integer id;
    private LocalDateTime createdAt;
    private Integer userId;
    private Integer mentorId;
    private String userName;
    private String mentorName;
    private boolean readUser;
    private boolean readMentor;

    public ConversationDto() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getMentorId() {
        return mentorId;
    }

    public void setMentorId(Integer mentorId) {
        this.mentorId = mentorId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getMentorName() {
        return mentorName;
    }

    public void setMentorName(String mentorName) {
        this.mentorName = mentorName;
    }

    public boolean isReadUser() {
        return readUser;
    }

    public void setReadUser(boolean readUser) {
        this.readUser = readUser;
    }

    public boolean isReadMentor() {
        return readMentor;
    }

    public void setReadMentor(boolean readMentor) {
        this.readMentor = readMentor;
    }
}
