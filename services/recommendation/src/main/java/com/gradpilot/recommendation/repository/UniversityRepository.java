package com.gradpilot.recommendation.repository;

import com.gradpilot.recommendation.model.University;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UniversityRepository extends JpaRepository<University, Long> {
}