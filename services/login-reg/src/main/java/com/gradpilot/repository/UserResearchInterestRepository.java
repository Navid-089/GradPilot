package com.gradpilot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gradpilot.model.UserResearchInterest;
import com.gradpilot.model.UserResearchInterest.UserResearchInterestId;

@Repository
public interface UserResearchInterestRepository extends JpaRepository<UserResearchInterest, UserResearchInterestId> {

    List<UserResearchInterest> findByUserId(Integer userId);

    void deleteByUserId(Integer userId);
}
