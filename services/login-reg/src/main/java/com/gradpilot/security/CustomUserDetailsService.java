package com.gradpilot.security;

import com.gradpilot.model.User;
import com.gradpilot.model.Mentor;
import com.gradpilot.repository.UserRepository;
import com.gradpilot.repository.MentorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // First try to find a regular user
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            return user;
        }

        // If not found, try to find a mentor
        Mentor mentor = mentorRepository.findByEmail(email).orElse(null);
        if (mentor != null) {
            return mentor;
        }

        // If neither found, throw exception
        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}