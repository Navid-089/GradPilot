package com.gradpilot.dto;

public class MentorProfileUpdateRequest {
    private String name;
    private String bio;
    private String linkedin;
    private Integer universityId;
    private Integer fieldStudyId;
    private Integer countryId;
    private String gender;
    private String email;

    public MentorProfileUpdateRequest() {}

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }
    public Integer getUniversityId() { return universityId; }
    public void setUniversityId(Integer universityId) { this.universityId = universityId; }
    public Integer getFieldStudyId() { return fieldStudyId; }
    public void setFieldStudyId(Integer fieldStudyId) { this.fieldStudyId = fieldStudyId; }
    public Integer getCountryId() { return countryId; }
    public void setCountryId(Integer countryId) { this.countryId = countryId; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
