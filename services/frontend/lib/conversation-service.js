// lib/notification-service.js

const API_BASE_URL = "https://gradpilot.me";
// const API_BASE_URL = "http://localhost:8085"; // Use the correct backend URL for notifications

class ConversationService {
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

  async getUserConversations() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/conversations`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user conversations");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setConversations(data);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error("Error fetching user conversations:", error);
    }
  }
}

const conversationService = new ConversationService();
export default conversationService;
