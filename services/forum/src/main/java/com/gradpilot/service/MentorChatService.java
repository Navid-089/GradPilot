package com.gradpilot.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gradpilot.dto.ConversationDto;
import com.gradpilot.dto.MessageDto;
import com.gradpilot.model.Conversation;
import com.gradpilot.model.Mentor;
import com.gradpilot.model.Message;
import com.gradpilot.model.User;
import com.gradpilot.repository.ConversationRepository;
import com.gradpilot.repository.MentorRepository;
import com.gradpilot.repository.MessageRepository;
import com.gradpilot.repository.UserRepository;

@Service
public class MentorChatService {
    @Autowired
    private ConversationRepository conversationRepo;
    @Autowired
    private MessageRepository messageRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private MentorRepository mentorRepo;

    public Conversation getOrCreateConversation(Integer userId, Integer mentorId) {
        User user = userRepo.findById(userId).orElseThrow();
        Mentor mentor = mentorRepo.findById(mentorId).orElseThrow();
        return conversationRepo.findByUserAndMentor(user, mentor)
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setUser(user);
                    c.setMentor(mentor);
                    return conversationRepo.save(c);
                });
    }

    public Message sendMessage(Integer convoId, Integer senderUserId, String text, String type) {
        Conversation convo = conversationRepo.findById(convoId).orElseThrow();
        Message msg = new Message();
        msg.setConversation(convo);
        msg.setMessage(text);
        msg.setMessageType(type != null ? type : "TEXT");
        msg.setSentAt(LocalDateTime.now());
        msg.setIsRead(false);
        msg.setMentor(mentorRepo.findById(senderUserId).orElseThrow());
        msg.setUser(conversationRepo.findById(convoId)
                .map(Conversation::getUser)
                .orElse(null));
        msg.setMentorSender(true);
        // set conversation's last message
        messageRepo.save(msg);
        convo.setLastMessageId(msg.getId());
        conversationRepo.save(convo);
        return msg;
    }

    // mark a conversation as read by user
    public void markConversationAsReadByMentor(Integer convoId) {
        Conversation conversation = conversationRepo.findById(convoId).orElseThrow();
        conversation.setReadMentor(true);
        conversationRepo.save(conversation);
    }

    public List<MessageDto> getMessages(Integer convoId) {
        Conversation convo = conversationRepo.findById(convoId).orElseThrow();
        List<Message> messages = messageRepo.findByConversationOrderBySentAtAsc(convo);
        return messages.stream().map(this::convertToDto).toList();
    }

    public List<ConversationDto> getUserConversations(Integer userId) {
        User user = userRepo.findById(userId).orElseThrow();
        List<Conversation> conversations = conversationRepo.findByUserOrderByCreatedAtDesc(user);

        return conversations.stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<ConversationDto> getMentorConversations(Integer mentorId) {
        Mentor mentor = mentorRepo.findById(mentorId).orElseThrow();
        List<Conversation> conversations = conversationRepo.findByMentorOrderByCreatedAtDesc(mentor);
        return conversations.stream()
                .map(this::convertToDto)
                .toList();
    }

    // Helper method to convert Conversation to ConversationDto
    private ConversationDto convertToDto(Conversation convo) {
        ConversationDto dto = new ConversationDto();
        dto.setId(convo.getId());
        dto.setCreatedAt(convo.getCreatedAt());
        dto.setUserId(convo.getUser().getUserId());
        dto.setMentorId(convo.getMentor().getId());
        dto.setUserName(convo.getUser().getName());
        dto.setMentorName(convo.getMentor().getName());
        dto.setReadUser(convo.isReadUser());
        dto.setReadMentor(convo.isReadMentor());
        dto.setMentorBio(convo.getMentor().getBio());
        dto.setMentorUniversityName(
                convo.getMentor().getUniversity() != null ? convo.getMentor().getUniversity().getName()
                        : "Unknown University");
        dto.setMentorFieldOfStudyName(
                convo.getMentor().getFieldOfStudy() != null ? convo.getMentor().getFieldOfStudy().getName()
                        : "Unknown Field");
        dto.setMentorGender(convo.getMentor().getGender() != null ? convo.getMentor().getGender() : "Unknown");
        dto.setMentorLinkedin(
                convo.getMentor().getLinkedin() != null ? convo.getMentor().getLinkedin() : "Not provided");
        dto.setMentorIsVerified(Boolean.TRUE.equals(convo.getMentor().getIsVerified()));
        dto.setUserGender(convo.getUser().getGender() != null ? convo.getUser().getGender() : "Unknown");
        dto.setLastMessage(convo.getLastMessageId() != null
                ? messageRepo.findById(convo.getLastMessageId()).map(Message::getMessage).orElse("No messages")
                : "No messages");
        dto.setLastMessageTime(convo.getLastMessageId() != null
                ? messageRepo.findById(convo.getLastMessageId()).map(Message::getSentAt).orElse(LocalDateTime.now())
                : LocalDateTime.now());
        return dto;
    }

    private MessageDto convertToDto(Message msg) {
        MessageDto dto = new MessageDto();
        dto.setId(msg.getId());
        dto.setSentAt(msg.getSentAt());
        dto.setMessage(msg.getMessage());
        dto.setMentorSender(msg.getMentorSender());
        User user = msg.getUser();
        Mentor mentor = msg.getMentor();
        if (Boolean.TRUE.equals(msg.getMentorSender())) {
            dto.setSenderName(mentor != null ? mentor.getName() : "Unknown Mentor");
            dto.setReceiverName(user != null ? user.getName() : "Unknown User");
            dto.setSenderGender(mentor != null ? mentor.getGender() : "Unknown");
            dto.setReceiverGender(user != null ? user.getGender() : "Unknown");
        } else {
            dto.setSenderName(user != null ? user.getName() : "Unknown User");
            dto.setReceiverName(mentor != null ? mentor.getName() : "Unknown Mentor");
            dto.setSenderGender(user != null ? user.getGender() : "Unknown");
            dto.setReceiverGender(mentor != null ? mentor.getGender() : "Unknown");
        }

        dto.setUserId(user != null ? user.getUserId() : null);
        dto.setMentorId(mentor != null ? mentor.getId() : null);
        dto.setIsRead(msg.getIsRead());
        Conversation convo = msg.getConversation();
        dto.setConvoId(convo != null ? convo.getId() : null);
        LocalDateTime readAt = msg.getReadAt();
        dto.setReadAt(readAt != null ? readAt : LocalDateTime.now());
        String type = msg.getMessageType();
        dto.setMessageType(type != null ? type : "TEXT");
        return dto;
    }

}