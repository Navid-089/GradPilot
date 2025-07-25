package com.gradpilot.dto;

import java.time.LocalDateTime;

public class MessageDto {
    private Integer id;
    private LocalDateTime sentAt;
    private Integer userId;
    private Integer mentorId;
    private Boolean mentorSender;
    private String message;
    private Boolean isRead;
    private LocalDateTime readAt;
    private String messageType;
    private Integer convoId;
    private String senderName;
    private String receiverName;

    public MessageDto() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getMentorId() {
        return mentorId;
    }

    public void setMentorId(Integer mentorId) {
        this.mentorId = mentorId;
    }

    public Boolean getMentorSender() {
        return mentorSender;
    }

    public void setMentorSender(Boolean mentorSender) {
        this.mentorSender = mentorSender;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public Integer getConvoId() {
        return convoId;
    }

    public void setConvoId(Integer convoId) {
        this.convoId = convoId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }
}
