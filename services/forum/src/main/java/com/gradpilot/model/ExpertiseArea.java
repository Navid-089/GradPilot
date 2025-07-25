package com.gradpilot.model;

import jakarta.persistence.*;

@Entity
@Table(name = "expertise_area", schema = "public")
public class ExpertiseArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name")
    private String name;

    // Constructors
    public ExpertiseArea() {
    }

    public ExpertiseArea(String name) {
        this.name = name;
    }

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
