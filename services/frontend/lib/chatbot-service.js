// Actual chatbot service calling backend API

export async function askChatbot(message) {
  // Get user info from localStorage
  const userJson = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  const url = "http://localhost:8081/api/chat";

  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // Only add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        message: message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const data = await response.json();

    // The backend ChatResponse has a 'reply' field
    return { response: data.reply };
  } catch (error) {
    console.error("Error calling chatbot API:", error);
    throw error; // Re-throw to be handled by the calling component
  }
}
