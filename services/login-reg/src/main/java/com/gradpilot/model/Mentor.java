package com.gradpilot.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "mentors", schema = "public")
public class Mentor implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "created_at", nullable = false, columnDefinition = "timestamp with time zone default now()")
    private OffsetDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", referencedColumnName = "university_id", foreignKey = @ForeignKey(name = "mentors_university_id_fkey"))
    private University university;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_study_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "mentors_field_study_id_fkey"))
    private FieldOfStudy fieldOfStudy;

    @Column(name = "is_verified", nullable = true)
    private Boolean isVerified = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "mentors_country_id_fkey"))
    private Country country;

    @Column(name = "bio", columnDefinition = "text")
    private String bio;

    @Column(name = "linkedin", columnDefinition = "text")
    private String linkedin;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "bicrypted_pass", nullable = false)
    private String bicryptedPass;

    @Column(name = "gender", columnDefinition = "text")
    private String gender;

    // Constructors
    public Mentor() {
        this.createdAt = OffsetDateTime.now();
        this.isVerified = false;
    }

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public University getUniversity() {
        return university;
    }

    public void setUniversity(University university) {
        this.university = university;
    }

    public FieldOfStudy getFieldOfStudy() {
        return fieldOfStudy;
    }

    public void setFieldOfStudy(FieldOfStudy fieldOfStudy) {
        this.fieldOfStudy = fieldOfStudy;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBicryptedPass() {
        return bicryptedPass;
    }

    public void setBicryptedPass(String bicryptedPass) {
        this.bicryptedPass = bicryptedPass;
    }

    // UserDetails interface methods
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return bicryptedPass;
    }

    @Override
    public String getUsername() {
        return email; // Using email as username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
}
