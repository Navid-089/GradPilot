package com.gradpilot.recommendation.repository;

import com.gradpilot.recommendation.model.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ScholarshipRepository extends JpaRepository<Scholarship, Integer> {
    
    // Fetch scholarships with university data eagerly loaded
    @Query("SELECT s FROM Scholarship s LEFT JOIN FETCH s.university")
    List<Scholarship> findAllWithUniversity();
}