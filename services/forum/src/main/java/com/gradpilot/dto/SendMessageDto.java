package com.gradpilot.dto;

public class SendMessageDto {
    private Integer conversationId;
    private Integer senderUserId; // nullable
    private Integer senderMentorId; // nullable
    private String text;
    private String type; // e.g. "TEXT"

    // Getters and setters
    public Integer getConversationId() {
        return conversationId;
    }

    public void setConversationId(Integer conversationId) {
        this.conversationId = conversationId;
    }

    public Integer getSenderUserId() {
        return senderUserId;
    }

    public void setSenderUserId(Integer senderUserId) {
        this.senderUserId = senderUserId;
    }

    public Integer getSenderMentorId() {
        return senderMentorId;
    }

    public void setSenderMentorId(Integer senderMentorId) {
        this.senderMentorId = senderMentorId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}