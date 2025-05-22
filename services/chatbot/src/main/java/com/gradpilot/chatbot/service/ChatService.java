package com.gradpilot.chatbot.service;

import com.gradpilot.chatbot.dto.ChatRequest;
import com.gradpilot.chatbot.dto.ChatResponse;
import com.theokanning.openai.OpenAiService;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private final OpenAiService openAi;

    public ChatService(OpenAiService openAi) {
        this.openAi = openAi;
    }

    public ChatResponse chat(ChatRequest req) {
        ChatCompletionRequest completionRequest = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo-0125")
                .messages(List.of(
                        new ChatMessage("system", "You are an admissions advisor for US MS/PhD applicants."),
                        new ChatMessage("user", req.message())))
                .build();

        String reply = openAi.createChatCompletion(completionRequest)
                .getChoices().get(0).getMessage().getContent();

        return new ChatResponse(reply);
    }
}
