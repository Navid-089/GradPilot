package com.gradpilot.recommendation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "countries")
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    // Constructors
    public Country() {
    }

    public Country(String name) {
        this.name = name;
    }

    // Getters
    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
