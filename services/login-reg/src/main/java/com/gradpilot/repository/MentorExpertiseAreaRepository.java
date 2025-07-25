package com.gradpilot.repository;

import com.gradpilot.model.MentorExpertiseArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorExpertiseAreaRepository extends JpaRepository<MentorExpertiseArea, Integer> {
    // Optional: find all expertise areas for a mentor
    List<MentorExpertiseArea> findByMentorId(Integer mentorId);

    // Optional: find all mentors for an expertise area
    List<MentorExpertiseArea> findByExpertiseAreaId(Integer expertiseAreaId);
}
