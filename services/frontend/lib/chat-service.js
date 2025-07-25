const API_BASE = "https://gradpilot.me/api/chat"; // adjust port if needed

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function startConversation(userId, mentorId) {
  const res = await fetch(
    `${API_BASE}/start?userId=${userId}&mentorId=${mentorId}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );
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
