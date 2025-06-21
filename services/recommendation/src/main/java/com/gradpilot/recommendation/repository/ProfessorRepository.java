package com.gradpilot.recommendation.repository;

import com.gradpilot.recommendation.model.Professor;
import com.gradpilot.recommendation.model.ResearchInterest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    List<Professor> findByResearchInterestsIn(List<ResearchInterest> interests);
}