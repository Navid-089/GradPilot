package com.gradpilot.recommendation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "universities")
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "university_id")
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "email")
    private String email;

    @Column(name = "ranking")
    private Integer ranking;

    @Column(name = "address")
    private String address;

    @Column(name = "website_url")
    private String websiteUrl;

    // Constructors
    public University() {
    }

    public University(String name, String description, String email, Integer ranking, String address, String websiteUrl) {
        this.name = name;
        this.description = description;
        this.email = email;
        this.ranking = ranking;
        this.address = address;
        this.websiteUrl = websiteUrl;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getEmail() {
        return email;
    }

    public Integer getRanking() {
        return ranking;
    }

    public String getAddress() {
        return address;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }
}
