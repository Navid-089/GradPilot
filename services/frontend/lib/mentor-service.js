// Get all mentors (for mentee search and chat initiation)
// const API_URL = "https://gradpilot.me"; // adjust port if needed
const API_URL = "http://localhost:8085"; // Use the correct backend URL for mentors
export async function getAllMentors() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await fetch(`${API_URL}/api/v1/mentors`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    // console.log(response);
    if (!response.ok) {
      throw new Error("Failed to fetch mentors");
    }
    const data = await response.json();
    console.log(data.content);
    return data.content;
  } catch (error) {
    console.error("Error fetching mentors:", error);
  }
}

// Get mentor dashboard data
export async function getMentorDashboard() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/v1/mentor/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch mentor dashboard data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching mentor dashboard:", error);
  }
}

// Get mentor's mentees
export async function getMentorMentees() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/v1/mentor/mentees`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch mentees");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching mentees:", error);
  }
}

// Get mentor's sessions
export async function getMentorSessions() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/v1/mentor/sessions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sessions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching sessions:", error);
  }
}

// Schedule a new session
export async function scheduleSession(sessionData) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/v1/mentor/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error("Failed to schedule session");
    }

    return await response.json();
  } catch (error) {
    console.error("Error scheduling session:", error);
  }
}

// Update mentor profile
export async function updateMentorProfile(profileData) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/v1/mentor/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
