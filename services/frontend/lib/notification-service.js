// lib/notification-service.js

const API_BASE_URL = "https://gradpilot.me/api/forum";
// const API_BASE_URL = "http://localhost:8085"; // Use the correct backend URL for notifications

class NotificationService {
  // Get auth token from localStorage
  getAuthToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  // Create headers with auth token
  getHeaders(isFormData = false) {
    const headers = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const token = this.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // Get all notifications with pagination
  async getNotifications({ page = 0, size = 10 } = {}) {
    console.log("GET NOTIFICATIONS PARAMS", { page, size });
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications?page=${page}&size=${size}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return { content: [] };
    }
  }

  // Mark a notification as read
  async markNotificationAsRead(id) {
    console.log("MARK NOTIFICATION AS READ", id);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${id}/read`,
        {
          method: "POST",
          headers: this.getHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
