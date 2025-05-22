"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { logoutUser } from "@/lib/auth-service"
import { useAuth } from "@/lib/auth-context"
import { MainNav } from "@/components/main-nav"

export default function DashboardLayout({ children }) {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated, logout, isLoading } = useAuth()

  useEffect(() => {
    setIsMounted(true)

    // Check if user is logged in
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [router, isAuthenticated, isLoading])

  const handleLogout = async () => {
    try {
      await logoutUser()
      logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (!isMounted || isLoading || !isAuthenticated) {
    return null
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-6 px-4 mx-auto max-w-7xl">{children}</main>
    </div>
  )
}
