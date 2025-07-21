package com.gradpilot.chatbot.repo;

import com.gradpilot.chatbot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
}