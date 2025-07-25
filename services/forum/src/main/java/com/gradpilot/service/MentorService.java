package com.gradpilot.service;

import com.gradpilot.model.Mentor;
import com.gradpilot.repository.MentorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MentorService {
    @Autowired
    private MentorRepository mentorRepository;

    public List<Mentor> getAllMentors() {
        return mentorRepository.findAll();
    }
}
