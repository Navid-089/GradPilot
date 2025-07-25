package com.gradpilot.repository;

import com.gradpilot.model.FieldOfStudy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FieldOfStudyRepository extends JpaRepository<FieldOfStudy, Integer> {
}
