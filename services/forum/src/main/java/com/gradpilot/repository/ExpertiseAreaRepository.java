package com.gradpilot.repository;

import com.gradpilot.model.ExpertiseArea;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpertiseAreaRepository extends JpaRepository<ExpertiseArea, Integer> {
    // Add custom queries if needed

}
