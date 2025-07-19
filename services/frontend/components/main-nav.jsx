"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  User,
  School,
  BookOpen,
  Award,
  Calendar,
  FileText,
  Users,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  MessageSquare,
  Search,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { NotificationMenu } from "@/components/notification/notification-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [notifications, setNotifications] = useState(3); // Dummy notification count
  const [messages, setMessages] = useState(2); // Dummy messages count
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
    },
    {
      name: "Universities",
      href: "/universities",
      icon: <School className="h-4 w-4 mr-2" />,
    },
    {
      name: "Research",
      href: "/research",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      name: "Forum",
      href: "/dashboard/forum",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
    },
    {
      name: "Essay Review",
      href: "/dashboard/sop-review",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      name: "Scholarships",
      href: "/scholarships",
      icon: <Award className="h-4 w-4 mr-2" />,
    },
    {
      name: "Timeline",
      href: "/dashboard/timeline",
      icon: <Calendar className="h-4 w-4 mr-2" />,
    },
  ];

  const resourcesItems = [
    { name: "University Rankings", href: "/resources/rankings" },
    { name: "Application Guides", href: "/resources/guides" },
    { name: "Visa Information", href: "/resources/visa" },
    { name: "Financial Aid", href: "/resources/financial-aid" },
  ];

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getAvatarSrc = (user) => {
    if (!user) return "/placeholder.svg";
    // console.log("Gender:", user.gender);
    const gender = user.gender || "common";
    let folder = "common";
    let count = 2;
    if (gender === "male") {
      folder = "male";
      count = 43;
    } else if (gender === "female") {
      folder = "female";
      count = 24;
    }
    const id = user.userId ?? 0;
    const idx = (id % count) + 1;
    return `/avatars/${folder}/${folder}_${idx}.png`;
  };

  return (
    <div className="border-b bg-background sticky top-0 z-30 w-full">
      <div className="container flex h-16 items-center px-4 mx-auto">
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center space-x-2 mr-6"
        >
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">GradPilot</span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex items-center justify-between mb-6">
              <Link
                href={isAuthenticated ? "/dashboard" : "/"}
                className="flex items-center space-x-2"
              >
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">GradPilot</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {isAuthenticated ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6 p-4 bg-muted rounded-lg">
                  <Avatar>
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user?.name || "User"}</div>
                    <div className="text-sm text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground mb-2 px-2">
                    Main Navigation
                  </div>
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md text-sm",
                        pathname === item.href ||
                          pathname?.startsWith(`${item.href}/`)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground mb-2 px-2">
                    Resources
                  </div>
                  {resourcesItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center py-2 px-3 rounded-md text-sm text-muted-foreground hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground mb-2 px-2">
                    Account
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center py-2 px-3 rounded-md text-sm text-muted-foreground hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  {/* <Link
                    href="/dashboard/messages"
                    className="flex items-center py-2 px-3 rounded-md text-sm text-muted-foreground hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messages
                    {messages > 0 && (
                      <Badge className="ml-auto" variant="secondary">
                        {messages}
                      </Badge>
                    )}
                  </Link> */}
                  <Link
                    href="/dashboard/notifications"
                    className="flex items-center py-2 px-3 rounded-md text-sm text-muted-foreground hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                    {notifications > 0 && (
                      <Badge className="ml-auto" variant="secondary">
                        {notifications}
                      </Badge>
                    )}
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center py-2 px-3 rounded-md text-sm text-muted-foreground hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </div>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* <div className="space-y-1">
                  <Link
                    href="/features"
                    className="flex items-center py-2 px-3 rounded-md text-sm text-muted-foreground hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    href="/pricing"
                    className="flex items-center py-2 px-3 rounded-md text-sm text-muted-foreground hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center py-2 px-3 rounded-md text-sm text-muted-foreground hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </div> */}

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    className="w-full"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:flex-1">
          {isAuthenticated ? (
            <nav className="flex items-center space-x-4 flex-1 overflow-x-auto scrollbar-hide">
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ||
                      pathname?.startsWith(`${item.href}/`)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center text-sm font-medium"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Resources
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    {resourcesItems.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link href={item.href}>{item.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          ) : (
            <nav className="flex items-center space-x-6 flex-1">
              {/* <Link
                href="/features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Features
              </Link> */}
              {/* <Link
                href="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Link> */}
              {/* <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                About
              </Link> */}
            </nav>
          )}
        </div>

        {/* Search bar - desktop only */}
        {/* <div className="hidden md:flex mx-4 w-full max-w-xs items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[300px]"
            />
          </div>
        </div> */}

        {/* Right side items */}
        <div className="ml-auto flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/dashboard/messages">
                  <MessageSquare className="h-5 w-5" />
                  {messages > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {messages}
                    </Badge>
                  )}
                </Link>
              </Button> */}

              {/* Notification Dropdown */}
              <NotificationMenu userId={user?.userId} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full flex items-center gap-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getAvatarSrc(user)} alt={user?.name} />
                      <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm hidden sm:inline-block">
                      {user?.name || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="cursor-pointer flex items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem asChild>
                          <Link href="/settings/account">Account</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/settings/notifications">
                            Notifications
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/settings/privacy">Privacy</Link>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer flex items-center text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
