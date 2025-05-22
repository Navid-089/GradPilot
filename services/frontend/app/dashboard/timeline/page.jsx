"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, School, FileText, Award, Users, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function TimelinePage() {
  const [filter, setFilter] = useState("all")

  // Dummy timeline data
  const timelineItems = [
    {
      id: 1,
      type: "deadline",
      title: "Stanford University Application Deadline",
      date: "2023-12-15",
      daysLeft: 5,
      description: "Complete and submit your application for the Computer Science program.",
      status: "pending",
      category: "application",
    },
    {
      id: 2,
      type: "document",
      title: "Statement of Purpose Review",
      date: "2023-12-10",
      daysLeft: 0,
      description: "Your SOP has been reviewed by 3 peers. Check the feedback.",
      status: "completed",
      category: "document",
    },
    {
      id: 3,
      type: "university",
      title: "MIT Added to Your List",
      date: "2023-12-08",
      daysLeft: -2,
      description: "You added Massachusetts Institute of Technology to your target universities.",
      status: "completed",
      category: "university",
    },
    {
      id: 4,
      type: "professor",
      title: "Email Prof. Johnson",
      date: "2023-12-20",
      daysLeft: 10,
      description: "Send an introduction email to Professor Johnson at Berkeley.",
      status: "pending",
      category: "professor",
    },
    {
      id: 5,
      type: "scholarship",
      title: "Fulbright Scholarship Deadline",
      date: "2023-12-31",
      daysLeft: 21,
      description: "Complete and submit your Fulbright Scholarship application.",
      status: "pending",
      category: "scholarship",
    },
    {
      id: 6,
      type: "document",
      title: "Resume Updated",
      date: "2023-12-05",
      daysLeft: -5,
      description: "You updated your resume with your recent internship experience.",
      status: "completed",
      category: "document",
    },
    {
      id: 7,
      type: "deadline",
      title: "UC Berkeley Application Deadline",
      date: "2023-12-01",
      daysLeft: -9,
      description: "Application for the Computer Science program submitted successfully.",
      status: "completed",
      category: "application",
    },
  ]

  const filteredItems =
    filter === "all"
      ? timelineItems
      : timelineItems.filter((item) => item.category === filter || item.status === filter)

  const sortedItems = [...filteredItems].sort((a, b) => {
    // Sort by date (most recent first for past events, soonest first for upcoming events)
    if (a.daysLeft < 0 && b.daysLeft < 0) {
      return new Date(b.date) - new Date(a.date)
    }
    if (a.daysLeft >= 0 && b.daysLeft >= 0) {
      return new Date(a.date) - new Date(b.date)
    }
    // Upcoming events before past events
    return a.daysLeft - b.daysLeft
  })

  const getIcon = (type) => {
    switch (type) {
      case "deadline":
        return <Calendar className="h-5 w-5" />
      case "university":
        return <School className="h-5 w-5" />
      case "document":
        return <FileText className="h-5 w-5" />
      case "scholarship":
        return <Award className="h-5 w-5" />
      case "professor":
        return <Users className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  const getStatusBadge = (item) => {
    if (item.status === "completed") {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Completed
        </Badge>
      )
    }

    if (item.daysLeft < 0) {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
          <Clock className="h-3 w-3" /> Past
        </Badge>
      )
    }

    if (item.daysLeft <= 7) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> Urgent
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
        <Clock className="h-3 w-3" /> Upcoming
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
        <p className="text-muted-foreground">Track your application journey and upcoming deadlines</p>
      </div>

      <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
        <TabsList className="grid grid-cols-7 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="application">Applications</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="university">Universities</TabsTrigger>
          <TabsTrigger value="professor">Professors</TabsTrigger>
          <TabsTrigger value="scholarship">Scholarships</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Your Timeline
              </CardTitle>
              <CardDescription>
                {filter === "all"
                  ? "All events and deadlines in your application journey"
                  : `Filtered to show ${filter} items`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-9 top-0 bottom-0 w-px bg-border"></div>

                <div className="space-y-8">
                  {sortedItems.length > 0 ? (
                    sortedItems.map((item) => (
                      <div key={item.id} className="relative flex gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-background z-10">
                          {getIcon(item.type)}
                        </div>
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{item.title}</h3>
                            {getStatusBadge(item)}
                          </div>
                          <time className="text-sm text-muted-foreground">
                            {new Date(item.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                            {item.daysLeft > 0 && ` (${item.daysLeft} days left)`}
                          </time>
                          <p className="mt-1">{item.description}</p>

                          {item.status !== "completed" && item.daysLeft >= 0 && (
                            <div className="mt-2">
                              <Button size="sm" variant="outline">
                                {item.type === "deadline" ? "Submit Application" : "Mark as Complete"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No timeline items found for this filter.</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
