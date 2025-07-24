package com.gradpilot.recommendation.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "sslcommerz")
public class SSLCommerzConfig {
    
    private Store store = new Store();
    private Api api = new Api();
    private Validation validation = new Validation();
    private String successUrl;
    private String failUrl;
    private String cancelUrl;
    private String ipnUrl;
    
    // Getters and setters
    public Store getStore() {
        return store;
    }
    
    public void setStore(Store store) {
        this.store = store;
    }
    
    public Api getApi() {
        return api;
    }
    
    public void setApi(Api api) {
        this.api = api;
    }
    
    public Validation getValidation() {
        return validation;
    }
    
    public void setValidation(Validation validation) {
        this.validation = validation;
    }
    
    public String getSuccessUrl() {
        return successUrl;
    }
    
    public void setSuccessUrl(String successUrl) {
        this.successUrl = successUrl;
    }
    
    public String getFailUrl() {
        return failUrl;
    }
    
    public void setFailUrl(String failUrl) {
        this.failUrl = failUrl;
    }
    
    public String getCancelUrl() {
        return cancelUrl;
    }
    
    public void setCancelUrl(String cancelUrl) {
        this.cancelUrl = cancelUrl;
    }
    
    public String getIpnUrl() {
        return ipnUrl;
    }
    
    public void setIpnUrl(String ipnUrl) {
        this.ipnUrl = ipnUrl;
    }
    
    public static class Store {
        private String id;
        private String password;
        
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }
    
    public static class Api {
        private String url;
        
        public String getUrl() {
            return url;
        }
        
        public void setUrl(String url) {
            this.url = url;
        }
    }
    
    public static class Validation {
        private String url;
        
        public String getUrl() {
            return url;
        }
        
        public void setUrl(String url) {
            this.url = url;
        }
    }
}
