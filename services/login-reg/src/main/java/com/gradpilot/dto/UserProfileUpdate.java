package com.gradpilot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import java.math.BigDecimal;

public class UserProfileUpdate {
    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Please provide a valid email")
    private String email;

    private BigDecimal cgpa;
    private Integer applyYear;

    // getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public BigDecimal getCgpa() { return cgpa; }
    public void setCgpa(BigDecimal cgpa) { this.cgpa = cgpa; }

    public Integer getApplyYear() { return applyYear; }
    public void setApplyYear(Integer applyYear) { this.applyYear = applyYear; }
}
