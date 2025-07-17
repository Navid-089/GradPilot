package com.gradpilot.repository;

import com.gradpilot.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {

    @Query("SELECT l FROM Like l WHERE l.userId = :userId AND l.post.id = :postId")
    Optional<Like> findByUserIdAndPostId(@Param("userId") Integer userId, @Param("postId") Integer postId);

    @Query("SELECT l FROM Like l WHERE l.userId = :userId AND l.comment.id = :commentId")
    Optional<Like> findByUserIdAndCommentId(@Param("userId") Integer userId, @Param("commentId") Integer commentId);

    @Query("SELECT COUNT(l) FROM Like l WHERE l.post.id = :postId AND l.isLike = true")
    long countLikesByPostId(@Param("postId") Integer postId);

    @Query("SELECT COUNT(l) FROM Like l WHERE l.post.id = :postId AND l.isLike = false")
    long countDislikesByPostId(@Param("postId") Integer postId);

    @Query("SELECT COUNT(l) FROM Like l WHERE l.comment.id = :commentId AND l.isLike = true")
    long countLikesByCommentId(@Param("commentId") Integer commentId);

    @Query("SELECT COUNT(l) FROM Like l WHERE l.comment.id = :commentId AND l.isLike = false")
    long countDislikesByCommentId(@Param("commentId") Integer commentId);

    @Query("SELECT COUNT(l) FROM Like l WHERE l.post.id = :postId")
    long countByPostId(@Param("postId") Integer postId);

    @Query("SELECT COUNT(l) FROM Like l WHERE l.comment.id = :commentId")
    long countByCommentId(@Param("commentId") Integer commentId);
}
