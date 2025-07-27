package com.gradpilot.service;


import java.time.OffsetDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gradpilot.dto.MentorLoginRequest;
import com.gradpilot.dto.MentorLoginResponse;
import com.gradpilot.dto.MentorRegisterRequest;
import com.gradpilot.dto.MentorRegisterResponse;
import com.gradpilot.dto.MentorProfileUpdateRequest;
import com.gradpilot.dto.MentorDto;
import com.gradpilot.model.Mentor;
import com.gradpilot.model.MentorExpertiseArea;
import com.gradpilot.model.University;
import com.gradpilot.model.FieldOfStudy;
import com.gradpilot.model.Country;
import com.gradpilot.model.ExpertiseArea;
import com.gradpilot.repository.MentorRepository;
import com.gradpilot.repository.MentorExpertiseAreaRepository;
import com.gradpilot.repository.UniversityRepository;
import com.gradpilot.repository.FieldOfStudyRepository;
import com.gradpilot.repository.CountryRepository;
import com.gradpilot.repository.ExpertiseAreaRepository;
import com.gradpilot.security.JwtTokenProvider;

@Service
public class MentorAuthService {

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private MentorExpertiseAreaRepository mentorExpertiseAreaRepository;

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private FieldOfStudyRepository fieldOfStudyRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private ExpertiseAreaRepository expertiseAreaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public MentorDto getMentorProfileByEmail(String email) {
        Mentor mentor = mentorRepository.findByEmail(email).orElse(null);
        if (mentor == null) return null;
        return mapMentorToDto(mentor);
    }

    @Transactional
    public MentorDto updateMentorProfile(MentorProfileUpdateRequest updateRequest) {
        Mentor mentor = mentorRepository.findByEmail(updateRequest.getEmail()).orElse(null);
        if (mentor == null) return null;

        if (updateRequest.getName() != null) mentor.setName(updateRequest.getName());
        if (updateRequest.getBio() != null) mentor.setBio(updateRequest.getBio());
        if (updateRequest.getLinkedin() != null) mentor.setLinkedin(updateRequest.getLinkedin());
        if (updateRequest.getGender() != null) mentor.setGender(updateRequest.getGender());

        if (updateRequest.getUniversityId() != null) {
            University university = universityRepository.findById(updateRequest.getUniversityId()).orElse(null);
            mentor.setUniversity(university);
        }
        if (updateRequest.getFieldStudyId() != null) {
            FieldOfStudy fieldOfStudy = fieldOfStudyRepository.findById(updateRequest.getFieldStudyId()).orElse(null);
            mentor.setFieldOfStudy(fieldOfStudy);
        }
        if (updateRequest.getCountryId() != null) {
            Country country = countryRepository.findById(updateRequest.getCountryId()).orElse(null);
            mentor.setCountry(country);
        }

        mentorRepository.save(mentor);
        return mapMentorToDto(mentor);
    }

    private MentorDto mapMentorToDto(Mentor mentor) {
        return new MentorDto(
            mentor.getId(),
            mentor.getCreatedAt() != null ? mentor.getCreatedAt().toLocalDateTime() : null,
            mentor.getUniversity() != null ? mentor.getUniversity().getUniversityId() : null,
            mentor.getFieldOfStudy() != null ? mentor.getFieldOfStudy().getId() : null,
            mentor.getIsVerified(),
            mentor.getCountry() != null ? mentor.getCountry().getId() : null,
            mentor.getBio(),
            mentor.getLinkedin(),
            mentor.getGender()
        );
    }

    @Transactional
    public MentorRegisterResponse register(MentorRegisterRequest registerRequest) {
        try {
            // Check if mentor already exists
            if (mentorRepository.existsByEmail(registerRequest.getEmail())) {
                throw new RuntimeException("Email already exists");
            }

            // Create new mentor
            Mentor mentor = new Mentor();
            mentor.setName(registerRequest.getName());
            mentor.setEmail(registerRequest.getEmail());
            mentor.setBicryptedPass(passwordEncoder.encode(registerRequest.getPassword()));
            mentor.setBio(registerRequest.getBio());
            mentor.setLinkedin(registerRequest.getLinkedin());
            mentor.setCreatedAt(OffsetDateTime.now());
            mentor.setIsVerified(false);
            mentor.setGender(registerRequest.getGender());

            // Set university if provided
            if (registerRequest.getUniversityId() != null) {
                University university = universityRepository.findById(registerRequest.getUniversityId())
                        .orElseThrow(() -> new RuntimeException("University not found"));
                mentor.setUniversity(university);
            }

            // Set field of study if provided
            if (registerRequest.getFieldStudyId() != null) {
                FieldOfStudy fieldOfStudy = fieldOfStudyRepository.findById(registerRequest.getFieldStudyId())
                        .orElseThrow(() -> new RuntimeException("Field of study not found"));
                mentor.setFieldOfStudy(fieldOfStudy);
            }

            // Set country if provided
            if (registerRequest.getCountryId() != null) {
                Country country = countryRepository.findById(registerRequest.getCountryId())
                        .orElseThrow(() -> new RuntimeException("Country not found"));
                mentor.setCountry(country);
            }

            // Save mentor to database
            Mentor savedMentor = mentorRepository.save(mentor);

            // Save expertise areas
            if (registerRequest.getExpertiseAreaIds() != null) {
                for (Integer expertiseAreaId : registerRequest.getExpertiseAreaIds()) {
                    ExpertiseArea expertiseArea = expertiseAreaRepository.findById(expertiseAreaId)
                            .orElseThrow(() -> new RuntimeException("Expertise area not found"));
                    MentorExpertiseArea mentorExpertiseArea = new MentorExpertiseArea(savedMentor, expertiseArea);
                    mentorExpertiseAreaRepository.save(mentorExpertiseArea);
                }
            }

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(savedMentor);

            // Create mentor info for response
            MentorRegisterResponse.MentorInfo mentorInfo = new MentorRegisterResponse.MentorInfo(
                    savedMentor.getId().toString(),
                    savedMentor.getName(),
                    savedMentor.getEmail());

            return new MentorRegisterResponse("Mentor registration successful", mentorInfo, token);

        } catch (Exception e) {
            throw new RuntimeException("Mentor registration failed: " + e.getMessage());
        }
    }

    public MentorLoginResponse login(MentorLoginRequest loginRequest) {
        try {
            // Find mentor by email
            Mentor mentor = mentorRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

            // Check password
            if (!passwordEncoder.matches(loginRequest.getPassword(), mentor.getBicryptedPass())) {
                throw new BadCredentialsException("Invalid email or password");
            }

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(mentor);

            // Create mentor info for response
            MentorLoginResponse.MentorInfo mentorInfo = new MentorLoginResponse.MentorInfo(
                    mentor.getId().toString(),
                    mentor.getName(),
                    mentor.getEmail(),
                    mentor.getIsVerified(),
                    mentor.getGender());

            return new MentorLoginResponse(token, mentorInfo);

        } catch (Exception e) {
            throw new BadCredentialsException("Invalid email or password");
        }
    }
}
