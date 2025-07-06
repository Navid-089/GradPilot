package com.gradpilot.recommendation.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "professors")
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

    public List<ResearchInterest> getResearchInterests() {
        return researchInterests;
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
}
