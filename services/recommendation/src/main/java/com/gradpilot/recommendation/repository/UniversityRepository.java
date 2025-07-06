package com.gradpilot.recommendation.repository;

import com.gradpilot.recommendation.model.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UniversityRepository extends JpaRepository<University, Integer> {
    
    Optional<University> findByName(String name);
    
    @Query("SELECT u FROM University u WHERE u.name IN :names")
    List<University> findByNameIn(@Param("names") List<String> names);
}