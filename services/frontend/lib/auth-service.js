// services/frontend/lib/auth-service.js

// Read the API URL from environment variables, with a fallback for local development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";

export async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return {
      user: data.user,
    };
  } catch (err) {
    console.error("Login service error:", err);
    throw err;
  }
}

export async function registerUser(userData) {
  if (!userData.name || !userData.email || !userData.password) {
    throw new Error("Name, email, and password are required");
  }
  if (userData.password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // On successful registration, also log the user in
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    return data;
  } catch (err) {
    console.error("Registration service error:", err);
    throw err;
  }
}

export async function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network latency
  return { message: "Logged out successfully" };
}

export async function getCurrentUser() {
  const userJson = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!userJson || !token) {
    return null;
  }

  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}