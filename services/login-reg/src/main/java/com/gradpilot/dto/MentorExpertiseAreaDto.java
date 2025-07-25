package com.gradpilot.dto;

public class MentorExpertiseAreaDto {
    private Integer id;
    private Integer mentorId;
    private Integer expertiseAreaId;

    public MentorExpertiseAreaDto() {
    }

    public MentorExpertiseAreaDto(Integer id, Integer mentorId, Integer expertiseAreaId) {
        this.id = id;
        this.mentorId = mentorId;
        this.expertiseAreaId = expertiseAreaId;
    }

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getMentorId() {
        return mentorId;
    }

    public void setMentorId(Integer mentorId) {
        this.mentorId = mentorId;
    }

    public Integer getExpertiseAreaId() {
        return expertiseAreaId;
    }

    public void setExpertiseAreaId(Integer expertiseAreaId) {
        this.expertiseAreaId = expertiseAreaId;
    }
}
