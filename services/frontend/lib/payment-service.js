// Payment service for SSLCommerz integration

const API_BASE_URL = "https://gradpilot.me";

export const paymentService = {
  // Initialize payment
  async initializePayment(paymentData) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/recommendations/payment/init`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error initializing payment:', error);
      throw error;
    }
  },

  // Check subscription status
  async checkSubscriptionStatus() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/recommendations/payment/subscription-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking subscription status:', error);
      throw error;
    }
  },

  // Get subscription pricing
  getSubscriptionPricing() {
    return {
      monthly: {
        amount: 500.00,
        currency: 'BDT',
        period: 'month',
        label: 'Monthly Subscription',
        description: 'Access all premium features for 30 days'
      },
      yearly: {
        amount: 5000.00,
        currency: 'BDT',
        period: 'year',
        label: 'Yearly Subscription',
        description: 'Access all premium features for 12 months (Save 17%)'
      }
    };
  }
};
