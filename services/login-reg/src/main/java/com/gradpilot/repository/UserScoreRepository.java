package com.gradpilot.repository;

import com.gradpilot.model.UserScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserScoreRepository extends JpaRepository<UserScore, Integer> {
    List<UserScore> findByUserId(Integer userId);
    void deleteByUserId(Integer userId);
}