package com.gradpilot.recommendation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "research_interests")
public class ResearchInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    // Constructors
    public ResearchInterest() {
    }

    public ResearchInterest(String name) {
        this.name = name;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
