// const API_BASE_URL = "http://localhost:8083";
const API_BASE_URL = "https://gradpilot.me/api";

export const applicationService = {
  // Apply to a scholarship
  async applyToScholarship(scholarshipId) {
    try {
      const token = localStorage.getItem('token');
      console.log("=== APPLICATION SERVICE - APPLY ===");
      console.log("TOKEN:", token);
      console.log('Token present:', token ? 'YES' : 'NO');
      console.log('API URL:', API_BASE_URL);
      console.log('ScholarshipId:', scholarshipId);
      
      if (!token) {
        console.error('No authentication token found');
        throw new Error('No authentication token found');
      }

      const requestBody = {
        scholarshipId: scholarshipId
      };
      console.log('Request body:', requestBody);

      const url = `${API_BASE_URL}/api/recommendations/applications/apply`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText };
        }
        console.error('Error data:', errorData);
        throw new Error(errorData.error || 'Failed to apply to scholarship');
      }

      const data = await response.json();
      console.log('Success data:', data);
      return data;
    } catch (error) {
      console.error('=== APPLICATION SERVICE ERROR ===');
      console.error('Error applying to scholarship:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  },

  // Get all user applications
  async getUserApplications() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/recommendations/applications`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  // Remove an application
  async removeApplication(scholarshipId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/recommendations/applications/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          scholarshipId: scholarshipId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove application');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing application:', error);
      throw error;
    }
  },

  // Check if user has applied to a scholarship
  async hasUserApplied(scholarshipId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/recommendations/applications/check/${scholarshipId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check application status');
      }

      const data = await response.json();
      return data.hasApplied;
    } catch (error) {
      console.error('Error checking application status:', error);
      return false;
    }
  }
};
