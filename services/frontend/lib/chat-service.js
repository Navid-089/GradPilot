const API_BASE = "https://gradpilot.me/api/chat"; // adjust port if needed
// const API_BASE = "http://localhost:8085/api/chat"; // Use the correct backend URL for chat

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function startConversation(mentorId) {
  const res = await fetch(`${API_BASE}/start?mentorId=${mentorId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return await res.json();
}

export async function sendMessage({ conversationId, text, type = "TEXT" }) {
  const res = await fetch(`${API_BASE}/send`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      conversationId,
      text,
      type,
    }),
  });
  return await res.json();
}

export async function getMessages(conversationId) {
  const res = await fetch(`${API_BASE}/messages/${conversationId}`, {
    headers: getAuthHeaders(),
  });
  const messages = await res.json();
  console.log("Messages fetched:", messages);
  return messages;
}

export async function getUserConversations() {
  const res = await fetch(`${API_BASE}/conversations`, {
    headers: getAuthHeaders(),
  });
  return await res.json();
}

export async function getMentorConversations(mentorId) {
  const res = await fetch(`${API_BASE}/conversations/mentor/${mentorId}`, {
    headers: getAuthHeaders(),
  });
  return await res.json();
}

export const markConversationAsRead = async (conversationId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE}/conversations/${conversationId}/read`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to mark conversation as read");
    }

    return { success: true };
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    throw error;
  }
};
