package com.gradpilot.dto;

public class UpdateProfileResponse {

    private String message;
    private UserInfo user;
    private String token;

    // Constructors
    public UpdateProfileResponse() {
    }

    public UpdateProfileResponse(String message, UserInfo user) {
        this.message = message;
        this.user = user;
        // this.token = token;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    // Inner class for user info
    public static class UserInfo {
        private String userId;
        private String name;
        private String email;

        public UserInfo() {
        }

        public UserInfo(String userId, String name, String email) {
            this.userId = userId;
            this.name = name;
            this.email = email;
        }

        // Getters and Setters
        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
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
    }
}