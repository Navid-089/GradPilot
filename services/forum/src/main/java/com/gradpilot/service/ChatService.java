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
public class ChatService {
    @Autowired
    private ConversationRepository conversationRepo;
    @Autowired
    private MessageRepository messageRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private MentorRepository mentorRepo;

    // public Conversation getOrCreateConversation(Integer userId, Integer mentorId)
    // {
    // User user = userRepo.findById(userId).orElseThrow();
    // Mentor mentor = mentorRepo.findById(mentorId).orElseThrow();
    // return conversationRepo.findByUserAndMentor(user, mentor)
    // .orElseGet(() -> {
    // Conversation c = new Conversation();
    // c.setUser(user);
    // c.setMentor(mentor);
    // return conversationRepo.save(c);
    // });
    // }
    public ConversationDto getOrCreateConversation(Integer userId, Integer mentorId) {
        User user = userRepo.findById(userId).orElseThrow();
        Mentor mentor = mentorRepo.findById(mentorId).orElseThrow();
        Conversation conversation = conversationRepo.findByUserAndMentor(user, mentor)
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setUser(user);
                    c.setMentor(mentor);
                    c.setCreatedAt(LocalDateTime.now());
                    c.setReadUser(true);
                    c.setReadMentor(false);
                    return conversationRepo.save(c);
                });
        // Update existing conversation to mark as read by user
        if (!conversation.isReadUser()) {
            conversation.setReadUser(true);
            conversation = conversationRepo.save(conversation);
        }
        return convertToDto(conversation);
    }

    public Message sendMessage(Integer convoId, Integer senderUserId, String text, String type) {
        Conversation convo = conversationRepo.findById(convoId).orElseThrow();
        Message msg = new Message();
        msg.setConversation(convo);
        msg.setMessage(text);
        msg.setMessageType(type != null ? type : "TEXT");
        msg.setSentAt(LocalDateTime.now());
        msg.setIsRead(false);
        msg.setUser(userRepo.findById(senderUserId).orElseThrow());
        msg.setMentor(conversationRepo.findById(convoId)
                .map(Conversation::getMentor)
                .orElse(null));
        msg.setMentorSender(false);
        return messageRepo.save(msg);
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
            dto.setSenderGender(mentor != null ? mentor.getGender() : "other");
            dto.setReceiverName(user != null ? user.getName() : "Unknown User");
            dto.setReceiverGender(user != null ? user.getGender() : "other");
        } else {
            dto.setSenderName(user != null ? user.getName() : "Unknown User");
            dto.setSenderGender(user != null ? user.getGender() : "other");
            dto.setReceiverName(mentor != null ? mentor.getName() : "Unknown Mentor");
            dto.setReceiverGender(mentor != null ? mentor.getGender() : "other");
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

        // // Set sender and receiver gender
        // if (user != null) {
        // dto.setSenderGender(user.getGender());
        // } else {
        // dto.setSenderGender("Unknown");
        // }

        // if (mentor != null) {
        // dto.setReceiverGender(mentor.getGender());
        // } else {
        // dto.setReceiverGender("Unknown");
        // }

        return dto;
    }

}