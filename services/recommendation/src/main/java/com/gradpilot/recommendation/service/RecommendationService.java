package com.gradpilot.recommendation.service;

import com.gradpilot.recommendation.dto.RecommendationDto;
import com.gradpilot.recommendation.dto.UniversityRecommendationDto;
import com.gradpilot.recommendation.dto.UpcomingDeadlineDto;
import com.gradpilot.recommendation.model.*;
import com.gradpilot.recommendation.repository.*;

import jakarta.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;



@Service
public class RecommendationService {
    private final UserRepository userRepository;

    @Autowired
    private final ProfessorRepository professorRepository;

    @Autowired
    private EntityManager entityManager;

    private final MLRecommendationService mlRecommendationService;

    @Autowired
    private TrackerService trackerService;

    // Repositories for Univeristy and Scholarship
    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    // public RecommendationService(UserRepository userRepository, ProfessorRepository professorRepository, 
    //                            MLRecommendationService mlRecommendationService) {
    //     this.userRepository = userRepository;
    //     this.professorRepository = professorRepository;
    //     this.mlRecommendationService = mlRecommendationService;
    // }

    // public RecommendationService(UserRepository userRepository, ProfessorRepository professorRepository, 
    //                            MLRecommendationService mlRecommendationService,
    //                            TrackerService trackerService) {
    //     this.userRepository = userRepository;
    //     this.professorRepository = professorRepository;
    //     this.mlRecommendationService = mlRecommendationService;
    //     this.trackerService = trackerService;
    // }

    // public RecommendationService(UserRepository userRepository, ProfessorRepository professorRepository, 
    //                            MLRecommendationService mlRecommendationService,
    //                            TrackerService trackerService, UniversityRepository universityRepository,
    //                            ScholarshipRepository scholarshipRepository) {
    //     this.userRepository = userRepository;
    //     this.professorRepository = professorRepository;
    //     this.mlRecommendationService = mlRecommendationService;
    //     this.trackerService = trackerService;
    //     this.universityRepository = universityRepository;
    //     this.scholarshipRepository = scholarshipRepository;
    // }

      public RecommendationService(UserRepository userRepository,
                                  ProfessorRepository professorRepository,
                                  MLRecommendationService mlRecommendationService,
                                  TrackerService trackerService,
                                  UniversityRepository universityRepository,
                                  ScholarshipRepository scholarshipRepository,
                                  EntityManager entityManager) {
        this.userRepository = userRepository;
        this.professorRepository = professorRepository;
        this.mlRecommendationService = mlRecommendationService;
        this.trackerService = trackerService;
        this.universityRepository = universityRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.entityManager = entityManager;
    }


    public List<RecommendationDto> getProfessorRecommendations(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        List<ResearchInterest> interests = user.getResearchInterests();
        List<String> countries = user.getTargetCountries().stream().map(Country::getName).toList();
        List<String> majors = user.getTargetMajors().stream().map(Major::getName).toList();

        List<RecommendationDto> recommendations = new ArrayList<>();

        // Fetch professors matching interests
        List<Professor> matchedProfessors = professorRepository.findByResearchInterestsIn(interests);

        for (Professor prof : matchedProfessors) {
            University uni = prof.getUniversity();
            int score = 0;
            if (countries.contains(uni.getAddress()))
                score += 30;
            if (majors.contains(prof.getDepartment()))
                score += 30;
            // Example: add more scoring logic here
            recommendations.add(new RecommendationDto(
                    uni.getName(), prof.getName(), score, uni.getWebsiteUrl()));
        }

        return recommendations.stream()
                .sorted(Comparator.comparingInt(RecommendationDto::getMatchScore).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<UniversityRecommendationDto> getUniversityRecommendations(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return mlRecommendationService.getUniversityRecommendations(user.getUserId());
    }

    public List<UniversityRecommendationDto> getUniversityRecommendationsByCategory(String email, String category, int limit) {
        // For now, just return the regular university recommendations
        return getUniversityRecommendations(email);
    }

    public List<Professor> getProfessorRecommendationsByInterests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        Integer userId = user.getUserId();

        // Get all professors
        List<Professor> allProfessors = professorRepository.findAll();

        // Get matching professors (those with same research interests as user)
        List<Professor> matching = professorRepository.findProfessorsMatchingUserInterests(userId);
        Set<Integer> matchedIds = matching.stream()
                .map(Professor::getId)
                .collect(Collectors.toSet());

        // Sort: professors with matching interests first, then others
        allProfessors.sort((p1, p2) -> {
            boolean p1Match = matchedIds.contains(p1.getId());
            boolean p2Match = matchedIds.contains(p2.getId());
            return Boolean.compare(!p1Match, !p2Match); // true comes after false, so matches first
        });

        return allProfessors;
    }

    public List<ResearchInterest> getUserResearchInterests(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return user.getResearchInterests();
    }

    public List<UpcomingDeadlineDto> getUpcomingDeadlines(String email) {
         Optional<User> userOpt = userRepository.findByEmail(email);
         // debug printing 
         System.out.println("User found: " + userOpt.isPresent() + " for email: " + email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

    User user = userOpt.get();
    int userId = user.getUserId();

    List<Task> tasks = trackerService.getUserTaskEntities(user.getEmail());
    // debug printing
    System.out.println("Tasks found: " + tasks.size() + " for userId: " + userId);
    List<UpcomingDeadlineDto> deadlines = new ArrayList<>();

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    for (Task task : tasks) {
        String title, institution, date;
        int daysLeft;

        // UNIVERSITY
        if ("UNIVERSITY".equalsIgnoreCase(task.getTaskType().toString()) && task.getUniversityId() != null) {
            Optional<University> uniOpt = universityRepository.findById(task.getUniversityId());
            if (uniOpt.isPresent()) {
                University uni = uniOpt.get();
                System.out.println("Processing university: " + uni.getName());
                if (uni.getDeadline() != null) {
                    title = uni.getName() + " Application";
                    institution = uni.getName();
                    date = uni.getDeadline().toString();
                    daysLeft = (int) ChronoUnit.DAYS.between(LocalDate.now(), uni.getDeadline());
                    if (daysLeft >= 0) {
                        deadlines.add(new UpcomingDeadlineDto(title, institution, date, daysLeft));
                    }
                }
            }
        }

        // SCHOLARSHIP
        if ("SCHOLARSHIP".equalsIgnoreCase(task.getTaskType().toString()) && task.getScholarshipId() != null) {
            Optional<Scholarship> schOpt = scholarshipRepository.findById(task.getScholarshipId());
            if (schOpt.isPresent()) {
                Scholarship s = schOpt.get();
                try {
                    System.out.println("Processing scholarship: " + s.getName());
                    LocalDate deadline = LocalDate.parse(s.getDeadline(), formatter);
                    title = s.getName();
                    institution = s.getUniversity() != null ? s.getUniversity().getName() : "External";
                    date = s.getDeadline();
                    daysLeft = (int) ChronoUnit.DAYS.between(LocalDate.now(), deadline);
                    if (daysLeft >= 0) {
                        deadlines.add(new UpcomingDeadlineDto(title, institution, date, daysLeft));
                    }
                } catch (Exception ignored) {}
            }
        }
    }

    return deadlines.stream()
            .sorted(Comparator.comparingInt(UpcomingDeadlineDto::getDaysLeft))
            .limit(5)
            .collect(Collectors.toList());
        
    }
    

    

    
}