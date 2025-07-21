package com.gradpilot.recommendation.repository;

import com.gradpilot.recommendation.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    
    // Find all tasks for a specific user
    List<Task> findByUser_UserIdOrderByCreatedAtDesc(Integer userId);
    
    // Find tasks by user and task type
    List<Task> findByUser_UserIdAndTaskTypeOrderByCreatedAtDesc(Integer userId, Task.TaskType taskType);
    
    // Check if a specific item is already saved by the user
    @Query("SELECT COUNT(t) > 0 FROM Task t WHERE t.user.userId = :userId AND t.taskType = :taskType AND " +
           "(:universityId IS NOT NULL AND t.universityId = :universityId OR " +
           ":professorId IS NOT NULL AND t.professorId = :professorId OR " +
           ":scholarshipId IS NOT NULL AND t.scholarshipId = :scholarshipId)")
    boolean existsByUserAndItem(@Param("userId") Integer userId, 
                               @Param("taskType") Task.TaskType taskType,
                               @Param("universityId") Integer universityId,
                               @Param("professorId") Integer professorId,
                               @Param("scholarshipId") Integer scholarshipId);
    
    // Delete a specific task
    @Modifying
    @Query("DELETE FROM Task t WHERE t.user.userId = :userId AND t.taskType = :taskType AND " +
           "(:universityId IS NOT NULL AND t.universityId = :universityId OR " +
           ":professorId IS NOT NULL AND t.professorId = :professorId OR " +
           ":scholarshipId IS NOT NULL AND t.scholarshipId = :scholarshipId)")
    void deleteByUserAndItem(@Param("userId") Integer userId, 
                           @Param("taskType") Task.TaskType taskType,
                           @Param("universityId") Integer universityId,
                           @Param("professorId") Integer professorId,
                           @Param("scholarshipId") Integer scholarshipId);
} 