package com.gradpilot.dto;

public class MentorDto {

    private Integer id;
    private String name;
    private String email;
    // private String expertise;
    private String bio;
    private Boolean isVerified;
    private String linkedin;
    private String universityName;
    private String fieldOfStudyName;

    // Constructors
    public MentorDto() {
    }

    public MentorDto(Integer id, String name, String email, String bio, Boolean isVerified,
            String linkedin, String universityName, String fieldOfStudyName) {
        this.id = id;
        this.name = name;
        this.email = email;
        // this.expertise = expertise;
        this.bio = bio;
        this.isVerified = isVerified;
        this.linkedin = linkedin;
        this.universityName = universityName;
        this.fieldOfStudyName = fieldOfStudyName;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // public String getExpertise() {
    // return expertise;
    // }

    // public void setExpertise(String expertise) {
    // this.expertise = expertise;
    // }

    public String getUniversityName() {
        return universityName;
    }

    public void setUniversityName(String universityName) {
        this.universityName = universityName;
    }

    public String getFieldOfStudyName() {
        return fieldOfStudyName;
    }

    public void setFieldOfStudyName(String fieldOfStudyName) {
        this.fieldOfStudyName = fieldOfStudyName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }
}
