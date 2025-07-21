package com.gradpilot.recommendation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "scholarships")
public class Scholarship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scholarship_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "university_id")
    private University university;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "apply_link")
    private String applyLink;

    @Column(name = "eligibility")
    private String eligibility;

    @Column(name = "coverage")
    private String coverage;

    @Column(name = "deadline")
    private String deadline;

    // Constructors
    public Scholarship() {
    }

    public Scholarship(String name, String description, String applyLink, String eligibility, String coverage, String deadline) {
        this.name = name;
        this.description = description;
        this.applyLink = applyLink;
        this.eligibility = eligibility;
        this.coverage = coverage;
        this.deadline = deadline;
    }

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public University getUniversity() {
        return university;
    }

    public void setUniversity(University university) {
        this.university = university;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getApplyLink() {
        return applyLink;
    }

    public void setApplyLink(String applyLink) {
        this.applyLink = applyLink;
    }

    public String getEligibility() {
        return eligibility;
    }

    public void setEligibility(String eligibility) {
        this.eligibility = eligibility;
    }

    public String getCoverage() {
        return coverage;
    }

    public void setCoverage(String coverage) {
        this.coverage = coverage;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }
}
