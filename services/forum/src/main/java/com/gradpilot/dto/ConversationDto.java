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

    // Add mentor profile fields
    private String mentorBio;
    private String mentorUniversityName;
    private String mentorFieldOfStudyName;
    private String mentorGender;
    private String mentorLinkedin;
    private Boolean mentorIsVerified;

    private String lastMessage;
    private LocalDateTime lastMessageTime;

    private String userGender;

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

    // Add new getters and setters

    public String getMentorBio() {
        return mentorBio;
    }

    public void setMentorBio(String mentorBio) {
        this.mentorBio = mentorBio;
    }

    public String getMentorUniversityName() {
        return mentorUniversityName;
    }

    public void setMentorUniversityName(String mentorUniversityName) {
        this.mentorUniversityName = mentorUniversityName;
    }

    public String getMentorFieldOfStudyName() {
        return mentorFieldOfStudyName;
    }

    public void setMentorFieldOfStudyName(String mentorFieldOfStudyName) {
        this.mentorFieldOfStudyName = mentorFieldOfStudyName;
    }

    public String getMentorLinkedin() {
        return mentorLinkedin;
    }

    public void setMentorLinkedin(String mentorLinkedin) {
        this.mentorLinkedin = mentorLinkedin;
    }

    public Boolean getMentorIsVerified() {
        return mentorIsVerified;
    }

    public void setMentorIsVerified(Boolean mentorIsVerified) {
        this.mentorIsVerified = mentorIsVerified;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public LocalDateTime getLastMessageTime() {
        return lastMessageTime;
    }

    public void setLastMessageTime(LocalDateTime lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }

    public String getMentorGender() {
        return mentorGender;
    }

    public void setMentorGender(String mentorGender) {
        this.mentorGender = mentorGender;
    }

    public String getUserGender() {
        return userGender;
    }

    public void setUserGender(String userGender) {
        this.userGender = userGender;
    }
}
