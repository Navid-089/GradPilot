package com.gradpilot.repository;

import com.gradpilot.model.Conversation;
import com.gradpilot.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByConversationId(Integer convoId);

    List<Message> findByUser_UserId(Integer userId);

    List<Message> findByMentor_Id(Integer mentorId);

    List<Message> findByConversationOrderBySentAtAsc(Conversation conversation);
}
