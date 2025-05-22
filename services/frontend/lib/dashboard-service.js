// Mock dashboard service

export async function getDashboardData() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Mock successful response
  return {
    progress: {
      overall: 45,
      universities: 60,
      professors: 30,
      documents: 20,
      scholarships: 70,
    },
    upcomingDeadlines: [
      {
        title: "MIT Application",
        institution: "Massachusetts Institute of Technology",
        date: "2025-12-15",
        daysLeft: 30,
      },
      {
        title: "Stanford Application",
        institution: "Stanford University",
        date: "2025-12-01",
        daysLeft: 15,
      },
      {
        title: "Fulbright Scholarship",
        institution: "Fulbright Commission",
        date: "2025-11-15",
        daysLeft: 5,
      },
    ],
    recentActivity: [
      {
        type: "university",
        title: "Saved MIT to your list",
        timestamp: "2 hours ago",
        color: "blue",
      },
      {
        type: "professor",
        title: "Viewed Dr. Jane Smith's profile",
        timestamp: "Yesterday",
        color: "green",
      },
      {
        type: "document",
        title: "Updated your Statement of Purpose",
        timestamp: "3 days ago",
        color: "yellow",
      },
      {
        type: "scholarship",
        title: "Applied to Fulbright Scholarship",
        timestamp: "1 week ago",
        color: "purple",
      },
    ],
    universityMatches: [
      {
        id: 1,
        name: "Massachusetts Institute of Technology",
        location: "Cambridge, USA",
        matchScore: 95,
        deadline: "Dec 15, 2025",
      },
      {
        id: 2,
        name: "Stanford University",
        location: "Stanford, USA",
        matchScore: 92,
        deadline: "Dec 1, 2025",
      },
      {
        id: 3,
        name: "ETH Zurich",
        location: "Zurich, Switzerland",
        matchScore: 88,
        deadline: "Jan 15, 2026",
      },
    ],
  }
}
