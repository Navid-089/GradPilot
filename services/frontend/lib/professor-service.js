// Mock professor service

export async function getProfessorSuggestions() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Mock successful response
  return [
    {
      id: 1,
      name: "Dr. Tommi Jaakkola",
      university: "MIT",
      email: "tommi@csail.mit.edu",
      googleScholar: "https://scholar.google.com/citations?user=xxxxx",
      labLink: "https://www.csail.mit.edu/person/tommi-jaakkola",
      researchAreas: ["Machine Learning", "Artificial Intelligence", "Statistical Inference"],
      recentPapers: ["Deep Learning for Structured Prediction", "Variational Methods in Machine Learning"],
    },
    {
      id: 2,
      name: "Dr. Fei-Fei Li",
      university: "Stanford University",
      email: "feifeili@stanford.edu",
      googleScholar: "https://scholar.google.com/citations?user=yyyyy",
      labLink: "https://profiles.stanford.edu/fei-fei-li",
      researchAreas: ["Computer Vision", "Machine Learning", "AI for Healthcare"],
      recentPapers: ["Visual Recognition in the Wild", "Large-scale Visual Understanding"],
    },
    {
      id: 3,
      name: "Dr. David Parkes",
      university: "Harvard University",
      email: "parkes@seas.harvard.edu",
      googleScholar: "https://scholar.google.com/citations?user=zzzzz",
      labLink: "https://scholar.harvard.edu/parkes",
      researchAreas: ["AI Economics", "Multi-agent Systems", "Market Design"],
      recentPapers: ["Economic Reasoning and Artificial Intelligence", "Mechanism Design for AI Systems"],
    },
    {
      id: 4,
      name: "Dr. Yisong Yue",
      university: "Caltech",
      email: "yyue@caltech.edu",
      googleScholar: "https://scholar.google.com/citations?user=aaaaa",
      labLink: "https://yisongyue.com",
      researchAreas: ["Machine Learning", "Robotics", "Reinforcement Learning"],
      recentPapers: ["Learning to Optimize", "Interactive Machine Learning"],
    },
    {
      id: 5,
      name: "Dr. Michael Osborne",
      university: "Oxford University",
      email: "michael.osborne@eng.ox.ac.uk",
      googleScholar: "https://scholar.google.com/citations?user=bbbbb",
      labLink: "https://www.cs.ox.ac.uk/people/michael.osborne",
      researchAreas: ["Bayesian Optimization", "Machine Learning", "Probabilistic Methods"],
      recentPapers: ["Gaussian Processes for Global Optimization", "The Future of Work: Automation and Labor Markets"],
    },
    {
      id: 6,
      name: "Dr. Zoubin Ghahramani",
      university: "Cambridge University",
      email: "zoubin@ml.cam.ac.uk",
      googleScholar: "https://scholar.google.com/citations?user=ccccc",
      labLink: "https://www.ml.cam.ac.uk/people/zoubin-ghahramani",
      researchAreas: ["Probabilistic Models", "Bayesian Machine Learning", "Statistical Learning"],
      recentPapers: ["Bayesian Nonparametrics", "Probabilistic Programming"],
    },
    {
      id: 7,
      name: "Dr. Joachim M. Buhmann",
      university: "ETH Zurich",
      email: "joachim.buhmann@inf.ethz.ch",
      googleScholar: "https://scholar.google.com/citations?user=ddddd",
      labLink: "https://people.inf.ethz.ch/buhmann/",
      researchAreas: ["Machine Learning", "Pattern Recognition", "Information Theory"],
      recentPapers: ["Information-theoretic Model Selection", "Clustering and Data Analysis"],
    },
  ]
}
