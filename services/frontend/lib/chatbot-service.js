// Actual chatbot service calling backend API

export async function askChatbot(message) {
  const userId = 1; // Default userId
  // Use localhost:8081 as this code runs client-side in the browser
  const url = "http://localhost:8081/api/chat";

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
