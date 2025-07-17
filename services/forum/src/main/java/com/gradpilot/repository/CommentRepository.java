package com.gradpilot.repository;

import com.gradpilot.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {

    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId ORDER BY c.createdAt ASC")
    List<Comment> findByPostIdOrderByCreatedAtAsc(@Param("postId") Integer postId);

    @Query("SELECT c FROM Comment c WHERE c.userId = :userId ORDER BY c.createdAt DESC")
    List<Comment> findByUserId(@Param("userId") Integer userId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId")
    int countByPostId(@Param("postId") Integer postId);
}
