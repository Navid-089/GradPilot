package com.gradpilot.recommendation.service;

import com.gradpilot.recommendation.config.SSLCommerzConfig;
import com.gradpilot.recommendation.dto.PaymentInitRequest;
import com.gradpilot.recommendation.dto.PaymentInitResponse;
import com.gradpilot.recommendation.dto.SubscriptionStatusResponse;
import com.gradpilot.recommendation.model.Payment;
import com.gradpilot.recommendation.model.User;
import com.gradpilot.recommendation.repository.PaymentRepository;
import com.gradpilot.recommendation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SSLCommerzConfig sslCommerzConfig;

    private final RestTemplate restTemplate = new RestTemplate();

    public PaymentInitResponse initializePayment(PaymentInitRequest request, Integer userId) {
        try {
            // Validate user exists
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return PaymentInitResponse.failure("User not found", null);
            }

            User user = userOpt.get();
            String transactionId = "GRADPILOT_" + System.currentTimeMillis();

            // Create payment record with PENDING status
            Payment payment = new Payment();
            payment.setUserId(userId);
            payment.setTransactionId(transactionId);
            payment.setAmount(request.getAmount());
            payment.setCurrency(request.getCurrency());
            payment.setPaymentStatus("PENDING");
            payment.setSubscriptionType("MONTHLY"); // Default to monthly
            payment.setCreatedAt(LocalDateTime.now());
            paymentRepository.save(payment);

            // Prepare SSLCommerz data
            MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
            data.add("store_id", sslCommerzConfig.getStore().getId());
            data.add("store_passwd", sslCommerzConfig.getStore().getPassword());
            data.add("total_amount", request.getAmount().toString());
            data.add("currency", request.getCurrency());
            data.add("tran_id", transactionId);
            data.add("success_url", sslCommerzConfig.getSuccessUrl());
            data.add("fail_url", sslCommerzConfig.getFailUrl());
            data.add("cancel_url", sslCommerzConfig.getCancelUrl());
            data.add("ipn_url", sslCommerzConfig.getIpnUrl());
            data.add("shipping_method", "NO");
            data.add("product_name", "GradPilot Premium Subscription");
            data.add("product_category", "Service");
            data.add("product_profile", "general");
            data.add("cus_name", request.getCustomerName() != null ? request.getCustomerName() : user.getName());
            data.add("cus_email", request.getCustomerEmail() != null ? request.getCustomerEmail() : user.getEmail());
            data.add("cus_add1", "Dhaka");
            data.add("cus_add2", "Dhaka");
            data.add("cus_city", "Dhaka");
            data.add("cus_state", "Dhaka");
            data.add("cus_postcode", "1000");
            data.add("cus_country", "Bangladesh");
            data.add("cus_phone", request.getCustomerPhone() != null ? request.getCustomerPhone() : "01712345678");
            data.add("cus_fax", request.getCustomerPhone() != null ? request.getCustomerPhone() : "01712345678");
            data.add("ship_name", request.getCustomerName() != null ? request.getCustomerName() : user.getName());
            data.add("ship_add1", "Dhaka");
            data.add("ship_add2", "Dhaka");
            data.add("ship_city", "Dhaka");
            data.add("ship_state", "Dhaka");
            data.add("ship_postcode", "1000");
            data.add("ship_country", "Bangladesh");

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(data, headers);

            // Call SSLCommerz API
            @SuppressWarnings("unchecked")
            ResponseEntity<Map> response = restTemplate.postForEntity(
                sslCommerzConfig.getApi().getUrl(), entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> responseBody = response.getBody();
                String status = (String) responseBody.get("status");

                if ("SUCCESS".equals(status)) {
                    String paymentUrl = (String) responseBody.get("GatewayPageURL");
                    String sessionKey = (String) responseBody.get("sessionkey");

                    return PaymentInitResponse.success(paymentUrl, sessionKey, transactionId);
                } else {
                    return PaymentInitResponse.failure("Payment initialization failed", responseBody);
                }
            } else {
                return PaymentInitResponse.failure("Failed to communicate with payment gateway", null);
            }

        } catch (Exception e) {
            return PaymentInitResponse.failure("Server error: " + e.getMessage(), null);
        }
    }

    public boolean validateAndProcessPayment(String transactionId, String validationId) {
        try {
            // Get payment record
            Optional<Payment> paymentOpt = paymentRepository.findByTransactionId(transactionId);
            if (!paymentOpt.isPresent()) {
                return false;
            }

            Payment payment = paymentOpt.get();

            // Validate with SSLCommerz
            String validationUrlWithParams = sslCommerzConfig.getValidation().getUrl() + "?val_id=" + validationId + 
                                           "&store_id=" + sslCommerzConfig.getStore().getId() + 
                                           "&store_passwd=" + sslCommerzConfig.getStore().getPassword();

            ResponseEntity<Map> response = restTemplate.getForEntity(validationUrlWithParams, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> responseBody = response.getBody();
                String status = (String) responseBody.get("status");

                if ("VALID".equals(status)) {
                    // Update payment status
                    payment.setPaymentStatus("SUCCESS");
                    payment.setValidationId(validationId);
                    
                    // Set subscription dates
                    LocalDateTime now = LocalDateTime.now();
                    payment.setSubscriptionStart(now);
                    
                    if ("MONTHLY".equals(payment.getSubscriptionType())) {
                        payment.setSubscriptionEnd(now.plusMonths(1));
                    } else if ("YEARLY".equals(payment.getSubscriptionType())) {
                        payment.setSubscriptionEnd(now.plusYears(1));
                    }

                    paymentRepository.save(payment);

                    // Update user's last payment
                    Optional<User> userOpt = userRepository.findById(payment.getUserId());
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        user.setLastPayment(now);
                        userRepository.save(user);
                    }

                    return true;
                }
            }

            // If validation failed, update payment status
            payment.setPaymentStatus("FAILED");
            paymentRepository.save(payment);
            return false;

        } catch (Exception e) {
            return false;
        }
    }

    public SubscriptionStatusResponse checkSubscriptionStatus(Integer userId) {
        try {
            // Check for active subscription
            Optional<Payment> activeSubscription = paymentRepository.findActiveSubscriptionByUserId(userId);
            
            if (activeSubscription.isPresent()) {
                Payment payment = activeSubscription.get();
                LocalDateTime endDate = payment.getSubscriptionEnd();
                long daysRemaining = ChronoUnit.DAYS.between(LocalDateTime.now(), endDate);
                
                return SubscriptionStatusResponse.activeSubscription(
                    payment.getSubscriptionType(),
                    endDate.format(DateTimeFormatter.ISO_LOCAL_DATE),
                    (int) daysRemaining
                );
            }

            // Check last payment date from user record
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                LocalDateTime lastPayment = user.getLastPayment();
                
                if (lastPayment == null) {
                    return SubscriptionStatusResponse.needsPayment("No payment history found. Subscribe to access premium features.");
                }

                long daysSinceLastPayment = ChronoUnit.DAYS.between(lastPayment, LocalDateTime.now());
                if (daysSinceLastPayment > 30) {
                    return SubscriptionStatusResponse.needsPayment("Subscription expired " + (daysSinceLastPayment - 30) + " days ago. Renew your subscription to continue.");
                }
            }

            return SubscriptionStatusResponse.needsPayment("Subscription required to access this feature.");

        } catch (Exception e) {
            return SubscriptionStatusResponse.needsPayment("Unable to verify subscription status.");
        }
    }

    public boolean hasValidSubscription(Integer userId) {
        SubscriptionStatusResponse status = checkSubscriptionStatus(userId);
        return status.isHasActiveSubscription();
    }
}
