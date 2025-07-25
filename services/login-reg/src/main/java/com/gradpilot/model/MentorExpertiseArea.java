package com.gradpilot.model;

import jakarta.persistence.*;

@Entity
@Table(name = "mentor_expertise_area", schema = "public")
public class MentorExpertiseArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    // Many-to-one to Mentor
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", referencedColumnName = "id")
    private Mentor mentor;

    // Many-to-one to ExpertiseArea
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id", referencedColumnName = "id")
    private ExpertiseArea expertiseArea;

    // Constructors
    public MentorExpertiseArea() {}

    public MentorExpertiseArea(Mentor mentor, ExpertiseArea expertiseArea) {
        this.mentor = mentor;
        this.expertiseArea = expertiseArea;
    }

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Mentor getMentor() {
        return mentor;
    }

    public void setMentor(Mentor mentor) {
        this.mentor = mentor;
    }

    public ExpertiseArea getExpertiseArea() {
        return expertiseArea;
    }

    public void setExpertiseArea(ExpertiseArea expertiseArea) {
        this.expertiseArea = expertiseArea;
    }
}
