package com.gradpilot.recommendation.dto;

import java.time.LocalDate;
import java.util.Random;

public class UniversityRecommendationDto {
    private Integer id;
    private String name;
    private String description;
    private String email;
    private Integer ranking;
    private Double tuitionFees;
    private String country;
    private String address;
    private String websiteUrl;
    private LocalDate applicationDeadline;
    private Double matchScore;

    public UniversityRecommendationDto() {
    }

    public UniversityRecommendationDto(Integer id, String name, String description, String email, Integer ranking, Double tuitionFees, String country, String address, String websiteUrl, Double matchScore) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.email = email;
        this.ranking = ranking;
        this.tuitionFees = tuitionFees;
        this.country = country;
        this.address = address;
        this.websiteUrl = websiteUrl;
        this.matchScore = matchScore;
        this.applicationDeadline = generateRandomDeadline();
    }

    private LocalDate generateRandomDeadline() {
        Random random = new Random();
        // Generate a random date within the next 2 months
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.plusMonths(1).withDayOfMonth(1);
        LocalDate endDate = startDate.plusMonths(2).withDayOfMonth(1).minusDays(1);
        
        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
        long randomDays = random.nextInt((int) daysBetween + 1);
        
        return startDate.plusDays(randomDays);
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

    public LocalDate getApplicationDeadline() {
        return applicationDeadline;
    }

    public Double getMatchScore() {
        return matchScore;
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

    public void setApplicationDeadline(LocalDate applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public void setMatchScore(Double matchScore) {
        this.matchScore = matchScore;
    }
} 