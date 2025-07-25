package com.gradpilot.controller;

import com.gradpilot.dto.MentorDto;
import com.gradpilot.model.Mentor;
import com.gradpilot.model.Notification;
import com.gradpilot.repository.FieldOfStudyRepository;
import com.gradpilot.repository.MentorRepository;
import com.gradpilot.repository.NotificationRepository;
import com.gradpilot.repository.UniversityRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class MentorController {
    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private UniversityRepository university;

    @Autowired
    private FieldOfStudyRepository fieldOfStudy;

    private Integer getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }
        @SuppressWarnings("unchecked")
        var principal = (java.util.Map<String, Object>) authentication.getPrincipal();
        return (Integer) principal.get("userId");
    }

    private Integer getCurrentUserIdOptional() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() ||
                    "anonymousUser".equals(authentication.getPrincipal())) {
                return null;
            }
            @SuppressWarnings("unchecked")
            var principal = (java.util.Map<String, Object>) authentication.getPrincipal();
            return (Integer) principal.get("userId");
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/mentors")
    public Page<MentorDto> getMentors(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Integer userId = getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("User ID not found in principal");
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Mentor> mentorPage = mentorRepository.findAll(pageable);

        return mentorPage.map(mentor -> {
            String universityName = null;
            if (mentor.getUniversity() != null) {
                universityName = mentor.getUniversity().getName(); // assuming getName() exists
            }

            String fieldOfStudyName = null;
            if (mentor.getFieldOfStudy() != null) {
                fieldOfStudyName = mentor.getFieldOfStudy().getName(); // assuming getName() exists
            }

            // String expertiseAreaName = null;
            // if (mentor.getExpertiseArea() != null) {
            //     expertiseAreaName = mentor.getExpertiseArea().getName(); // assuming getName()
            // }

            return new MentorDto(
                    mentor.getId(),
                    mentor.getName(),
                    mentor.getEmail(),
                    // expertiseAreaName,
                    mentor.getBio(),
                    mentor.getIsVerified(),
                    mentor.getLinkedin(),
                    universityName,
                    fieldOfStudyName);
        });
    }
}