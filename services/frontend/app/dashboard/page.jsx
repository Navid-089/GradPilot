"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { School, Users, Award, Calendar, FileText, ArrowRight, Bell } from "lucide-react"
import { getDashboardData } from "@/lib/dashboard-service"
import { useNotification } from "@/components/notification/notification-provider"

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showNotification } = useNotification()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData()
        setDashboardData(data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    // Show a welcome notification when the dashboard loads
    showNotification("Welcome to your GradPilot dashboard!", "info")
  }, [showNotification])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-10">
        <p>Could not load dashboard data. Please try again later.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your graduate school application journey.
          </p>
        </div>
        {/* <Button asChild>
          <Link href="/universities">
            Find Universities
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button> */}
      </div>

      {/* Application Progress */}
      {/* <Card>
        <CardHeader className="pb-2">
          <CardTitle>Application Progress</CardTitle>
          <CardDescription>
            Your overall application progress is {dashboardData.progress.overall}% complete
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={dashboardData.progress.overall} className="h-2 mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <ProgressCard
              title="Universities"
              value={dashboardData.progress.universities}
              icon={<School className="h-5 w-5" />}
              href="/universities"
            />
            <ProgressCard
              title="Professors"
              value={dashboardData.progress.professors}
              icon={<Users className="h-5 w-5" />}
              href="/research"
            />
            <ProgressCard
              title="SOP Review"
              value={dashboardData.progress.sop || 0}
              icon={<FileText className="h-5 w-5" />}
              href="/dashboard/sop-review"
            />
            <ProgressCard
              title="Documents"
              value={dashboardData.progress.documents}
              icon={<FileText className="h-5 w-5" />}
              href="/dashboard/peer-review"
            />
            <ProgressCard
              title="Scholarships"
              value={dashboardData.progress.scholarships}
              icon={<Award className="h-5 w-5" />}
              href="/dashboard/scholarships"
            />
          </div>
        </CardContent>
      </Card> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.upcomingDeadlines.length > 0 ? (
                dashboardData.upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{deadline.title}</p>
                      <p className="text-sm text-muted-foreground">{deadline.institution}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={getDeadlineVariant(deadline.daysLeft)}>{deadline.daysLeft} days left</Badge>
                      <p className="text-sm text-muted-foreground mt-1">{deadline.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No upcoming deadlines.</p>
              )}
            </div>

            <div className="mt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/timeline">
                  View All Deadlines
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`rounded-full p-2 bg-${activity.color}-100`}>{getActivityIcon(activity.type)}</div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No recent activity.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SOP Review Feature Highlight */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Statement of Purpose Review
          </CardTitle>
          <CardDescription>
            Get AI-powered feedback on your SOP to improve grammar, style, and clarity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                • Grammar and spelling check
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                • Style and clarity suggestions
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                • Professional writing tips
              </p>
            </div>
            <div className="text-right">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                New Feature
              </Badge>
            </div>
          </div>
          <Button asChild className="w-full">
            <Link href="/dashboard/sop-review">
              Review My SOP
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* University Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <School className="mr-2 h-5 w-5" />
            Top University Matches
          </CardTitle>
          <CardDescription>Based on your profile, these universities are a good match for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.universityMatches.length > 0 ? (
              dashboardData.universityMatches.map((university, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <School className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{university.name}</p>
                      <p className="text-sm text-muted-foreground">{university.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-green-50">
                      {university.matchScore}% Match
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">Deadline: {university.deadline}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No university matches found.</p>
            )}
          </div>

          <div className="mt-4">
            <Button asChild className="w-full">
              <Link href="/universities">
                View All Matches
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProgressCard({ title, value, icon, href }) {
  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h3>
        <span className="text-sm font-medium">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5 mb-2" />
      <Link href={href} className="text-sm text-primary hover:underline flex items-center">
        View details
        <ArrowRight className="ml-1 h-3 w-3" />
      </Link>
    </div>
  )
}

function getDeadlineVariant(daysLeft) {
  if (daysLeft <= 7) return "destructive"
  if (daysLeft <= 30) return "warning"
  return "outline"
}

function getActivityIcon(type) {
  switch (type) {
    case "university":
      return <School className="h-4 w-4" />
    case "professor":
      return <Users className="h-4 w-4" />
    case "scholarship":
      return <Award className="h-4 w-4" />
    case "document":
      return <FileText className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}
