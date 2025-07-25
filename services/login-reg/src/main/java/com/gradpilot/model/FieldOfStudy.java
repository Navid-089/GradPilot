package com.gradpilot.model;

import jakarta.persistence.*;

@Entity
@Table(name = "fields_of_study", schema = "public", uniqueConstraints = {
        @UniqueConstraint(name = "fields_of_study_name_key", columnNames = "name")
})
public class FieldOfStudy {

    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    // Constructors
    public FieldOfStudy() {
    }

    public FieldOfStudy(Integer id, String name) {
        this.id = id;
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
