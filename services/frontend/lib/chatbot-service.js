// Mock chatbot service

export async function askChatbot(question) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock responses based on keywords in the question
  const lowerQuestion = question.toLowerCase()
  let response = ""

  if (lowerQuestion.includes("gre") || lowerQuestion.includes("test score")) {
    response =
      "Most top graduate programs in the US require GRE scores. For competitive computer science programs, aim for 165+ in Quantitative, 155+ in Verbal, and 4.0+ in Analytical Writing. However, many universities are now making GRE optional, so check each program's requirements."
  } else if (lowerQuestion.includes("sop") || lowerQuestion.includes("statement of purpose")) {
    response =
      "A strong Statement of Purpose should include: 1) Your research interests and why they matter, 2) Your relevant experience and accomplishments, 3) Why this specific program is a good fit for you, and 4) Your future career goals. Keep it concise (usually 1-2 pages) and tailor it for each university."
  } else if (lowerQuestion.includes("professor") || lowerQuestion.includes("contact")) {
    response =
      "When contacting professors, do your research first. Read their recent papers and visit their lab website. In your email, be specific about why you're interested in their work, mention relevant experience, and ask thoughtful questions about their research. Keep it concise and professional."
  } else if (lowerQuestion.includes("scholarship") || lowerQuestion.includes("funding")) {
    response =
      "For graduate school funding, look into: 1) University fellowships and assistantships, 2) Government scholarships like Fulbright, 3) Private foundation grants, 4) Research grants from professors, and 5) External scholarships specific to your field. Apply early as many have deadlines 9-12 months before programs start."
  } else if (lowerQuestion.includes("deadline") || lowerQuestion.includes("timeline")) {
    response =
      "For Fall 2026 admission, a typical timeline would be: 1) Start researching programs now, 2) Take GRE by August 2025, 3) Contact potential advisors September-October 2025, 4) Prepare applications October-November 2025, 5) Submit applications December 2025-January 2026, 6) Decisions typically arrive February-April 2026."
  } else if (lowerQuestion.includes("mit") || lowerQuestion.includes("massachusetts")) {
    response =
      "MIT is indeed excellent for AI research, particularly through its Computer Science and Artificial Intelligence Laboratory (CSAIL). The program is highly competitive with an acceptance rate of about 4-7% for CS PhD programs. Strong applicants typically have research experience, publications, and excellent recommendation letters from research mentors."
  } else {
    response =
      "That's a great question about graduate school applications. While I don't have a specific answer prepared, I recommend checking the university's official website or contacting their admissions office directly. You can also explore the resources in GradPilot's University Matches and Professor Explorer sections for more information."
  }

  // Mock successful response
  return {
    response: response,
  }
}
