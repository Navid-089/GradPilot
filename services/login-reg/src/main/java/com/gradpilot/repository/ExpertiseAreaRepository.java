package com.gradpilot.repository;

import com.gradpilot.model.ExpertiseArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpertiseAreaRepository extends JpaRepository<ExpertiseArea, Integer> {
}
