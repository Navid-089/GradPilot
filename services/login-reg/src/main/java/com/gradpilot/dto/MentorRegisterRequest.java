package com.gradpilot.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

public class MentorRegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$", message = "Email format is invalid. Domain must be lowercase and properly formatted.")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    private Integer universityId;
    private Integer fieldStudyId;
    private Integer countryId;
    private String bio;
    private String linkedin;
    private List<Integer> expertiseAreaIds;
    
    @Pattern(regexp = "^(male|female|other)?$", message = "Gender must be male, female, or other")
    private String gender;

    // Constructors
    public MentorRegisterRequest() {
    }

    // Getters and Setters

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public List<Integer> getExpertiseAreaIds() {
        return expertiseAreaIds;
    }

    public void setExpertiseAreaIds(List<Integer> expertiseAreaIds) {
        this.expertiseAreaIds = expertiseAreaIds;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
}
