// const API_BASE_URL = process.env.NEXT_PUBLIC_SOP_API_URL || 'http://localhost:8084/api/v1/sop';
const API_BASE_URL = "http://gradpilot.me/api/v1/sop"; // Update this to your actual API base URL

export const sopService = {
  async reviewSop(sopText) {
    if (!sopText || sopText.trim().length === 0) {
      throw new Error("SOP text is required");
    }

    if (sopText.length > 10000) {
      throw new Error("SOP text must be less than 10,000 characters");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sopText: sopText.trim(),
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Invalid SOP text provided");
        } else if (response.status === 500) {
          throw new Error("Server error. Please try again later");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error reviewing SOP:", error);
      if (error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to SOP review service. Please check your connection and try again."
        );
      }
      throw error;
    }
  },

  validateSopText(sopText) {
    const errors = [];

    if (!sopText || sopText.trim().length === 0) {
      errors.push("SOP text is required");
    }

    if (sopText && sopText.length < 100) {
      errors.push("SOP should be at least 100 characters long");
    }

    if (sopText && sopText.length > 10000) {
      errors.push("SOP must be less than 10,000 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  formatFeedback(feedback) {
    if (!feedback) return "";

    // Convert markdown-style formatting to HTML-friendly format
    return feedback
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>")
      .replace(/- \*\*(.*?)\*\*/g, "• <strong>$1</strong>");
  },
};

export default sopService;
