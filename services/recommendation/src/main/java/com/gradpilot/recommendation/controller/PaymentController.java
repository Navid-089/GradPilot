package com.gradpilot.recommendation.controller;

import com.gradpilot.recommendation.dto.PaymentInitRequest;
import com.gradpilot.recommendation.dto.PaymentInitResponse;
import com.gradpilot.recommendation.dto.SubscriptionStatusResponse;
import com.gradpilot.recommendation.model.User;
import com.gradpilot.recommendation.repository.UserRepository;
import com.gradpilot.recommendation.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/recommendations/payment")
@CrossOrigin(origins = {"http://localhost:3000", "https://gradpilot.me", "https://www.gradpilot.me"})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.frontend.payment.success}")
    private String successPath;

    @Value("${app.frontend.payment.fail}")
    private String failPath;

    @Value("${app.frontend.payment.cancel}")
    private String cancelPath;

    @PostMapping("/init")
    public ResponseEntity<PaymentInitResponse> initializePayment(
            @RequestBody PaymentInitRequest request,
            Authentication authentication) {
        
        try {
            // Extract user from authentication
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(401).body(
                    PaymentInitResponse.failure("User not found", null)
                );
            }

            User user = userOpt.get();

            // Set default amount if not provided (500 BDT for monthly subscription)
            if (request.getAmount() == null) {
                request.setAmount(new BigDecimal("500.00"));
            }

            // Set customer details from user if not provided
            if (request.getCustomerName() == null) {
                request.setCustomerName(user.getName());
            }
            if (request.getCustomerEmail() == null) {
                request.setCustomerEmail(user.getEmail());
            }

            PaymentInitResponse response = paymentService.initializePayment(request, user.getUserId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                PaymentInitResponse.failure("Server error: " + e.getMessage(), null)
            );
        }
    }

    @GetMapping("/success")
    public ResponseEntity<Void> paymentSuccess(
            @RequestParam("tran_id") String transactionId,
            @RequestParam("val_id") String validationId,
            @RequestParam(value = "amount", required = false) String amount,
            @RequestParam(value = "currency", required = false) String currency) {
        
        System.out.println("=== PAYMENT SUCCESS CALLBACK ===");
        System.out.println("Transaction ID: " + transactionId);
        System.out.println("Validation ID: " + validationId);
        System.out.println("Amount: " + amount);
        System.out.println("Currency: " + currency);
        
        boolean isValid = paymentService.validateAndProcessPayment(transactionId, validationId);
        System.out.println("Payment validation result: " + isValid);
        
        String redirectUrl;
        if (isValid) {
            // Redirect to frontend success page with parameters
            redirectUrl = String.format("%s%s?tran_id=%s&val_id=%s&amount=%s&currency=%s", 
                frontendUrl, successPath, transactionId, validationId, 
                amount != null ? amount : "500", currency != null ? currency : "BDT");
        } else {
            // Redirect to frontend fail page
            redirectUrl = String.format("%s%s?tran_id=%s&error=validation_failed", 
                frontendUrl, failPath, transactionId);
        }
        
        System.out.println("Redirecting to: " + redirectUrl);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(redirectUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    // API endpoint for frontend to validate payment
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validatePayment(
            @RequestParam("tran_id") String transactionId,
            @RequestParam("val_id") String validationId,
            Authentication authentication) {
        
        try {
            boolean isValid = paymentService.validateAndProcessPayment(transactionId, validationId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("transactionId", transactionId);
            response.put("validationId", validationId);
            response.put("success", isValid);
            response.put("message", isValid ? "Payment confirmed successfully" : "Payment validation failed");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error processing payment: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/fail")
    public ResponseEntity<Void> paymentFail(
            @RequestParam("tran_id") String transactionId,
            @RequestParam(value = "amount", required = false) String amount,
            @RequestParam(value = "currency", required = false) String currency,
            @RequestParam(value = "error", required = false) String error) {
        
        String redirectUrl = String.format("%s%s?tran_id=%s&amount=%s&currency=%s&error=%s", 
            frontendUrl, failPath, transactionId, amount != null ? amount : "500", 
            currency != null ? currency : "BDT", error != null ? error : "payment_failed");
        
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(redirectUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/cancel")
    public ResponseEntity<Void> paymentCancel(
            @RequestParam("tran_id") String transactionId,
            @RequestParam(value = "amount", required = false) String amount,
            @RequestParam(value = "currency", required = false) String currency) {
        
        String redirectUrl = String.format("%s%s?tran_id=%s&amount=%s&currency=%s", 
            frontendUrl, cancelPath, transactionId, amount != null ? amount : "500", 
            currency != null ? currency : "BDT");
        
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(redirectUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @PostMapping("/ipn")
    public ResponseEntity<String> paymentIPN(@RequestBody String ipnData) {
        // Log IPN data for monitoring
        System.out.println("IPN received: " + ipnData);
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/subscription-status")
    public ResponseEntity<SubscriptionStatusResponse> getSubscriptionStatus(
            Authentication authentication) {
        
        try {
            // Extract user from authentication
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(401).body(
                    SubscriptionStatusResponse.needsPayment("User not found")
                );
            }

            User user = userOpt.get();
            SubscriptionStatusResponse status = paymentService.checkSubscriptionStatus(user.getUserId());
            return ResponseEntity.ok(status);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                SubscriptionStatusResponse.needsPayment("Server error: " + e.getMessage())
            );
        }
    }

    @SuppressWarnings("unused")
    private String generateSuccessPage(String transactionId, String validationId) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Successful - GradPilot</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
                    .success { color: #28a745; font-size: 48px; margin-bottom: 20px; }
                    h1 { color: #333; margin-bottom: 20px; }
                    p { color: #666; margin-bottom: 15px; }
                    .details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
                    .btn { background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
                    .btn:hover { background-color: #0056b3; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="success">✓</div>
                    <h1>Payment Successful!</h1>
                    <p>Thank you for subscribing to GradPilot Premium!</p>
                    <div class="details">
                        <p><strong>Transaction ID:</strong> %s</p>
                        <p><strong>Validation ID:</strong> %s</p>
                        <p><strong>Status:</strong> Confirmed</p>
                    </div>
                    <p>Your subscription is now active. You can now access all premium features including the scholarship finder.</p>
                    <a href="https://gradpilot.me/scholarships" class="btn">Go to Scholarships</a>
                </div>
                <script>
                    // Auto redirect after 10 seconds
                    setTimeout(function() {
                        window.location.href = 'https://gradpilot.me/scholarships';
                    }, 10000);
                </script>
            </body>
            </html>
            """, transactionId, validationId);
    }

    @SuppressWarnings("unused")
    private String generateFailurePage(String transactionId, String reason) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Failed - GradPilot</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
                    .error { color: #dc3545; font-size: 48px; margin-bottom: 20px; }
                    h1 { color: #333; margin-bottom: 20px; }
                    p { color: #666; margin-bottom: 15px; }
                    .details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
                    .btn { background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px; }
                    .btn:hover { background-color: #0056b3; }
                    .btn-secondary { background-color: #6c757d; }
                    .btn-secondary:hover { background-color: #545b62; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="error">✗</div>
                    <h1>Payment Failed</h1>
                    <p>%s</p>
                    <div class="details">
                        <p><strong>Transaction ID:</strong> %s</p>
                    </div>
                    <p>Please try again or contact support if the issue persists.</p>
                    <a href="https://gradpilot.me/scholarships" class="btn">Try Again</a>
                    <a href="https://gradpilot.me" class="btn btn-secondary">Go Home</a>
                </div>
            </body>
            </html>
            """, reason, transactionId);
    }
}
