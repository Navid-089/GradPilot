"use client";

import { createContext, useContext, useState, useEffect } from "react";

const MessageContext = createContext({
  unreadCount: 0,
  conversations: [],
  updateUnreadCount: () => {},
  setConversations: () => {},
  markConversationAsRead: () => {},
});

export function MessageProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread count whenever conversations change
  const updateUnreadCount = () => {
    const count = conversations.filter(conv => !conv.readUser).length;
    setUnreadCount(count);
  };

  useEffect(() => {
    updateUnreadCount();
  }, [conversations]);

  // Mark conversation as read
  const markConversationAsRead = (conversationId) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, readUser: true }
          : conv
      )
    );
  };

  return (
    <MessageContext.Provider 
      value={{ 
        unreadCount,
        conversations,
        setConversations,
        updateUnreadCount,
        markConversationAsRead
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
};