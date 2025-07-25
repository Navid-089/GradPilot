package com.gradpilot.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class MentorLoginRequest {
    @Email(message = "Please provide a valid email address")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$", message = "Email format is invalid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    // Constructors
    public MentorLoginRequest() {
    }

    public MentorLoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
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
}
