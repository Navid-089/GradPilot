package com.gradpilot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gradpilot.model.UserResearchInterest;

@Repository
public interface UserResearchInterestRepository extends JpaRepository<UserResearchInterest, Integer> {
}
