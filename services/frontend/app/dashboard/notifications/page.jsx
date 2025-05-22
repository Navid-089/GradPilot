"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  Calendar,
  FileText,
  School,
  Users,
  Award,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  X,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(dummyNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.category === activeTab
  })

  const getIcon = (category) => {
    switch (category) {
      case "application":
        return <FileText className="h-5 w-5" />
      case "deadline":
        return <Calendar className="h-5 w-5" />
      case "university":
        return <School className="h-5 w-5" />
      case "professor":
        return <Users className="h-5 w-5" />
      case "scholarship":
        return <Award className="h-5 w-5" />
      case "message":
        return <MessageSquare className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getStatusIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "No new notifications"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTab("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("unread")}>Unread</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTab("application")}>Applications</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("deadline")}>Deadlines</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("university")}>Universities</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("professor")}>Professors</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("scholarship")}>Scholarships</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("message")}>Messages</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={clearAllNotifications}>
            Clear All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full overflow-x-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="application">Applications</TabsTrigger>
          <TabsTrigger value="deadline">Deadlines</TabsTrigger>
          <TabsTrigger value="university">Universities</TabsTrigger>
          <TabsTrigger value="professor">Professors</TabsTrigger>
          <TabsTrigger value="scholarship">Scholarships</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all ${!notification.read ? "border-l-4 border-l-primary" : ""}`}
                >
                  <CardHeader className="p-4 pb-2 flex flex-col sm:flex-row items-start justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-start space-x-4">
                      <div className={`rounded-full p-2 ${notification.read ? "bg-muted" : "bg-primary/10"}`}>
                        {getIcon(notification.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold">{notification.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">{notification.message}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{notification.category}</Badge>
                        {notification.type && (
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(notification.type)}
                            <span className="capitalize">{notification.type}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{notification.time}</span>
                      </div>
                    </div>
                  </CardContent>
                  {notification.actionLink && (
                    <CardFooter className="p-4 pt-0">
                      <Button variant="link" className="p-0 h-auto" asChild>
                        <Link href={notification.actionLink}>{notification.actionText || "View Details"}</Link>
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-muted-foreground mt-1">
                {activeTab === "all"
                  ? "You don't have any notifications yet."
                  : `You don't have any ${activeTab} notifications.`}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

const dummyNotifications = [
  {
    id: 1,
    title: "Application Deadline Approaching",
    message: "Your Stanford University application is due in 3 days. Make sure to complete all required documents.",
    category: "deadline",
    type: "warning",
    time: "2 hours ago",
    read: false,
    actionLink: "/dashboard/universities/stanford",
    actionText: "Complete Application",
  },
  {
    id: 2,
    title: "New Message from Professor",
    message: "Dr. Sarah Johnson from MIT has responded to your inquiry about research opportunities.",
    category: "message",
    type: "info",
    time: "Yesterday",
    read: false,
    actionLink: "/dashboard/messages/12345",
    actionText: "Read Message",
  },
  {
    id: 3,
    title: "Application Submitted Successfully",
    message:
      "Your application to UC Berkeley has been successfully submitted. You will receive a confirmation email shortly.",
    category: "application",
    type: "success",
    time: "2 days ago",
    read: true,
    actionLink: "/dashboard/applications/berkeley",
  },
  {
    id: 4,
    title: "New Scholarship Opportunity",
    message: "You may be eligible for the Global Graduate Fellowship. The application deadline is January 15, 2024.",
    category: "scholarship",
    type: "info",
    time: "3 days ago",
    read: false,
    actionLink: "/dashboard/scholarships/global-fellowship",
  },
  {
    id: 5,
    title: "University Added to Your List",
    message: "Carnegie Mellon University has been added to your list of target schools.",
    category: "university",
    type: "success",
    time: "1 week ago",
    read: true,
    actionLink: "/dashboard/universities/carnegie-mellon",
  },
  {
    id: 6,
    title: "Professor Match Found",
    message:
      "We've found a professor at Georgia Tech whose research interests align with yours: Dr. Michael Chen, AI and Machine Learning.",
    category: "professor",
    type: "info",
    time: "1 week ago",
    read: true,
    actionLink: "/dashboard/professors/michael-chen",
  },
  {
    id: 7,
    title: "Document Upload Failed",
    message: "Your transcript upload failed due to file format issues. Please upload a PDF file under 5MB.",
    category: "application",
    type: "error",
    time: "1 week ago",
    read: false,
    actionLink: "/profile/documents",
  },
  {
    id: 8,
    title: "Profile Completion Reminder",
    message: "Your profile is 75% complete. Add your research interests to improve university matching.",
    category: "application",
    type: "info",
    time: "2 weeks ago",
    read: true,
    actionLink: "/profile",
  },
]
