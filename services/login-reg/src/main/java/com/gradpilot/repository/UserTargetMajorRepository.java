package com.gradpilot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gradpilot.model.UserTargetMajor;

@Repository
public interface UserTargetMajorRepository extends JpaRepository<UserTargetMajor, Integer> {

    List<UserTargetMajor> findByUserId(Integer userId);

    void deleteByUserId(Integer userId);
}
