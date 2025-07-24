package com.gradpilot.recommendation.repository;

import com.gradpilot.recommendation.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    
    Optional<Payment> findByTransactionId(String transactionId);
    
    List<Payment> findByUserIdOrderByCreatedAtDesc(Integer userId);
    
    @Query("SELECT p FROM Payment p WHERE p.userId = :userId AND p.paymentStatus = 'SUCCESS' ORDER BY p.createdAt DESC")
    List<Payment> findSuccessfulPaymentsByUserId(@Param("userId") Integer userId);
    
    @Query("SELECT p FROM Payment p WHERE p.userId = :userId AND p.paymentStatus = 'SUCCESS' AND p.subscriptionEnd > CURRENT_TIMESTAMP ORDER BY p.subscriptionEnd DESC")
    Optional<Payment> findActiveSubscriptionByUserId(@Param("userId") Integer userId);
}
