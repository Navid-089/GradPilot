"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MainNav } from "@/components/main-nav"
import { useNotification } from "@/components/notification/notification-provider"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { showNotification } = useNotification()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      showNotification("Password reset instructions sent to your email", "success")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <MainNav />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          {!isSubmitted ? (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold">Reset your password</h1>
                <p className="text-sm text-gray-500 mt-2">
                  Enter your email address and we'll send you instructions to reset your password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending instructions..." : "Send reset instructions"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="text-gray-500">
                We've sent password reset instructions to <span className="font-medium">{email}</span>
              </p>
              <p className="text-sm text-gray-500">
                If you don't see the email, check your spam folder or make sure you entered the correct email address.
              </p>
            </div>
          )}

          <div className="text-center mt-4">
            <Link href="/login" className="text-primary hover:underline text-sm">
              Back to sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
