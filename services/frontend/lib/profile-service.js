// Mock profile service

export async function updateProfile(profileData) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock validation
  if (!profileData.gpa) {
    throw new Error("GPA is required")
  }

  // Mock successful response
  return {
    message: "Profile updated successfully",
  }
}

export async function getProfile() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock successful response
  return {
    name: "John Doe",
    email: "john@example.com",
    gpa: 3.8,
    testScores: {
      GRE: "320",
      IELTS: "7.5",
    },
    targetCountries: ["USA", "Canada"],
    targetMajors: ["Computer Science", "AI"],
    researchInterests: ["Machine Learning", "NLP"],
    deadlineYear: 2026,
  }
}
