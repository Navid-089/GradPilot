package com.gradpilot.recommendation.controller;

import com.gradpilot.recommendation.dto.PaymentInitRequest;
import com.gradpilot.recommendation.dto.PaymentInitResponse;
import com.gradpilot.recommendation.dto.SubscriptionStatusResponse;
import com.gradpilot.recommendation.model.User;
import com.gradpilot.recommendation.repository.UserRepository;
import com.gradpilot.recommendation.repository.PaymentRepository;
import com.gradpilot.recommendation.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
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

public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;

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

    @RequestMapping(value = "/success", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<Void> paymentSuccess(
            @RequestParam(value = "tran_id", required = false) String transactionId,
            @RequestParam(value = "val_id", required = false) String validationId,
            @RequestParam(value = "amount", required = false) String amount,
            @RequestParam(value = "currency", required = false) String currency,
            @RequestParam(value = "status", required = false) String status,
            HttpServletRequest request) {
        
        System.out.println("=== PAYMENT SUCCESS CALLBACK ===");
        System.out.println("Request Method: " + request.getMethod());
        System.out.println("Transaction ID: " + transactionId);
        System.out.println("Validation ID: " + validationId);
        System.out.println("Amount: " + amount);
        System.out.println("Currency: " + currency);
        System.out.println("Status: " + status);
        
        // Handle missing required parameters
        if (transactionId == null || validationId == null) {
            System.out.println("ERROR: Missing required parameters (tran_id or val_id)");
            String redirectUrl = String.format("%s%s?error=missing_parameters", 
                frontendUrl, failPath);
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create(redirectUrl));
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        }
        
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

    // Test endpoint to check if basic components are working
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Test database connection
            long paymentCount = paymentRepository.count();
            response.put("databaseConnected", true);
            response.put("paymentRecordCount", paymentCount);
            
            // Test configuration
            response.put("frontendUrl", frontendUrl);
            response.put("successPath", successPath);
            
            response.put("status", "healthy");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "unhealthy");
            response.put("error", e.getMessage());
            response.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.status(500).body(response);
        }
    }

    // API endpoint for frontend to validate payment
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validatePayment(
            @RequestParam("tran_id") String transactionId,
            @RequestParam("val_id") String validationId) {
        
        System.out.println("=== PAYMENT VALIDATION REQUEST ===");
        System.out.println("Transaction ID: " + transactionId);
        System.out.println("Validation ID: " + validationId);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Add basic validation
            if (transactionId == null || transactionId.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Transaction ID is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (validationId == null || validationId.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Validation ID is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Log before calling service
            System.out.println("About to call paymentService.validateAndProcessPayment");
            
            boolean isValid = paymentService.validateAndProcessPayment(transactionId, validationId);
            
            System.out.println("Payment validation result: " + isValid);
            
            response.put("transactionId", transactionId);
            response.put("validationId", validationId);
            response.put("success", isValid);
            response.put("message", isValid ? "Payment confirmed successfully" : "Payment validation failed");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error in payment validation: " + e.getMessage());
            System.err.println("Error type: " + e.getClass().getSimpleName());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "Error processing payment: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            response.put("transactionId", transactionId);
            response.put("validationId", validationId);
            
            // Add stack trace for debugging
            if (e.getCause() != null) {
                response.put("cause", e.getCause().getMessage());
            }
            
            return ResponseEntity.status(500).body(response);
        }
    }

    @RequestMapping(value = "/fail", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<Void> paymentFail(
            @RequestParam(value = "tran_id", required = false) String transactionId,
            @RequestParam(value = "amount", required = false) String amount,
            @RequestParam(value = "currency", required = false) String currency,
            @RequestParam(value = "error", required = false) String error,
            HttpServletRequest request) {
        
        System.out.println("=== PAYMENT FAIL CALLBACK ===");
        System.out.println("Request Method: " + request.getMethod());
        System.out.println("Transaction ID: " + transactionId);
        System.out.println("Error: " + error);
        
        String redirectUrl = String.format("%s%s?tran_id=%s&amount=%s&currency=%s&error=%s", 
            frontendUrl, failPath, transactionId != null ? transactionId : "unknown", 
            amount != null ? amount : "500", 
            currency != null ? currency : "BDT", error != null ? error : "payment_failed");
        
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(redirectUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @RequestMapping(value = "/cancel", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<Void> paymentCancel(
            @RequestParam(value = "tran_id", required = false) String transactionId,
            @RequestParam(value = "amount", required = false) String amount,
            @RequestParam(value = "currency", required = false) String currency,
            HttpServletRequest request) {
        
        System.out.println("=== PAYMENT CANCEL CALLBACK ===");
        System.out.println("Request Method: " + request.getMethod());
        System.out.println("Transaction ID: " + transactionId);
        
        String redirectUrl = String.format("%s%s?tran_id=%s&amount=%s&currency=%s", 
            frontendUrl, cancelPath, transactionId != null ? transactionId : "unknown", 
            amount != null ? amount : "500", 
            currency != null ? currency : "BDT");
        
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(redirectUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @RequestMapping(value = "/ipn", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<String> paymentIPN(
            @RequestParam(value = "tran_id", required = false) String transactionId,
            @RequestParam(value = "val_id", required = false) String validationId,
            @RequestParam(value = "amount", required = false) String amount,
            @RequestParam(value = "status", required = false) String status,
            @RequestBody(required = false) String ipnData,
            HttpServletRequest request) {
        
        System.out.println("=== IPN CALLBACK ===");
        System.out.println("Request Method: " + request.getMethod());
        System.out.println("Transaction ID: " + transactionId);
        System.out.println("Validation ID: " + validationId);
        System.out.println("IPN Data: " + ipnData);
        
        return ResponseEntity.ok("OK");
    }

    // Explicit OPTIONS support for CORS preflight
    @RequestMapping(value = {"/success", "/fail", "/cancel", "/ipn", "/validate"}, method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> handleOptions() {
        System.out.println("=== OPTIONS REQUEST RECEIVED ===");
        return ResponseEntity.ok()
            .header("Access-Control-Allow-Origin", "*")
            .header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            .header("Access-Control-Allow-Headers", "*")
            .build();
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

    // Test endpoint for sandbox testing
    @GetMapping("/test-success")
    public ResponseEntity<String> testPaymentSuccess(
            @RequestParam(value = "tran_id", defaultValue = "test_sandbox_123") String transactionId,
            @RequestParam(value = "val_id", defaultValue = "test_val_456") String validationId,
            @RequestParam(value = "amount", defaultValue = "500") String amount,
            @RequestParam(value = "currency", defaultValue = "BDT") String currency) {
        
        System.out.println("=== TEST PAYMENT SUCCESS ===");
        System.out.println("Redirecting to success endpoint with test data...");
        
        // If using default values, generate unique transaction ID
        if ("test_sandbox_123".equals(transactionId)) {
            transactionId = "test_" + System.currentTimeMillis();
        }
        
        // Redirect to the actual success endpoint
        String redirectUrl = String.format("/api/recommendations/payment/success?tran_id=%s&val_id=%s&amount=%s&currency=%s", 
            transactionId, validationId, amount, currency);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(redirectUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
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
