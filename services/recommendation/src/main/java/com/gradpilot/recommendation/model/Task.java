package com.gradpilot.recommendation.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Integer taskId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "task_type", nullable = false)
    private TaskType taskType;

    @Column(name = "university_id")
    private Integer universityId;

    @Column(name = "professor_id")
    private Integer professorId;

    @Column(name = "scholarship_id")
    private Integer scholarshipId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Task type enum
    public enum TaskType {
        UNIVERSITY,
        PROFESSOR,
        SCHOLARSHIP
    }

    // Constructors
    public Task() {
        this.createdAt = LocalDateTime.now();
    }

    public Task(User user, TaskType taskType) {
        this.user = user;
        this.taskType = taskType;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Integer getTaskId() {
        return taskId;
    }

    public void setTaskId(Integer taskId) {
        this.taskId = taskId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TaskType getTaskType() {
        return taskType;
    }

    public void setTaskType(TaskType taskType) {
        this.taskType = taskType;
    }

    public Integer getUniversityId() {
        return universityId;
    }

    public void setUniversityId(Integer universityId) {
        this.universityId = universityId;
    }

    public Integer getProfessorId() {
        return professorId;
    }

    public void setProfessorId(Integer professorId) {
        this.professorId = professorId;
    }

    public Integer getScholarshipId() {
        return scholarshipId;
    }

    public void setScholarshipId(Integer scholarshipId) {
        this.scholarshipId = scholarshipId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
