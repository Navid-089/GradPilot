"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare } from "lucide-react"
import { useChatbot } from "@/components/chatbot/chatbot-provider"
import { Button } from "@/components/ui/button"

export function ChatbotButton() {
  const { openChat } = useChatbot()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef(null)
  const initialPositionSet = useRef(false)

  // Set initial position
  useEffect(() => {
    if (!initialPositionSet.current) {
      const x = Math.min(window.innerWidth - 80, window.innerWidth - 80)
      const y = Math.min(window.innerHeight - 80, window.innerHeight - 80)
      setPosition({ x, y })
      initialPositionSet.current = true
    }
  }, [])

  // Handle drag start
  const handleMouseDown = (e) => {
    setIsDragging(true)

    // Calculate offset from the button's top-left corner
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    // Store offset in ref for use during drag
    dragRef.current = { offsetX, offsetY }

    // Prevent text selection during drag
    e.preventDefault()
  }

  // Handle drag
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && dragRef.current) {
        const { offsetX, offsetY } = dragRef.current

        // Calculate new position
        const x = e.clientX - offsetX
        const y = e.clientY - offsetY

        // Constrain to viewport
        const maxX = window.innerWidth - 56
        const maxY = window.innerHeight - 56
        const boundedX = Math.max(0, Math.min(x, maxX))
        const boundedY = Math.max(0, Math.min(y, maxY))

        setPosition({ x: boundedX, y: boundedY })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "grabbing"
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
    }
  }, [isDragging])

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true)

    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = touch.clientX - rect.left
    const offsetY = touch.clientY - rect.top

    dragRef.current = { offsetX, offsetY }
  }

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (isDragging && dragRef.current) {
        const touch = e.touches[0]
        const { offsetX, offsetY } = dragRef.current

        const x = touch.clientX - offsetX
        const y = touch.clientY - offsetY

        const maxX = window.innerWidth - 56
        const maxY = window.innerHeight - 56
        const boundedX = Math.max(0, Math.min(x, maxX))
        const boundedY = Math.max(0, Math.min(y, maxY))

        setPosition({ x: boundedX, y: boundedY })
        e.preventDefault() // Prevent scrolling while dragging
      }
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener("touchmove", handleTouchMove, { passive: false })
      window.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging])

  return (
    <div
      className="draggable-chatbot"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <Button
        onClick={openChat}
        className="h-14 w-14 rounded-full shadow-lg bg-chatbot hover:bg-chatbot-hover text-chatbot-foreground"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Open AI Chatbot</span>
      </Button>
    </div>
  )
}
