package com.gradpilot.repository;

import com.gradpilot.model.MentorRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorRatingRepository extends JpaRepository<MentorRating, Integer> {

    List<MentorRating> findByMentor_Id(Integer mentorId);

    List<MentorRating> findByUser_UserId(Integer userId);

}
