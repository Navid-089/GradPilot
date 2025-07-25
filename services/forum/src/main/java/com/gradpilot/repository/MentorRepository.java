package com.gradpilot.repository;

import com.gradpilot.model.Mentor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorRepository extends JpaRepository<Mentor, Integer> {
    // Add custom queries if needed
}