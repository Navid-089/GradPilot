"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { 
  GraduationCap, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X,
  MapPin,
  GraduationCap as UniversityIcon,
  User
} from "lucide-react";
import { useState } from "react";

export default function MentorLayout({ children }) {
  const { mentor, isAuthenticatedMentor, isLoading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticatedMentor) {
      router.push("/loginAsMentor");
    } else if (
      !isLoading &&
      isAuthenticatedMentor &&
      mentor?.userType !== "mentor"
    ) {
      router.push("/mentor");
    }
  }, [isAuthenticatedMentor, isLoading, mentor, router]);

  const getMentorAvatarSrc = (mentorId, gender) => {
    if (!mentorId) return "/placeholder.svg";
    let folder = "common";
    let count = 2;
    if (gender === "male") {
      folder = "male";
      count = 12;
    } else if (gender === "female") {
      folder = "female";
      count = 11;
    }
    const idx = (mentorId % count) + 1;
    return `/mentorAvatars/${folder}/${folder}_${idx}.png`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticatedMentor || mentor?.userType !== "mentor") {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/mentor" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">GradPilot</span>
          </Link>

          {/* Right Side - Theme Toggle, User Info, Logout */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Info with Avatar (Desktop) */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">{mentor?.name}</p>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {mentor?.universityName && (
                    <div className="flex items-center space-x-1">
                      <UniversityIcon className="h-3 w-3" />
                      <span className="truncate max-w-32">{mentor.universityName}</span>
                    </div>
                  )}
                  {mentor?.countryName && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{mentor.countryName}</span>
                    </div>
                  )}
                </div>
                {mentor?.isVerified && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    Verified
                  </Badge>
                )}
              </div>
              
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={getMentorAvatarSrc(mentor?.mentorId, mentor?.gender)}
                  alt={mentor?.name}
                />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container py-4 px-4">
              {/* Mobile User Info */}
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={getMentorAvatarSrc(mentor?.id, mentor?.gender)}
                      alt={mentor?.name}
                    />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium truncate">{mentor?.name}</p>
                      {mentor?.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    {mentor?.universityName && (
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                        <UniversityIcon className="h-3 w-3" />
                        <span className="truncate">{mentor.universityName}</span>
                      </div>
                    )}
                    
                    {mentor?.countryName && (
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{mentor.countryName}</span>
                      </div>
                    )}
                    
                    {mentor?.fieldOfStudyName && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {mentor.fieldOfStudyName}
                      </p>
                    )}
                    
                    {mentor?.bio && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {mentor.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <nav className="flex flex-col space-y-3">
                <Link
                  href="/mentor"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </nav>

              {/* Mobile Logout */}
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}