package com.gradpilot.service;

import com.gradpilot.dto.LoginRequest;
import com.gradpilot.dto.LoginResponse;
import com.gradpilot.dto.RegisterRequest;
import com.gradpilot.dto.RegisterResponse;
import com.gradpilot.dto.UpdateProfileResponse;
import com.gradpilot.dto.UserProfileUpdate;
import com.gradpilot.model.*;
import com.gradpilot.repository.*;
import com.gradpilot.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserScoreRepository userScoreRepository;

    @Autowired
    private ResearchInterestRepository researchInterestRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private MajorRepository majorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Transactional
    public RegisterResponse register(RegisterRequest registerRequest) {
        try {
            // Check if user already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                throw new RuntimeException("Email already exists");
            }

            // Create new user
            User user = new User();
            user.setName(registerRequest.getName());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setCgpa(registerRequest.getGpa());
            user.setApplyYear(registerRequest.getDeadlineYear());
            user.setCreatedAt(LocalDateTime.now());

            // Save user to database
            User savedUser = userRepository.save(user);

            // Save test scores
            if (registerRequest.getTestScores() != null) {
                for (Map.Entry<String, Object> entry : registerRequest.getTestScores().entrySet()) {
                    UserScore userScore = new UserScore(
                            savedUser.getUserId(),
                            entry.getKey(),
                            entry.getValue().toString());
                    userScoreRepository.save(userScore);
                }
            }

            // Save research interests (create if not exist)
            if (registerRequest.getResearchInterests() != null) {
                for (String interestName : registerRequest.getResearchInterests()) {
                    ResearchInterest interest = researchInterestRepository.findByName(interestName)
                            .orElseGet(() -> researchInterestRepository.save(new ResearchInterest(interestName)));

                    // Insert into user_research_interests table (you'll need to create this entity
                    // too)
                    // For now, we'll skip this step to keep it simple
                }
            }

            // Save target countries (create if not exist)
            if (registerRequest.getTargetCountries() != null) {
                for (String countryName : registerRequest.getTargetCountries()) {
                    Country country = countryRepository.findByName(countryName)
                            .orElseGet(() -> countryRepository.save(new Country(countryName)));

                    // Insert into user_target_countries table (you'll need to create this entity
                    // too)
                    // For now, we'll skip this step to keep it simple
                }
            }

            // Save target majors (create if not exist)
            if (registerRequest.getTargetMajors() != null) {
                for (String majorName : registerRequest.getTargetMajors()) {
                    Major major = majorRepository.findByName(majorName)
                            .orElseGet(() -> majorRepository.save(new Major(majorName)));

                    // Insert into user_target_majors table (you'll need to create this entity too)
                    // For now, we'll skip this step to keep it simple
                }
            }

            // Generate JWT token
            // UserDetails userDetails = savedUser;
            User userDetails = savedUser; // Assuming User implements UserDetails
            // String token = jwtTokenProvider.generateToken(userDetails);
            String token = jwtTokenProvider.generateToken(userDetails);

            // Create user info for response
            RegisterResponse.UserInfo userInfo = new RegisterResponse.UserInfo(
                    savedUser.getUserId().toString(),
                    savedUser.getName(),
                    savedUser.getEmail());

            return new RegisterResponse("Registration successful", userInfo, token);

        } catch (Exception e) {
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    public LoginResponse login(LoginRequest loginRequest) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            // Get user details
            // UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User userDetails = (User) authentication.getPrincipal();

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(userDetails);

            // Get user from database
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("User not found"));

            // Create user info for response
            LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                    user.getUserId().toString(),
                    user.getName(),
                    user.getEmail());

            return new LoginResponse(token, userInfo);

        } catch (Exception e) {
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    @Transactional
    public UpdateProfileResponse updateProfile(UserProfileUpdate dto) {
        try {
            // Get user ID from authentication context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                // Return a response for unauthenticated users
                // String fullPrompt = "You are an admissions advisor for US MS/PhD applicants.
                // The user is not logged in, so provide general advice.\n\nUser: "
                // + req.message();
                throw new RuntimeException("User is not authenticated");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> principal = (Map<String, Object>) authentication.getPrincipal();
            Integer userId = (Integer) principal.get("userId");

            if (userId == null) {
                // If no user ID in principal, treat as unauthenticated
                // String fullPrompt = "You are an admissions advisor for US MS/PhD applicants.
                // The user is not properly authenticated, so provide general advice.\n\nUser: "
                // + req.message();
                throw new RuntimeException("User ID not found in authentication context");
            }

            // Fetch user using UserRepository
            User user = userRepository.findById(userId).orElse(null);
            System.out.println(
                    "Database query result - User: " + (user != null ? user.getName() : "Unknown"));

            // String customPrompt = (user != null) ? String.format(
            // "You are helping %s. They have a CGPA of %s and are interested in applying in
            // %d. Give tailored advice.",
            // user.getName(),
            // user.getCgpa() != null ? user.getCgpa() : "not specified",
            // user.getApplyYear() != null ? user.getApplyYear() : 2025)
            // : "You are an admissions advisor for US MS/PhD applicants.";

            // System.out.println("Custom Prompt: " + customPrompt);
            // String fullPrompt = customPrompt + "\n\nUser: " + req.message();
            // return generateGeminiResponse(fullPrompt);
            if (user == null) {
                throw new RuntimeException("User not found");
            } else {
                // Create new user
                // User user = new User();
                user.setName(dto.getName());
                user.setEmail(dto.getEmail());
                // user.setPassword(passwordEncoder.encode(dto.getPassword()));
                user.setCgpa(dto.getCgpa());
                user.setApplyYear(dto.getApplyYear());

                User updatedUser = userRepository.save(user);

                // Save test scores
                // if (dto.getTestScores() != null) {
                // for (Map.Entry<String, Object> entry : dto.getTestScores().entrySet()) {
                // UserScore userScore = new UserScore(
                // savedUser.getUserId(),
                // entry.getKey(),
                // entry.getValue().toString());
                // userScoreRepository.save(userScore);
                // }
                // }

                // Save research interests (create if not exist)
                // if (dto.getResearchInterests() != null) {
                // for (String interestName : dto.getResearchInterests()) {
                // ResearchInterest interest =
                // researchInterestRepository.findByName(interestName)
                // .orElseGet(() -> researchInterestRepository.save(new
                // ResearchInterest(interestName)));

                // // Insert into user_research_interests table (you'll need to create this
                // entity
                // // too)
                // // For now, we'll skip this step to keep it simple
                // }
                // }

                // Save target countries (create if not exist)
                // if (dto.getTargetCountries() != null) {
                // for (String countryName : dto.getTargetCountries()) {
                // Country country = countryRepository.findByName(countryName)
                // .orElseGet(() -> countryRepository.save(new Country(countryName)));

                // // Insert into user_target_countries table (you'll need to create this entity
                // // too)
                // // For now, we'll skip this step to keep it simple
                // }
                // }

                // Save target majors (create if not exist)
                // if (dto.getTargetMajors() != null) {
                // for (String majorName : dto.getTargetMajors()) {
                // Major major = majorRepository.findByName(majorName)
                // .orElseGet(() -> majorRepository.save(new Major(majorName)));

                // // Insert into user_target_majors table (you'll need to create this entity
                // too)
                // // For now, we'll skip this step to keep it simple
                // }
                // }

                // Generate JWT token
                // UserDetails userDetails = savedUser;
                // User userDetails = savedUser; // Assuming User implements UserDetails
                // String token = jwtTokenProvider.generateToken(userDetails);
                // String token = jwtTokenProvider.generateToken(user);

                // Create user info for response
                UpdateProfileResponse.UserInfo userInfo = new UpdateProfileResponse.UserInfo(
                        updatedUser.getUserId().toString(),
                        updatedUser.getName(),
                        updatedUser.getEmail());

                return new UpdateProfileResponse("Profile updated successfully", userInfo);

            }

        } catch (Exception e) {
            e.printStackTrace(); // Show error in logs
            // return new UpdateProfileResponse("An error occurred: " + e.getMessage(),
            // null);
            throw new RuntimeException("Profile update failed: " + e.getMessage());
        }
        // User user = userRepository.findById(userId)
        // .orElseThrow(() -> new Exception("User not found"));

        // user.setName(dto.getName());
        // user.setEmail(dto.getEmail());
        // user.setCgpa(dto.getCgpa());
        // user.setApplyYear(dto.getApplyYear());

        // User updatedUser = userRepository.save(user);

        // UpdateProfileResponse.UserInfo userInfo = new UpdateProfileResponse.UserInfo(
        // updatedUser.getUserId(),
        // updatedUser.getName(),
        // updatedUser.getEmail(),
        // updatedUser.getCgpa(),
        // updatedUser.getApplyYear());

        // return new UpdateProfileResponse("Profile updated successfully", userInfo);
    }

}