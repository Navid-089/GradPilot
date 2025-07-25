package com.gradpilot.model;

import jakarta.persistence.*;

@Entity
@Table(name = "universities", schema = "public", uniqueConstraints = {
        @UniqueConstraint(name = "unique_university_name", columnNames = "name"),
        @UniqueConstraint(name = "universities_name_key", columnNames = "name")
})
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "university_id")
    private Integer universityId;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "email", length = 120)
    private String email;

    @Column(name = "ranking")
    private Integer ranking;

    @Column(name = "address", columnDefinition = "text")
    private String address;

    @Column(name = "website_url", length = 255)
    private String websiteUrl;

    @Column(name = "tuition_fees")
    private Double tuitionFees;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "location_url", columnDefinition = "text")
    private String locationUrl;

    // Constructors
    public University() {
    }

    // Getters and setters

    public Integer getUniversityId() {
        return universityId;
    }

    public void setUniversityId(Integer universityId) {
        this.universityId = universityId;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getRanking() {
        return ranking;
    }

    public void setRanking(Integer ranking) {
        this.ranking = ranking;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public Double getTuitionFees() {
        return tuitionFees;
    }

    public void setTuitionFees(Double tuitionFees) {
        this.tuitionFees = tuitionFees;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getLocationUrl() {
        return locationUrl;
    }

    public void setLocationUrl(String locationUrl) {
        this.locationUrl = locationUrl;
    }
}
