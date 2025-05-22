"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export function NotificationBar({ message, type = "info", duration = 5000 }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  if (!visible) return null

  const bgColors = {
    info: "bg-blue-50 border-blue-200 text-blue-700",
    success: "bg-green-50 border-green-200 text-green-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    error: "bg-red-50 border-red-200 text-red-700",
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-3 border-b ${bgColors[type]} flex items-center justify-between`}>
      <div className="flex-1 text-center">{message}</div>
      <button
        onClick={() => setVisible(false)}
        className="p-1 rounded-full hover:bg-black/5 transition-colors"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  )
}
