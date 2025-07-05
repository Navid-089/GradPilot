import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatbotDialog } from "../components/chatbot/chatbot-dialog";
import { useChatbot } from "@/components/chatbot/chatbot-provider";
import { askChatbot } from "@/lib/chatbot-service";

// Mock dependencies
jest.mock("@/components/chatbot/chatbot-provider");
jest.mock("@/lib/chatbot-service");

// Mock React Markdown
jest.mock("react-markdown", () => {
  return ({ children }) => <div data-testid="markdown-content">{children}</div>;
});

// Mock UI components
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, type, variant, size, className }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
      data-testid="button"
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({ value, onChange, placeholder, className, ...props }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      data-testid="input"
      {...props}
    />
  ),
}));

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, className }) => (
    <div className={className} data-testid="avatar">
      {children}
    </div>
  ),
  AvatarFallback: ({ children }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  X: () => <div data-testid="x-icon" />,
  Send: () => <div data-testid="send-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
  GraduationCap: () => <div data-testid="graduation-cap-icon" />,
  User: () => <div data-testid="user-icon" />,
}));

describe("ChatbotDialog Component", () => {
  beforeAll(() => {
    // Patch scrollIntoView on all elements
    Element.prototype.scrollIntoView = jest.fn();
  });

  const mockCloseChat = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    useChatbot.mockReturnValue({
      isOpen: true,
      closeChat: mockCloseChat,
    });
  });

  it("renders the chatbot dialog when open", () => {
    // Act
    render(<ChatbotDialog />);

    // Assert
    expect(
      screen.getByText(/Hi there! I'm GradPilot's AI assistant/)
    ).toBeInTheDocument();
    expect(screen.getByTestId("input")).toBeInTheDocument();
    // expect(screen.getByTestId("button")).toBeInTheDocument();
    const buttons = screen.getAllByTestId("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("does not render when closed", () => {
    // Arrange
    useChatbot.mockReturnValue({
      isOpen: false,
      closeChat: mockCloseChat,
    });

    // Act
    render(<ChatbotDialog />);

    // Assert
    expect(
      screen.queryByText(/Hi there! I'm GradPilot's AI assistant/)
    ).not.toBeInTheDocument();
  });

  it("handles user message submission", async () => {
    // Arrange
    const mockResponse = {
      response: "Here is some advice about PhD programs...",
    };
    askChatbot.mockResolvedValue(mockResponse);

    render(<ChatbotDialog />);
    const input = screen.getByTestId("input");
    // const submitButton = screen.getByTestId("button");
    const submitButton = screen.getAllByTestId("button")[1];

    // Act
    await user.type(input, "Tell me about PhD programs");
    await user.click(submitButton);

    // Assert
    expect(askChatbot).toHaveBeenCalledWith("Tell me about PhD programs");
    await waitFor(() => {
      expect(
        screen.getByText("Tell me about PhD programs")
      ).toBeInTheDocument();
    });
  });

  it("handles empty message submission", async () => {
    // Arrange
    render(<ChatbotDialog />);
    const input = screen.getByTestId("input");
    const submitButton = screen.getAllByTestId("button")[1]; // index 1 = submit button

    // Act
    await user.click(submitButton);

    // Assert
    expect(askChatbot).not.toHaveBeenCalled();
  });

  it("shows loading state during API call", async () => {
    // Arrange
    let resolvePromise;
    const mockPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    askChatbot.mockReturnValue(mockPromise);

    render(<ChatbotDialog />);
    const input = screen.getByTestId("input");
    const submitButton = screen.getAllByTestId("button")[1]; // index 1 = submit button

    // Act
    await user.type(input, "Test message");
    await user.click(submitButton);

    // Assert loading state
    // expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    const loaders = screen.getAllByTestId("loader-icon");
    expect(loaders.length).toBeGreaterThan(0);

    // Resolve the promise
    resolvePromise({ response: "Test response" });
    await waitFor(() => {
      expect(screen.queryByTestId("loader-icon")).not.toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    // Arrange
    askChatbot.mockRejectedValue(new Error("API Error"));

    render(<ChatbotDialog />);
    const input = screen.getByTestId("input");
    const submitButton = screen.getAllByTestId("button")[1]; // index 1 = submit button

    // Act
    await user.type(input, "Test message");
    await user.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText(
          (content, element) =>
            content.toLowerCase().includes("sorry") &&
            content.toLowerCase().includes("error")
        )
      ).toBeInTheDocument();
    });
  });

  it("handles form submission with Enter key", async () => {
    // Arrange
    const mockResponse = {
      response: "Response to keyboard input",
    };
    askChatbot.mockResolvedValue(mockResponse);

    render(<ChatbotDialog />);
    const input = screen.getByTestId("input");

    // Act
    await user.type(input, "Test message");
    await user.keyboard("{Enter}");

    // Assert
    expect(askChatbot).toHaveBeenCalledWith("Test message");
  });

  it("clears input after successful submission", async () => {
    // Arrange
    const mockResponse = {
      response: "Test response",
    };
    askChatbot.mockResolvedValue(mockResponse);

    render(<ChatbotDialog />);
    const input = screen.getByTestId("input");
    const submitButton = screen.getAllByTestId("button")[1]; // index 1 = submit button

    // Act
    await user.type(input, "Test message");
    expect(input.value).toBe("Test message");

    await user.click(submitButton);

    // Assert
    await waitFor(() => {
      // expect(input.value).toBe("");
      expect(screen.getByTestId("input").value).toBe("");
    });
  });

  it("calls closeChat when close button is clicked", async () => {
    // Arrange
    render(<ChatbotDialog />);
    const closeButton = screen.getByTestId("x-icon").closest("button");

    // Act
    await user.click(closeButton);

    // Assert
    expect(mockCloseChat).toHaveBeenCalledTimes(1);
  });

  it("displays user and assistant messages correctly", async () => {
    // Arrange
    const mockResponse = {
      response: "Assistant response",
    };
    askChatbot.mockResolvedValue(mockResponse);

    render(<ChatbotDialog />);
    const input = screen.getByTestId("input");
    // const submitButton = screen.getByTestId("button");
    const submitButton = screen.getAllByTestId("button")[1]; // index 1 = submit button

    // Act
    await user.type(input, "User message");
    await user.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("User message")).toBeInTheDocument();
      expect(screen.getByText("Assistant response")).toBeInTheDocument();
    });
  });
});
