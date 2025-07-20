"use client"

import { createContext, useContext, useState } from "react"
import { ChatbotButton } from "@/components/chatbot/chatbot-button"
import { ChatbotDialog } from "@/components/chatbot/chatbot-dialog"

const ChatbotContext = createContext({
  isOpen: false,
  openChat: () => {},
  closeChat: () => {},
})

export function ChatbotProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const openChat = () => setIsOpen(true)
  const closeChat = () => setIsOpen(false)

  return (
    <ChatbotContext.Provider value={{ isOpen, openChat, closeChat }}>
      {children}
      <ChatbotButton />
      <ChatbotDialog />
    </ChatbotContext.Provider>
  )
}

export const useChatbot = () => useContext(ChatbotContext)
