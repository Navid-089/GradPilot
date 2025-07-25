package com.gradpilot.repository;

import com.gradpilot.model.Conversation;
import com.gradpilot.model.User;
import com.gradpilot.model.Mentor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Integer> {
    Optional<Conversation> findByUserAndMentor(User user, Mentor mentor);

    List<Conversation> findByUserOrderByCreatedAtDesc(User user);

    Optional<Conversation> findFirstByUserAndMentorOrderByCreatedAtDesc(User user, Mentor mentor);

    List<Conversation> findByMentorOrderByCreatedAtDesc(Mentor mentor);
}