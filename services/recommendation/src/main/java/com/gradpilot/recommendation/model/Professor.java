package com.gradpilot.recommendation.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "professors")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "professor_id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "bio")
    private String bio;

    @Column(name = "department")
    private String department;

    @Column(name = "email")
    private String email;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "google_scholar_url")
    private String googleScholarUrl;

    @Column(name = "lab_link")
    private String labLink;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    private University university;

    @ManyToMany
    @JoinTable(name = "professor_research_areas", joinColumns = @JoinColumn(name = "professor_id"), inverseJoinColumns = @JoinColumn(name = "research_interest_id"))
    private List<ResearchInterest> researchInterests;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "professor_id")
    private List<ProfessorPaper> papers;

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getBio() {
        return bio;
    }

    public String getDepartment() {
        return department;
    }

    public String getEmail() {
        return email;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public String getGoogleScholarUrl() {
        return googleScholarUrl;
    }

    public String getLabLink() {
        return labLink;
    }

    public University getUniversity() {
        return university;
    }

    @JsonProperty("university")
    public String getUniversityName() {
        return university != null ? university.getName() : null;
    }

    public List<ResearchInterest> getResearchInterests() {
        return researchInterests;
    }

    @JsonProperty("researchAreas")
    public List<String> getResearchAreas() {
        return researchInterests != null ? 
            researchInterests.stream()
                .map(ResearchInterest::getName)
                .collect(Collectors.toList()) : 
            null;
    }

    @JsonProperty("recentPapers")
    public List<Object> getRecentPapers() {
        return papers != null ? 
            papers.stream()
                .map(paper -> {
                    java.util.Map<String, Object> paperMap = new java.util.HashMap<>();
                    paperMap.put("title", paper.getTitle());
                    paperMap.put("url", paper.getUrl());
                    return paperMap;
                })
                .collect(Collectors.toList()) : 
            List.of();
    }

    @JsonProperty("paperDetails")
    public List<ProfessorPaper> getPaperDetails() {
        return papers != null ? papers : List.of();
    }

    public void setUniversity(University university) {
        this.university = university;
    }

    public void setResearchInterests(List<ResearchInterest> researchInterests) {
        this.researchInterests = researchInterests;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public List<ProfessorPaper> getPapers() {
        return papers;
    }

    public void setPapers(List<ProfessorPaper> papers) {
        this.papers = papers;
    }
}
