package com.gradpilot.recommendation.repository;

import com.gradpilot.recommendation.model.Professor;
import com.gradpilot.recommendation.model.ResearchInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProfessorRepository extends JpaRepository<Professor, Integer> {
    List<Professor> findByResearchInterestsIn(List<ResearchInterest> interests);
  
    @Query(value = """
    SELECT DISTINCT p.* FROM professors p
    LEFT JOIN professor_research_areas pra ON p.professor_id = pra.professor_id
    WHERE pra.research_interest_id IN (
        SELECT research_interest_id FROM user_research_interests WHERE user_id = :userId
    )
""", nativeQuery = true)
List<Professor> findProfessorsMatchingUserInterests(@Param("userId") Integer userId);

}

