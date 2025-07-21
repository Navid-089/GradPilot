package com.gradpilot.recommendation.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "professor_papers")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProfessorPaper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "professor_id", nullable = false)
    private Integer professorId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "url")
    private String url;

    // Constructors
    public ProfessorPaper() {}

    public ProfessorPaper(Integer professorId, String title, String url) {
        this.professorId = professorId;
        this.title = title;
        this.url = url;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getProfessorId() {
        return professorId;
    }

    public void setProfessorId(Integer professorId) {
        this.professorId = professorId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
