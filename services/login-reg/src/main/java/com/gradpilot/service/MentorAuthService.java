package com.gradpilot.service;

import java.time.LocalDateTime;
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
import com.gradpilot.dto.ResetPasswordRequest;
import com.gradpilot.model.Mentor;
import com.gradpilot.model.MentorExpertiseArea;
import com.gradpilot.model.MentorPasswordResetToken;
import com.gradpilot.model.University;
import com.gradpilot.model.FieldOfStudy;
import com.gradpilot.model.Country;
import com.gradpilot.model.ExpertiseArea;
import com.gradpilot.repository.MentorRepository;
import com.gradpilot.repository.MentorExpertiseAreaRepository;
import com.gradpilot.repository.MentorPasswordResetTokenRepository;
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

    @Autowired
    private EmailService emailService;

    @Autowired
    private MentorPasswordResetTokenRepository mentorPasswordResetTokenRepository; 

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

    @Transactional
    public void sendPasswordResetEmail(String email) {
        try {
            // Mentor mentor = mentorRepository.findByEmail(email).orElse(null); // Change to mentor
            Mentor mentor = mentorRepository.findByEmail(email).orElse(null); // Change to mentor
            if (mentor == null) {
                // For security reasons, don't reveal if email exists or not
                // Just log and return success to prevent email enumeration
                System.out.println("Password reset requested for non-existent mentor email: " + email);
                return;
            }

            // Invalidate any existing unused tokens for this mentor
            mentorPasswordResetTokenRepository.markAllMentorTokensAsUsed(mentor); // Change this

            // Generate a secure reset token
            String resetToken = java.util.UUID.randomUUID().toString();

            // Create password reset token with 1 hour expiry
            LocalDateTime expiryDate = LocalDateTime.now().plusHours(1);
            MentorPasswordResetToken passwordResetToken = new MentorPasswordResetToken(resetToken, mentor, expiryDate); // Change
                                                                                                                        // this
            mentorPasswordResetTokenRepository.save(passwordResetToken); // Change this

            // Send email
            emailService.sendPasswordResetEmail(email, resetToken);

        } catch (Exception e) {
            System.err.println("Error in sendPasswordResetEmail: " + e.getMessage());
            // Don't throw exception to prevent revealing system information
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        try {
            // Validate passwords match
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                throw new RuntimeException("Passwords do not match");
            }

            // Find the token
            MentorPasswordResetToken resetToken = mentorPasswordResetTokenRepository // Change this
                    .findByTokenAndUsedFalse(request.getToken())
                    .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

            // Check if token is expired
            if (resetToken.isExpired()) {
                throw new RuntimeException("Reset token has expired");
            }

            // Update mentor password
            Mentor mentor = resetToken.getMentor(); // Change this
            mentor.setBicryptedPass(passwordEncoder.encode(request.getNewPassword())); // Change to setBicryptedPass
            mentorRepository.save(mentor); // Change this

            // Mark token as used
            resetToken.setUsed(true);
            mentorPasswordResetTokenRepository.save(resetToken); // Change this

            // Send success email
            emailService.sendPasswordResetSuccessEmail(mentor.getEmail()); // Change this

        } catch (Exception e) {
            throw new RuntimeException("Failed to reset password: " + e.getMessage());
        }
    }

    @Transactional
    public boolean validateResetToken(String token) {
        try {
            MentorPasswordResetToken resetToken = mentorPasswordResetTokenRepository // Change this
                    .findByTokenAndUsedFalse(token)
                    .orElse(null);

            return resetToken != null && !resetToken.isExpired();
        } catch (Exception e) {
            System.err.println("Error validating reset token: " + e.getMessage());
            return false;
        }
    }

    // Cleanup method - can be called periodically to remove expired tokens
    @Transactional
    public void cleanupExpiredTokens() {
        mentorPasswordResetTokenRepository.deleteExpiredTokens(LocalDateTime.now()); // Change this
    }
}
