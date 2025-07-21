package com.gradpilot.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UserProfileUpdate {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Please provide a valid email")
    private String email;

    private BigDecimal gpa;
    private Integer deadlineYear;

    @Pattern(regexp = "^(male|female|other)?$", message = "Gender must be 'male', 'female', 'other', or empty")
    private String gender;

    // Test scores like GRE, IELTS, etc.
    private Map<String, Object> testScores;

    // Target countries for study (IDs)
    private List<Integer> targetCountries;

    // Target majors (IDs)
    private List<Integer> targetMajors;

    // Research interests (IDs)
    private List<Integer> researchInterests;

    // Constructors
    public UserProfileUpdate() {
    }

    // Getters and setters
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

    public BigDecimal getGpa() {
        return gpa;
    }

    public void setGpa(BigDecimal gpa) {
        this.gpa = gpa;
    }

    public Integer getDeadlineYear() {
        return deadlineYear;
    }

    public void setDeadlineYear(Integer deadlineYear) {
        this.deadlineYear = deadlineYear;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Map<String, Object> getTestScores() {
        return testScores;
    }

    public void setTestScores(Map<String, Object> testScores) {
        this.testScores = testScores;
    }

    public List<Integer> getTargetCountries() {
        return targetCountries;
    }

    public void setTargetCountries(List<Integer> targetCountries) {
        this.targetCountries = targetCountries;
    }

    public List<Integer> getTargetMajors() {
        return targetMajors;
    }

    public void setTargetMajors(List<Integer> targetMajors) {
        this.targetMajors = targetMajors;
    }

    public List<Integer> getResearchInterests() {
        return researchInterests;
    }

    public void setResearchInterests(List<Integer> researchInterests) {
        this.researchInterests = researchInterests;
    }
}
