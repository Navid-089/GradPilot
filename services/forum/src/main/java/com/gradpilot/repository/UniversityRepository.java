package com.gradpilot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gradpilot.model.University;

public interface UniversityRepository extends JpaRepository<University, Integer> {
    // Add custom queries if needed

}
