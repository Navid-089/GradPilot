package com.gradpilot.recommendation.dto;

import java.math.BigDecimal;

public class PaymentInitRequest {
    private BigDecimal amount;
    private String currency = "BDT";
    private String subscriptionType = "MONTHLY";
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    // Constructors
    public PaymentInitRequest() {}

    public PaymentInitRequest(BigDecimal amount, String customerName, String customerEmail, String customerPhone) {
        this.amount = amount;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
    }

    // Getters and Setters
    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getSubscriptionType() {
        return subscriptionType;
    }

    public void setSubscriptionType(String subscriptionType) {
        this.subscriptionType = subscriptionType;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }
}
