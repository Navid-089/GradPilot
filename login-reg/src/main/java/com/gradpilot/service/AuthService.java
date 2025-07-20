package com.gradpilot.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gradpilot.dto.LoginRequest;
import com.gradpilot.dto.LoginResponse;
import com.gradpilot.dto.RegisterRequest;
import com.gradpilot.dto.RegisterResponse;
import com.gradpilot.dto.UpdateProfileResponse;
import com.gradpilot.dto.UserProfileUpdate;
import com.gradpilot.model.User;
import com.gradpilot.model.UserResearchInterest;
import com.gradpilot.model.UserScore;
import com.gradpilot.model.UserTargetCountry;
import com.gradpilot.model.UserTargetMajor;
import com.gradpilot.repository.CountryRepository;
import com.gradpilot.repository.MajorRepository;
import com.gradpilot.repository.ResearchInterestRepository;
import com.gradpilot.repository.UserRepository;
import com.gradpilot.repository.UserResearchInterestRepository;
import com.gradpilot.repository.UserScoreRepository;
import com.gradpilot.repository.UserTargetCountryRepository;
import com.gradpilot.repository.UserTargetMajorRepository;
import com.gradpilot.security.JwtTokenProvider;

@Service
public class AuthService {

    @Autowired
    private UserTargetMajorRepository userTargetMajorRepository;

    @Autowired
    private UserTargetCountryRepository userTargetCountryRepository;

    @Autowired
    private UserResearchInterestRepository userResearchInterestRepository;

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

            // Save research interests (IDs)
            if (registerRequest.getResearchInterests() != null) {
                for (Integer interestId : registerRequest.getResearchInterests()) {
                    UserResearchInterest userResearchInterest = new UserResearchInterest(savedUser.getUserId(), interestId);
                    userResearchInterestRepository.save(userResearchInterest);
                }
            }

            // Save target countries (IDs)
            if (registerRequest.getTargetCountries() != null) {
                for (Integer countryId : registerRequest.getTargetCountries()) {
                    UserTargetCountry userTargetCountry = new UserTargetCountry(savedUser.getUserId(), countryId);
                    userTargetCountryRepository.save(userTargetCountry);
                }
            }

            // Save target majors (IDs)
            if (registerRequest.getTargetMajors() != null) {
                for (Integer majorId : registerRequest.getTargetMajors()) {
                    UserTargetMajor userTargetMajor = new UserTargetMajor(savedUser.getUserId(), majorId);
                    userTargetMajorRepository.save(userTargetMajor);
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
            // For now, let's use the email from the DTO to find the user
            // In a real application, you'd get this from JWT token or authentication context
            String email = dto.getEmail();
            if (email == null || email.trim().isEmpty()) {
                throw new RuntimeException("Email is required for profile update");
            }

            // Fetch user using email
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

            System.out.println("Database query result - User: " + user.getName());

            // Update user basic information
            user.setName(dto.getName());
            user.setEmail(dto.getEmail());
            user.setCgpa(dto.getGpa());
            user.setApplyYear(dto.getDeadlineYear());

            User updatedUser = userRepository.save(user);

            // Save test scores
            if (dto.getTestScores() != null && !dto.getTestScores().isEmpty()) {
                try {
                    // First, get existing scores to avoid constraint violations
                    List<UserScore> existingScores = userScoreRepository.findByUserId(updatedUser.getUserId());

                    // Clear existing test scores
                    if (!existingScores.isEmpty()) {
                        userScoreRepository.deleteAll(existingScores);
                        userScoreRepository.flush(); // Ensure deletion is committed
                    }

                    for (Map.Entry<String, Object> entry : dto.getTestScores().entrySet()) {
                        String testName = entry.getKey();
                        Object scoreValue = entry.getValue();

                        // Handle different types of score values
                        String scoreString = "";
                        if (scoreValue != null) {
                            scoreString = scoreValue.toString();
                        }

                        // Only save non-empty scores
                        if (!scoreString.trim().isEmpty()) {
                            UserScore userScore = new UserScore(
                                    updatedUser.getUserId(),
                                    testName,
                                    scoreString);
                            userScoreRepository.save(userScore);
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error processing test scores: " + e.getMessage());
                    e.printStackTrace();
                    // Continue with the rest of the update process
                }
            }

            // Save target countries
            if (dto.getTargetCountries() != null) {
                try {
                    // First, get existing target countries to avoid constraint violations
                    List<UserTargetCountry> existingCountries = userTargetCountryRepository.findByUserId(updatedUser.getUserId());

                    // Clear existing target countries
                    if (!existingCountries.isEmpty()) {
                        userTargetCountryRepository.deleteAll(existingCountries);
                        userTargetCountryRepository.flush(); // Ensure deletion is committed
                    }

                    for (Integer countryId : dto.getTargetCountries()) {
                        UserTargetCountry userTargetCountry = new UserTargetCountry(
                                updatedUser.getUserId(), countryId);
                        userTargetCountryRepository.save(userTargetCountry);
                    }
                } catch (Exception e) {
                    System.err.println("Error processing target countries: " + e.getMessage());
                    e.printStackTrace();
                    // Continue with the rest of the update process
                }
            }

            // Save target majors
            if (dto.getTargetMajors() != null) {
                try {
                    // First, get existing target majors to avoid constraint violations
                    List<UserTargetMajor> existingMajors = userTargetMajorRepository.findByUserId(updatedUser.getUserId());

                    // Clear existing target majors
                    if (!existingMajors.isEmpty()) {
                        userTargetMajorRepository.deleteAll(existingMajors);
                        userTargetMajorRepository.flush(); // Ensure deletion is committed
                    }

                    for (Integer majorId : dto.getTargetMajors()) {
                        UserTargetMajor userTargetMajor = new UserTargetMajor(
                                updatedUser.getUserId(), majorId);
                        userTargetMajorRepository.save(userTargetMajor);
                    }
                } catch (Exception e) {
                    System.err.println("Error processing target majors: " + e.getMessage());
                    e.printStackTrace();
                    // Continue with the rest of the update process
                }
            }

            // Save research interests
            if (dto.getResearchInterests() != null) {
                try {
                    // Clear existing research interests using deleteByUserId which works better with composite keys
                    userResearchInterestRepository.deleteByUserId(updatedUser.getUserId());
                    userResearchInterestRepository.flush(); // Ensure deletion is committed

                    for (Integer interestId : dto.getResearchInterests()) {
                        UserResearchInterest userResearchInterest = new UserResearchInterest(
                                updatedUser.getUserId(), interestId);
                        userResearchInterestRepository.save(userResearchInterest);
                    }
                } catch (Exception e) {
                    System.err.println("Error processing research interests: " + e.getMessage());
                    e.printStackTrace();
                    // Continue with the rest of the update process
                }
            }

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

        } catch (Exception e) {
            e.printStackTrace(); // Show error in logs
            throw new RuntimeException("Profile update failed: " + e.getMessage());
        }
    }

    public Object getProfile(String email) {
        try {
            // Find user by email
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

            // Get user's target countries
            java.util.List<UserTargetCountry> userTargetCountries = userTargetCountryRepository.findByUserId(user.getUserId());
            java.util.List<Integer> targetCountryIds = userTargetCountries.stream()
                    .map(UserTargetCountry::getCountryId)
                    .collect(java.util.stream.Collectors.toList());

            // Get user's target majors
            java.util.List<UserTargetMajor> userTargetMajors = userTargetMajorRepository.findByUserId(user.getUserId());
            java.util.List<Integer> targetMajorIds = userTargetMajors.stream()
                    .map(UserTargetMajor::getMajorId)
                    .collect(java.util.stream.Collectors.toList());

            // Get user's research interests
            java.util.List<UserResearchInterest> userResearchInterests = userResearchInterestRepository.findByUserId(user.getUserId());
            java.util.List<Integer> researchInterestIds = userResearchInterests.stream()
                    .map(UserResearchInterest::getResearchInterestId)
                    .collect(java.util.stream.Collectors.toList());

            // Get user's test scores
            java.util.List<UserScore> userScores = userScoreRepository.findByUserId(user.getUserId());
            java.util.Map<String, Object> testScores = new java.util.HashMap<>();
            for (UserScore score : userScores) {
                testScores.put(score.getTestName(), score.getScore());
            }

            // Create response object
            java.util.Map<String, Object> profile = new java.util.HashMap<>();
            profile.put("name", user.getName());
            profile.put("email", user.getEmail());
            profile.put("gpa", user.getCgpa());
            profile.put("deadlineYear", user.getApplyYear());
            profile.put("testScores", testScores);
            profile.put("targetCountries", targetCountryIds);
            profile.put("targetMajors", targetMajorIds);
            profile.put("researchInterests", researchInterestIds);

            return profile;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch profile: " + e.getMessage());
        }
    }

}
