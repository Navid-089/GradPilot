package com.gradpilot.recommendation.dto;

public class PaymentInitResponse {
    private boolean success;
    private String message;
    private String paymentUrl;
    private String sessionKey;
    private String transactionId;
    private Object error;

    // Constructors
    public PaymentInitResponse() {}

    public PaymentInitResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public static PaymentInitResponse success(String paymentUrl, String sessionKey, String transactionId) {
        PaymentInitResponse response = new PaymentInitResponse(true, "Payment initialized successfully");
        response.setPaymentUrl(paymentUrl);
        response.setSessionKey(sessionKey);
        response.setTransactionId(transactionId);
        return response;
    }

    public static PaymentInitResponse failure(String message, Object error) {
        PaymentInitResponse response = new PaymentInitResponse(false, message);
        response.setError(error);
        return response;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPaymentUrl() {
        return paymentUrl;
    }

    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }

    public String getSessionKey() {
        return sessionKey;
    }

    public void setSessionKey(String sessionKey) {
        this.sessionKey = sessionKey;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Object getError() {
        return error;
    }

    public void setError(Object error) {
        this.error = error;
    }
}
