// Mock university service

export async function getUniversityMatches() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock successful response
  return [
    {
      id: 1,
      name: "Massachusetts Institute of Technology",
      location: "Cambridge, USA",
      matchScore: 95,
      deadline: "Dec 15, 2025",
      tuition: 53450,
      ranking: 1,
      researchAreas: ["Machine Learning", "Artificial Intelligence", "Robotics"],
    },
    {
      id: 2,
      name: "Stanford University",
      location: "Stanford, USA",
      matchScore: 92,
      deadline: "Dec 1, 2025",
      tuition: 55473,
      ranking: 2,
      researchAreas: ["Natural Language Processing", "Computer Vision", "Data Science"],
    },
    {
      id: 3,
      name: "ETH Zurich",
      location: "Zurich, Switzerland",
      matchScore: 88,
      deadline: "Jan 15, 2026",
      tuition: 1500,
      ranking: 7,
      researchAreas: ["Robotics", "Machine Learning", "Computer Graphics"],
    },
    {
      id: 4,
      name: "University of California, Berkeley",
      location: "Berkeley, USA",
      matchScore: 87,
      deadline: "Dec 8, 2025",
      tuition: 43980,
      ranking: 4,
      researchAreas: ["Artificial Intelligence", "Systems", "Theory"],
    },
    {
      id: 5,
      name: "University of Oxford",
      location: "Oxford, UK",
      matchScore: 85,
      deadline: "Jan 20, 2026",
      tuition: 29700,
      ranking: 5,
      researchAreas: ["Machine Learning", "Quantum Computing", "Algorithms"],
    },
    {
      id: 6,
      name: "Harvard University",
      location: "Cambridge, USA",
      matchScore: 84,
      deadline: "Dec 15, 2025",
      tuition: 51925,
      ranking: 3,
      researchAreas: ["Computational Biology", "Artificial Intelligence", "Data Science"],
    },
    {
      id: 7,
      name: "National University of Singapore",
      location: "Singapore, Singapore",
      matchScore: 82,
      deadline: "Jan 31, 2026",
      tuition: 22500,
      ranking: 11,
      researchAreas: ["Machine Learning", "Computer Vision", "Cybersecurity"],
    },
    {
      id: 8,
      name: "Technical University of Munich",
      location: "Munich, Germany",
      matchScore: 80,
      deadline: "Jan 15, 2026",
      tuition: 0,
      ranking: 17,
      researchAreas: ["Robotics", "Computer Vision", "Artificial Intelligence"],
    },
  ]
}
