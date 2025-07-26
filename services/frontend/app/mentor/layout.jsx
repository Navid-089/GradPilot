"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  LogOut,
  Home,
} from "lucide-react";

export default function MentorLayout({ children }) {
  const { user, isAuthenticatedMentor, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticatedMentor) {
      router.push("/loginAsMentor");
    } else if (!isLoading && isAuthenticatedMentor && user?.userType !== "mentor") {
      // If user is authenticated but not a mentor, redirect to student dashboard
      router.push("/dashboard");
    }
  }, [isAuthenticatedMentor, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticatedMentor || user?.userType !== "mentor") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col min-h-0">
        <div className="flex flex-col flex-grow pt-5 bg-white border-r min-h-0 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link
              href="/mentor/dashboard"
              className="flex items-center space-x-2"
            >
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">GradPilot</span>
            </Link>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              <Link
                href="/mentor/dashboard"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-50"
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/mentor/mentees"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Users className="mr-3 h-5 w-5" />
                My Mentees
              </Link>
              <Link
                href="/mentor/sessions"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Calendar className="mr-3 h-5 w-5" />
                Sessions
              </Link>
              <Link
                href="/mentor/messages"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <MessageSquare className="mr-3 h-5 w-5" />
                Messages
              </Link>
              <Link
                href="/mentor/profile"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Settings className="mr-3 h-5 w-5" />
                Profile
              </Link>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4 bg-white">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    Mentor Account
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="mt-2 w-full justify-start text-gray-600 hover:text-gray-900"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Mobile header */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <Link
              href="/mentor/dashboard"
              className="flex items-center space-x-2"
            >
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold">GradPilot</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
