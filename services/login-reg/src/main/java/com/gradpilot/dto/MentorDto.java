package com.gradpilot.dto;

import java.time.LocalDateTime;

public class MentorDto {
    private Integer id;
    private LocalDateTime createdAt;
    private Integer universityId;
    private Integer fieldStudyId;
    private Boolean isVerified;
    private Integer countryId;
    private String bio;
    private String linkedin;
    private String gender;

    public MentorDto() {
    }

    public MentorDto(Integer id, LocalDateTime createdAt, Integer universityId, Integer fieldStudyId,
            Boolean isVerified, Integer countryId, String bio, String linkedin, String gender) {
        this.id = id;
        this.createdAt = createdAt;
        this.universityId = universityId;
        this.fieldStudyId = fieldStudyId;
        this.isVerified = isVerified;
        this.countryId = countryId;
        this.bio = bio;
        this.linkedin = linkedin;
        this.gender = gender;
    }

    // Getters and Setters
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

    public Integer getUniversityId() {
        return universityId;
    }

    public void setUniversityId(Integer universityId) {
        this.universityId = universityId;
    }

    public Integer getFieldStudyId() {
        return fieldStudyId;
    }

    public void setFieldStudyId(Integer fieldStudyId) {
        this.fieldStudyId = fieldStudyId;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Integer getCountryId() {
        return countryId;
    }

    public void setCountryId(Integer countryId) {
        this.countryId = countryId;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
}
