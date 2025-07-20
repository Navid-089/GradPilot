"use client"

import { createContext, useContext, useState } from "react"
import { NotificationBar } from "./notification-bar"

const NotificationContext = createContext({
  showNotification: () => {},
  hideNotification: () => {},
})

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = "info", duration = 5000) => {
    setNotification({ message, type })

    if (duration) {
      setTimeout(() => {
        hideNotification()
      }, duration)
    }
  }

  const hideNotification = () => {
    setNotification(null)
  }

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {notification && (
        <NotificationBar message={notification.message} type={notification.type} onClose={hideNotification} />
      )}
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
