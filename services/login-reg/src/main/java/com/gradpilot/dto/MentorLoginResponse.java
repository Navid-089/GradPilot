package com.gradpilot.dto;

public class MentorLoginResponse {

    private String token;
    private MentorInfo mentor;

    // Constructors
    public MentorLoginResponse() {
    }

    public MentorLoginResponse(String token, MentorInfo mentor) {
        this.token = token;
        this.mentor = mentor;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public MentorInfo getMentor() {
        return mentor;
    }

    public void setMentor(MentorInfo mentor) {
        this.mentor = mentor;
    }

    // Inner class for mentor info
    public static class MentorInfo {
        private String mentorId;
        private String name;
        private String email;
        private Boolean isVerified;
        private String gender;

        public MentorInfo() {
        }

        public MentorInfo(String mentorId, String name, String email, Boolean isVerified, String gender) {
            this.mentorId = mentorId;
            this.name = name;
            this.email = email;
            this.isVerified = isVerified;
            this.gender = gender;
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

        public Boolean getIsVerified() {
            return isVerified;
        }

        public void setIsVerified(Boolean isVerified) {
            this.isVerified = isVerified;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }
    }
}
