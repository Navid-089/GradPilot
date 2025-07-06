package com.gradpilot.recommendation.service;

import com.gradpilot.recommendation.model.Task;
import com.gradpilot.recommendation.model.User;
import com.gradpilot.recommendation.repository.TaskRepository;
import com.gradpilot.recommendation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class TrackerService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public String saveTask(String type, String taskId, String userEmail) {
        // Find user by email
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Convert string type to enum
        Task.TaskType taskType;
        try {
            taskType = Task.TaskType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid task type: " + type);
        }
        
        // Check if already saved
        boolean alreadyExists = taskRepository.existsByUserAndItem(
            user.getUserId(), 
            taskType, 
            taskType == Task.TaskType.UNIVERSITY ? Integer.valueOf(taskId) : null,
            taskType == Task.TaskType.PROFESSOR ? Integer.valueOf(taskId) : null,
            taskType == Task.TaskType.SCHOLARSHIP ? Integer.valueOf(taskId) : null
        );
        
        if (alreadyExists) {
            return getAlreadySavedMessage(type);
        }
        
        // Create new task
        Task task = new Task();
        task.setUser(user);
        task.setTaskType(taskType);
        
        // Set the appropriate ID based on task type
        switch (taskType) {
            case UNIVERSITY:
                task.setUniversityId(Integer.valueOf(taskId));
                break;
            case PROFESSOR:
                task.setProfessorId(Integer.valueOf(taskId));
                break;
            case SCHOLARSHIP:
                task.setScholarshipId(Integer.valueOf(taskId));
                break;
        }
        
        taskRepository.save(task);
        
        return getSuccessMessage(type);
    }
    
    public List<Map<String, Object>> getUserTasks(String userEmail) {
        // Find user by email
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get all tasks for the user
        List<Task> tasks = taskRepository.findByUser_UserIdOrderByCreatedAtDesc(user.getUserId());
        
        // Convert to Map format for frontend compatibility
        return tasks.stream()
                .map(this::convertTaskToMap)
                .toList();
    }
    
    public List<Map<String, Object>> getUserTasksByType(String userEmail, String type) {
        // Find user by email
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Convert string type to enum
        Task.TaskType taskType;
        try {
            taskType = Task.TaskType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid task type: " + type);
        }
        
        // Get tasks for the user by type
        List<Task> tasks = taskRepository.findByUser_UserIdAndTaskTypeOrderByCreatedAtDesc(user.getUserId(), taskType);
        
        // Convert to Map format for frontend compatibility
        return tasks.stream()
                .map(this::convertTaskToMap)
                .toList();
    }
    
    public String removeTask(String type, String taskId, String userEmail) {
        // Find user by email
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Convert string type to enum
        Task.TaskType taskType;
        try {
            taskType = Task.TaskType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid task type: " + type);
        }
        
        // Delete the task
        taskRepository.deleteByUserAndItem(
            user.getUserId(), 
            taskType, 
            taskType == Task.TaskType.UNIVERSITY ? Integer.valueOf(taskId) : null,
            taskType == Task.TaskType.PROFESSOR ? Integer.valueOf(taskId) : null,
            taskType == Task.TaskType.SCHOLARSHIP ? Integer.valueOf(taskId) : null
        );
        
        return getRemoveMessage(type);
    }
    
    private Map<String, Object> convertTaskToMap(Task task) {
        Map<String, Object> taskMap = new HashMap<>();
        taskMap.put("taskId", task.getTaskId());
        taskMap.put("type", task.getTaskType().toString().toLowerCase());
        taskMap.put("createdAt", task.getCreatedAt());
        taskMap.put("userEmail", task.getUser().getEmail());
        
        // Set the appropriate ID based on task type
        switch (task.getTaskType()) {
            case UNIVERSITY:
                taskMap.put("universityId", task.getUniversityId());
                break;
            case PROFESSOR:
                taskMap.put("professorId", task.getProfessorId());
                break;
            case SCHOLARSHIP:
                taskMap.put("scholarshipId", task.getScholarshipId());
                break;
        }
        
        return taskMap;
    }
    
    private String getSuccessMessage(String type) {
        switch (type.toLowerCase()) {
            case "university":
                return "University saved to tracker";
            case "professor":
                return "Professor saved to tracker";
            case "scholarship":
                return "Scholarship saved to tracker";
            default:
                return "Item saved to tracker";
        }
    }
    
    private String getAlreadySavedMessage(String type) {
        switch (type.toLowerCase()) {
            case "university":
                return "University already saved to tracker";
            case "professor":
                return "Professor already saved to tracker";
            case "scholarship":
                return "Scholarship already saved to tracker";
            default:
                return "Item already saved to tracker";
        }
    }
    
    private String getRemoveMessage(String type) {
        switch (type.toLowerCase()) {
            case "university":
                return "University removed from tracker";
            case "professor":
                return "Professor removed from tracker";
            case "scholarship":
                return "Scholarship removed from tracker";
            default:
                return "Item removed from tracker";
        }
    }
} 