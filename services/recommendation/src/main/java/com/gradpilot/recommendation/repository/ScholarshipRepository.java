package com.gradpilot.recommendation.repository;

import com.gradpilot.recommendation.model.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScholarshipRepository extends JpaRepository<Scholarship, Integer> {
}