package com.gradpilot.repository;

import com.gradpilot.model.ResearchInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResearchInterestRepository extends JpaRepository<ResearchInterest, Integer> {
    Optional<ResearchInterest> findByName(String name);
}