// Mentor profile service for frontend
// const API_URL = "https://gradpilot.me"; // adjust if needed
const API_URL = "http://localhost:8082"; // Use the correct backend URL for mentor profile

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

export async function getMentorProfile(email) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await fetch(`${API_URL}/api/v1/mentor/profile?email=${encodeURIComponent(email)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch mentor profile");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    throw error;
  }
}
