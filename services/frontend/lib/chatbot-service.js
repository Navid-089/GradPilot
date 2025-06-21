// services/frontend/lib/chatbot-service.js

// Read the Chatbot API URL from environment variables, with a fallback
const CHATBOT_API_BASE_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL || "http://localhost:8081";

export async function askChatbot(message) {
  const userId = 1; // Default userId
  const url = `${CHATBOT_API_BASE_URL}/api/chat`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId, message: message }),
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