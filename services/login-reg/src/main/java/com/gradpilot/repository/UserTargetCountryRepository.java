package com.gradpilot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gradpilot.model.UserTargetCountry;

@Repository
public interface UserTargetCountryRepository extends JpaRepository<UserTargetCountry, Integer> {
}
