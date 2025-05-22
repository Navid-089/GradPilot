"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Loader2, GraduationCap, User } from "lucide-react"
import { useChatbot } from "@/components/chatbot/chatbot-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { askChatbot } from "@/lib/chatbot-service"

export function ChatbotDialog() {
  const { isOpen, closeChat } = useChatbot()
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi there! I'm GradPilot's AI assistant. How can I help with your graduate school application journey today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await askChatbot(input)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.response,
        },
      ])
    } catch (error) {
      console.error("Error getting chatbot response:", error)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md h-[600px] max-h-[90vh] flex flex-col border">
        <div className="flex items-center justify-between p-4 border-b bg-chatbot text-chatbot-foreground rounded-t-lg">
          <div className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            <h2 className="font-semibold">GradPilot Assistant</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-chatbot-foreground hover:bg-chatbot-hover"
            onClick={closeChat}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <Avatar className={message.role === "user" ? "bg-primary" : "bg-chatbot"}>
                  <AvatarFallback
                    className={message.role === "user" ? "text-primary-foreground" : "text-chatbot-foreground"}
                  >
                    {message.role === "user" ? <User className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-chatbot/10 dark:bg-chatbot/20"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3 max-w-[80%]">
                <Avatar className="bg-chatbot">
                  <AvatarFallback className="text-chatbot-foreground">
                    <GraduationCap className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-chatbot/10 dark:bg-chatbot/20">
                  <Loader2 className="h-4 w-4 animate-spin text-chatbot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
          <Input
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-chatbot hover:bg-chatbot-hover text-chatbot-foreground"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
