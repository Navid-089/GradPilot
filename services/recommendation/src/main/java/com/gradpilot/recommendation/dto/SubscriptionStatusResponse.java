package com.gradpilot.recommendation.dto;

public class SubscriptionStatusResponse {
    private boolean hasActiveSubscription;
    private boolean needsPayment;
    private String message;
    private String subscriptionType;
    private String subscriptionEndDate;
    private Integer daysRemaining;

    // Constructors
    public SubscriptionStatusResponse() {}

    public SubscriptionStatusResponse(boolean hasActiveSubscription, boolean needsPayment, String message) {
        this.hasActiveSubscription = hasActiveSubscription;
        this.needsPayment = needsPayment;
        this.message = message;
    }

    public static SubscriptionStatusResponse activeSubscription(String subscriptionType, String endDate, Integer daysRemaining) {
        SubscriptionStatusResponse response = new SubscriptionStatusResponse(true, false, "Active subscription found");
        response.setSubscriptionType(subscriptionType);
        response.setSubscriptionEndDate(endDate);
        response.setDaysRemaining(daysRemaining);
        return response;
    }

    public static SubscriptionStatusResponse needsPayment(String message) {
        return new SubscriptionStatusResponse(false, true, message);
    }

    // Getters and Setters
    public boolean isHasActiveSubscription() {
        return hasActiveSubscription;
    }

    public void setHasActiveSubscription(boolean hasActiveSubscription) {
        this.hasActiveSubscription = hasActiveSubscription;
    }

    public boolean isNeedsPayment() {
        return needsPayment;
    }

    public void setNeedsPayment(boolean needsPayment) {
        this.needsPayment = needsPayment;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSubscriptionType() {
        return subscriptionType;
    }

    public void setSubscriptionType(String subscriptionType) {
        this.subscriptionType = subscriptionType;
    }

    public String getSubscriptionEndDate() {
        return subscriptionEndDate;
    }

    public void setSubscriptionEndDate(String subscriptionEndDate) {
        this.subscriptionEndDate = subscriptionEndDate;
    }

    public Integer getDaysRemaining() {
        return daysRemaining;
    }

    public void setDaysRemaining(Integer daysRemaining) {
        this.daysRemaining = daysRemaining;
    }
}
