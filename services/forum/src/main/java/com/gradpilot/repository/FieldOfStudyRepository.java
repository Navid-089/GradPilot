package com.gradpilot.repository;

import com.gradpilot.model.FieldOfStudy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FieldOfStudyRepository extends JpaRepository<FieldOfStudy, Integer> {
    // Add custom queries if needed
}
