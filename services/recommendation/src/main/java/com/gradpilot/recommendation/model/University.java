package com.gradpilot.recommendation.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "universities")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "university_id")
    private Integer id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "email")
    private String email;

    @Column(name = "ranking")
    private Integer ranking;

    @Column(name = "tuition_fees")
    private Double tuitionFees;

    @Column(name = "country")
    private String country;

    @Column(name = "address")
    private String address;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "location_url")
    private String locationUrl;

    @Column(name = "deadline") 
    private LocalDate deadline;

    // Constructors
    public University() {
    }

    public University(String name, String description, String email, Integer ranking, Double tuitionFees, String country, String address, String websiteUrl) {
        this.name = name;
        this.description = description;
        this.email = email;
        this.ranking = ranking;
        this.tuitionFees = tuitionFees;
        this.country = country;
        this.address = address;
        this.websiteUrl = websiteUrl;
    }

    public University(String name, String description, String email, Integer ranking, Double tuitionFees, String country, String address, String websiteUrl, String locationUrl) {
        this.name = name;
        this.description = description;
        this.email = email;
        this.ranking = ranking;
        this.tuitionFees = tuitionFees;
        this.country = country;
        this.address = address;
        this.websiteUrl = websiteUrl;
        this.locationUrl = locationUrl;
    }

    public University(String name, String description, String email, Integer ranking, Double tuitionFees, String country, String address, String websiteUrl, String locationUrl, LocalDate deadline) {
    this.name = name;
    this.description = description;
    this.email = email;
    this.ranking = ranking;
    this.tuitionFees = tuitionFees;
    this.country = country;
    this.address = address;
    this.websiteUrl = websiteUrl;
    this.locationUrl = locationUrl;
    this.deadline = deadline; // ✅ include this
}


    // Getters
    public Integer getId() {
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

    public Double getTuitionFees() {
        return tuitionFees;
    }

    public String getCountry() {
        return country;
    }

    public String getAddress() {
        return address;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public String getLocationUrl() {
        return locationUrl;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    // Setters
    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRanking(Integer ranking) {
        this.ranking = ranking;
    }

    public void setTuitionFees(Double tuitionFees) {
        this.tuitionFees = tuitionFees;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public void setLocationUrl(String locationUrl) {
        this.locationUrl = locationUrl;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }
}
