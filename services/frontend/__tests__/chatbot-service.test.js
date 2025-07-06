import { askChatbot } from "../lib/chatbot-service";

describe("Chatbot Service", () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  describe("askChatbot", () => {
    it("should send message to chatbot API with authentication", async () => {
      // Arrange
      const message = "Tell me about PhD programs";
      const mockToken = "mock-jwt-token";
      const mockUser = { id: 1, name: "Test User" };
      const mockResponse = {
        reply: "Here are some PhD programs that might interest you...",
      };

      localStorage.getItem.mockImplementation((key) => {
        if (key === "token") return mockToken;
        if (key === "user") return JSON.stringify(mockUser);
        return null;
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await askChatbot(message);

      // Assert
      expect(fetch).toHaveBeenCalledWith("http://57.159.24.58:8081/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify({ message }),
      });
      expect(result).toEqual({
        response: "Here are some PhD programs that might interest you...",
      });
    });

    it("should send message to chatbot API without authentication", async () => {
      // Arrange
      const message = "General admissions question";
      const mockResponse = {
        reply: "Here is some general admissions advice...",
      };

      localStorage.getItem.mockReturnValue(null);

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await askChatbot(message);

      // Assert
      expect(fetch).toHaveBeenCalledWith("http://57.159.24.58:8081/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      expect(result).toEqual({
        response: "Here is some general admissions advice...",
      });
    });

    it("should handle API errors gracefully", async () => {
      // Arrange
      const message = "Test message";
      const mockError = "Service unavailable";

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => mockError,
      });

      // Act & Assert
      await expect(askChatbot(message)).rejects.toThrow(
        "HTTP error! status: 500, body: Service unavailable"
      );
    });

    it("should handle network errors", async () => {
      // Arrange
      const message = "Test message";
      const networkError = new Error("Network error");

      fetch.mockRejectedValueOnce(networkError);

      // Act & Assert
      await expect(askChatbot(message)).rejects.toThrow("Network error");
    });

    it("should handle malformed JSON response", async () => {
      // Arrange
      const message = "Test message";

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      // Act & Assert
      await expect(askChatbot(message)).rejects.toThrow("Invalid JSON");
    });

    it("should handle empty message", async () => {
      // Arrange
      const message = "";
      const mockResponse = {
        reply: "Please provide a message",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await askChatbot(message);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        "http://57.159.24.58:8081/api/chat",
        expect.objectContaining({
          body: JSON.stringify({ message: "" }),
        })
      );
      expect(result).toEqual({
        response: "Please provide a message",
      });
    });
  });
});
