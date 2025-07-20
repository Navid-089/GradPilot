// Mock scholarship service

export async function getScholarships() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock successful response
  return [
    {
      id: 1,
      title: "Fulbright Foreign Student Program",
      provider: "USA Government",
      amount: "Full tuition + stipend",
      deadline: "2025-11-15",
      applyLink: "https://foreign.fulbrightonline.org",
    },
    {
      id: 2,
      title: "DAAD EPOS Scholarships",
      provider: "DAAD",
      amount: "Monthly allowance + travel + insurance",
      deadline: "2025-10-31",
      applyLink: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
    },
    {
      id: 3,
      title: "MIT Presidential Fellowship",
      provider: "MIT",
      amount: "Full tuition + $40,000 stipend",
      deadline: "2025-12-15",
      applyLink: "https://gradadmissions.mit.edu/costs-funding/fellowships",
    },
    {
      id: 4,
      title: "Stanford Graduate Fellowship",
      provider: "Stanford University",
      amount: "Full tuition + $45,000 stipend",
      deadline: "2025-12-01",
      applyLink: "https://vpge.stanford.edu/fellowships-funding/sgf",
    },
    {
      id: 5,
      title: "Gates Cambridge Scholarship",
      provider: "Gates Foundation",
      amount: "Full tuition + maintenance allowance",
      deadline: "2025-12-03",
      applyLink: "https://www.gatescambridge.org/",
    },
    {
      id: 6,
      title: "Chevening Scholarships",
      provider: "UK Government",
      amount: "Full tuition + living expenses",
      deadline: "2025-11-02",
      applyLink: "https://www.chevening.org/",
    },
    {
      id: 7,
      title: "ETH Excellence Scholarship",
      provider: "ETH Zurich",
      amount: "CHF 12,000 + tuition waiver",
      deadline: "2025-12-15",
      applyLink: "https://ethz.ch/en/studies/financial/scholarships/excellencescholarship.html",
    },
    {
      id: 8,
      title: "NUS Graduate School Scholarship",
      provider: "National University of Singapore",
      amount: "Full tuition + S$3,200 monthly stipend",
      deadline: "2026-01-15",
      applyLink:
        "https://www.nus.edu.sg/admissions/graduate-studies/scholarships-financial-aid-and-fees/scholarships-awards/nus-graduate-school-scholarship.html",
    },
  ]
}
