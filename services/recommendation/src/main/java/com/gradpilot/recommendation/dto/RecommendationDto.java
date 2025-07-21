package com.gradpilot.recommendation.dto;

public class RecommendationDto {
    private String university;
    private String professor;
    private int matchScore;
    private String universityWebsite;

    public String getUniversity() {
        return university;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public String getProfessor() {
        return professor;
    }

    public String getUniversityWebsite() {
        return universityWebsite;
    }

    public RecommendationDto(String university, String professor, int matchScore, String universityWebsite) {
        this.university = university;
        this.professor = professor;
        this.matchScore = matchScore;
        this.universityWebsite = universityWebsite;
    }
}