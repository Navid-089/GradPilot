package com.gradpilot.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gradpilot.model.MentorPasswordResetToken;
import com.gradpilot.model.Mentor;

@Repository
public interface MentorPasswordResetTokenRepository extends JpaRepository<MentorPasswordResetToken, Long> {

    Optional<MentorPasswordResetToken> findByToken(String token);

    Optional<MentorPasswordResetToken> findByTokenAndUsedFalse(String token);

    @Query("SELECT mprt FROM MentorPasswordResetToken mprt WHERE mprt.mentor = :mentor AND mprt.used = false ORDER BY mprt.createdAt DESC")
    Optional<MentorPasswordResetToken> findLatestUnusedTokenByMentor(@Param("mentor") Mentor mentor);

    @Modifying
    @Transactional
    @Query("DELETE FROM MentorPasswordResetToken mprt WHERE mprt.expiryDate < :currentTime")
    void deleteExpiredTokens(@Param("currentTime") LocalDateTime currentTime);

    @Modifying
    @Transactional
    @Query("UPDATE MentorPasswordResetToken mprt SET mprt.used = true WHERE mprt.mentor = :mentor AND mprt.used = false")
    void markAllMentorTokensAsUsed(@Param("mentor") Mentor mentor);
}