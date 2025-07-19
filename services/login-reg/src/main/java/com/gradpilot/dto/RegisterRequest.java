package com.gradpilot.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    // Gender (optional)
    private String gender;

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Email(message = "Please provide a valid email address")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$", message = "Email format is invalid. Domain must be lowercase and properly formatted.")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @DecimalMin(value = "0.0", message = "GPA must be positive")
    @DecimalMax(value = "4.0", message = "GPA cannot exceed 4.0")
    private BigDecimal gpa;

    // Test scores like GRE, IELTS, etc.
    private Map<String, Object> testScores;

    // Target countries for study (IDs)
    private List<Integer> targetCountries;

    // Target majors (IDs)
    private List<Integer> targetMajors;

    // Research interests (IDs)
    private List<Integer> researchInterests;

    @Min(value = 2024, message = "Deadline year must be current year or future")
    @Max(value = 2030, message = "Deadline year cannot be too far in future")
    private Integer deadlineYear;

    // Constructors
    public RegisterRequest() {
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

    public BigDecimal getGpa() {
        return gpa;
    }

    public void setGpa(BigDecimal gpa) {
        this.gpa = gpa;
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

    public Integer getDeadlineYear() {
        return deadlineYear;
    }

    public void setDeadlineYear(Integer deadlineYear) {
        this.deadlineYear = deadlineYear;
    }
}
