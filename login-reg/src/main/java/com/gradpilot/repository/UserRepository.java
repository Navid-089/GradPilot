package com.gradpilot.repository;

import com.gradpilot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("SELECT COUNT(u) FROM User u")
    Long countAllUsers();

    // For authentication
    Optional<User> findByEmail(String email);

    // Check if email exists
    boolean existsByEmail(String email);
}