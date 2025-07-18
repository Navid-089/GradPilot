package com.gradpilot.recommendation.repository;

import com.gradpilot.recommendation.model.Apply;
import com.gradpilot.recommendation.model.ApplyId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplyRepository extends JpaRepository<Apply, ApplyId> {
    
    // Find all applications by user ID
    List<Apply> findByUserIdOrderByCreatedAtDesc(Integer userId);
    
    // Find all applications for a specific scholarship
    List<Apply> findByScholarshipIdOrderByCreatedAtDesc(Integer scholarshipId);
    
    // Check if user has already applied to a scholarship
    boolean existsByUserIdAndScholarshipId(Integer userId, Integer scholarshipId);
    
    // Find specific application by user and scholarship
    Optional<Apply> findByUserIdAndScholarshipId(Integer userId, Integer scholarshipId);
    
    // Delete application by user and scholarship
    void deleteByUserIdAndScholarshipId(Integer userId, Integer scholarshipId);
    
    // Count total applications by user
    @Query("SELECT COUNT(a) FROM Apply a WHERE a.userId = :userId")
    long countApplicationsByUserId(@Param("userId") Integer userId);
    
    // Count total applications for a scholarship
    @Query("SELECT COUNT(a) FROM Apply a WHERE a.scholarshipId = :scholarshipId")
    long countApplicationsByScholarshipId(@Param("scholarshipId") Integer scholarshipId);
}
