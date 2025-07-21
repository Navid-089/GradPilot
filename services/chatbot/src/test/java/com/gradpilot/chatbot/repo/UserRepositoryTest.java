package com.gradpilot.chatbot.repo;

import com.gradpilot.chatbot.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void saveAndFindUser() {
        User user = new User();
        user.setName("Test User");
        user.setEmail("testuser" + System.currentTimeMillis() + "@example.com");
        user.setPassword("testpass123");
        user.setCgpa(java.math.BigDecimal.valueOf(3.5));
        user.setApplyYear(2025);
        user.setCreatedAt(java.time.LocalDateTime.now());
        User saved = userRepository.save(user);
        assertThat(saved.getUserId()).isNotNull();
        User found = userRepository.findById(saved.getUserId()).orElse(null);
        assertThat(found).isNotNull();
        assertThat(found.getEmail()).isEqualTo(user.getEmail());
    }
}