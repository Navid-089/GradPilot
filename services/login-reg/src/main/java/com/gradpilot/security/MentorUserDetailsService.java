package com.gradpilot.security;

import com.gradpilot.model.Mentor;
import com.gradpilot.repository.MentorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service("mentorUserDetailsService")
public class MentorUserDetailsService implements UserDetailsService {

    @Autowired
    private MentorRepository mentorRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Mentor mentor = mentorRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Mentor not found with email: " + email));

        return mentor;
    }
}
