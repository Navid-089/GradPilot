// Profile Service API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8182';

const ProfileService = {
  // Get current user profile
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Parse JWT token to get user email
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userEmail = payload.sub;

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/profile?email=${userEmail}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Parse JWT token to get user email
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userEmail = payload.sub;

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/profile?email=${userEmail}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profileData,
          email: userEmail, // Include email in the request body
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};
import { getToken } from './auth-service';

export async function updateProfile(profileData) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers,
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

export async function getProfile(email) {
  try {
    if (!email) {
      throw new Error('Email is required to fetch profile');
    }

    const token = getToken();
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/profile?email=${encodeURIComponent(email)}`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}
