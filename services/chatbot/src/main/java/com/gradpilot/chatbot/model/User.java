// com.gradpilot.chatbot.model.User.java
package com.gradpilot.chatbot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @NotBlank(message = "Name is required")
    @Column(name = "name", nullable = false)
    private String name;

    private String bio;

    @Email(message = "Please provide a valid email")
    @NotBlank(message = "Email is required")
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Password is required")
    @Column(name = "bicrypted_pass", nullable = false)
    private String bicryptedPass;

    @Column(name = "cgpa", precision = 3, scale = 2)
    private BigDecimal cgpa;

    @Column(name = "cv")
    private String cv;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "apply_year")
    private Integer applyYear;

    // Getters
    public Integer getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getBio() {
        return bio;
    }

    public String getEmail() {
        return email;
    }

    public String getBicryptedPass() {
        return bicryptedPass;
    }

    public BigDecimal getCgpa() {
        return cgpa;
    }

    public String getCv() {
        return cv;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Integer getApplyYear() {
        return applyYear;
    }

    // Setters
    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setBicryptedPass(String bicryptedPass) {
        this.bicryptedPass = bicryptedPass;
    }

    public void setCgpa(BigDecimal cgpa) {
        this.cgpa = cgpa;
    }

    public void setCv(String cv) {
        this.cv = cv;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setApplyYear(Integer applyYear) {
        this.applyYear = applyYear;
    }
}
