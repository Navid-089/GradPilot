"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MainNav } from "@/components/main-nav";
import { useNotification } from "@/components/notification/notification-provider";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [token, setToken] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showNotification } = useNotification();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setIsLoading(false);
      return;
    }

    setToken(tokenParam);
    validateToken(tokenParam);
  }, [searchParams]);

  const validateToken = async (tokenParam) => {
    try {
      const response = await fetch(
        `/api/auth/mentor-validate-reset-token?token=${tokenParam}`
      );
      const isValid = await response.json();

      setIsValidToken(isValid);
    } catch (error) {
      console.error("Error validating token:", error);
      setIsValidToken(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    if (formData.newPassword.length < 8) {
      showNotification("Password must be at least 8 characters long", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/mentor-reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      if (response.ok) {
        showNotification(
          "Password reset successfully! You can now log in with your new password.",
          "success"
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const errorText = await response.text();
        showNotification(errorText || "Failed to reset password", "error");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      showNotification("An error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto py-4">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Validating reset token...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!token || !isValidToken) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto py-4">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Invalid or Expired Link</h1>
              <p className="text-gray-500">
                This password reset link is invalid or has expired. Please
                request a new one.
              </p>
              <div className="space-y-2">
                <Link href="/mentor-forgot-password">
                  <Button className="w-full">Request New Reset Link</Button>
                </Link>
                <Link
                  href="/login"
                  className="block text-primary hover:underline text-sm"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
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
          <div className="text-center">
            <h1 className="text-2xl font-bold">Set new password</h1>
            <p className="text-sm text-gray-500 mt-2">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                required
                minLength={8}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Resetting password..." : "Reset password"}
            </Button>
          </form>

          <div className="text-center mt-4">
            <Link
              href="/login"
              className="text-primary hover:underline text-sm"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
