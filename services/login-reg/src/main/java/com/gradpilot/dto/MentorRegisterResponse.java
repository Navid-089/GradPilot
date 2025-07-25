package com.gradpilot.dto;

public class MentorRegisterResponse {

    private String message;
    private MentorInfo mentor;
    private String token;

    // Constructors
    public MentorRegisterResponse() {
    }

    public MentorRegisterResponse(String message, MentorInfo mentor, String token) {
        this.message = message;
        this.mentor = mentor;
        this.token = token;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public MentorInfo getMentor() {
        return mentor;
    }

    public void setMentor(MentorInfo mentor) {
        this.mentor = mentor;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    // Inner class for mentor info
    public static class MentorInfo {
        private String mentorId;
        private String name;
        private String email;

        public MentorInfo() {
        }

        public MentorInfo(String mentorId, String name, String email) {
            this.mentorId = mentorId;
            this.name = name;
            this.email = email;
        }

        // Getters and Setters
        public String getMentorId() {
            return mentorId;
        }

        public void setMentorId(String mentorId) {
            this.mentorId = mentorId;
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
