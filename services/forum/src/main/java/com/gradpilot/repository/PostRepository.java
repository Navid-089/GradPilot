package com.gradpilot.repository;

import com.gradpilot.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.tags t WHERE t.name = :tagName ORDER BY p.createdAt DESC")
    Page<Post> findByTagName(@Param("tagName") String tagName, Pageable pageable);

    // @Query("SELECT p FROM Post p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%',
    // :title, '%')) ORDER BY p.createdAt DESC")
    // Page<Post> findByTitleContainingIgnoreCase(@Param("title") String title,
    // Pageable pageable);
    @Query("SELECT p FROM Post p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY p.createdAt DESC")
    Page<Post> findByTitleOrMessageContainingIgnoreCase(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.userId = :userId ORDER BY p.createdAt DESC")
    Page<Post> findByUserId(@Param("userId") Integer userId, Pageable pageable);
}
