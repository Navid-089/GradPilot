// Real university service that calls the ML-powered recommendation API

 const API_BASE_URL = "https://gradpilot.me";
// const API_BASE_URL = "http://localhost:8083"; // Use localhost for local development

export async function getUniversityMatches(userEmail = null) {
  try {
    // Get authentication token
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    // Use the authenticated user's email if available
    const email = userEmail || user.email 
    
    console.log('Making API call to:', `${API_BASE_URL}/api/recommendations/universities`)
    console.log('With email:', email)
    console.log('With token:', token ? 'Present' : 'Not present')
    
    // Call the ML-powered university recommendation API
    const response = await fetch(`${API_BASE_URL}/api/recommendations/universities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({
        email: email
      })
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API call failed: ${response.status} - ${response.statusText}`)
      console.error('Error response:', errorText)
      throw new Error(`API call failed: ${response.status} - ${errorText}`)
    }

    const universityRecommendations = await response.json()
    console.log('Received university recommendations:', universityRecommendations)
    
    // Transform the ML API response to match the frontend expected format
    return universityRecommendations.map((rec, index) => ({
      id: rec.id || index + 1,
      name: rec.name,
      address: rec.address,
      country: rec.country,
      matchScore: Math.round((rec.matchScore || 0) * 100), // Convert 0-1 score to percentage
      applicationDeadline: rec.applicationDeadline ? new Date(rec.applicationDeadline).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }) : 'Dec 15, 2025',
      tuitionFees: rec.tuitionFees,
      ranking: rec.ranking,
      description: rec.description,
      websiteUrl: rec.websiteUrl,
      locationUrl: rec.locationUrl,
    }))
  } catch (error) {
    console.error('Error fetching university recommendations:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    
    // Fallback to mock data if API fails
    console.log('Falling back to mock data')
    return getMockUniversityData()
  }
}

// Paginated version of getUniversityMatches with filtering and sorting
export async function getUniversityMatchesPaginated(page = 0, size = 30, filters = {}, sortBy = 'match', searchQuery = '', userEmail = null) {
  try {
    // Get authentication token
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    // Use the authenticated user's email if available
    const email = userEmail || user.email 
    
    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })
    
    // Add search query if provided
    if (searchQuery && searchQuery.trim()) {
      queryParams.append('search', searchQuery.trim())
    }
    
    // Add filters if provided
    if (filters.countries && filters.countries.length > 0) {
      queryParams.append('countries', filters.countries.join(','))
    }
    if (filters.minMatchScore !== undefined && filters.minMatchScore > 0) {
      queryParams.append('minMatchScore', filters.minMatchScore.toString())
    }
    if (filters.maxTuition !== undefined && filters.maxTuition < 100000) {
      queryParams.append('maxTuition', filters.maxTuition.toString())
    }
    
    // Add sorting if provided
    if (sortBy && sortBy !== 'match') {
      queryParams.append('sortBy', sortBy)
    }
    
    console.log('Making paginated API call to:', `${API_BASE_URL}/api/recommendations/universities/paginated`)
    console.log('Page:', page, 'Size:', size, 'Filters:', filters, 'Sort:', sortBy, 'Search:', searchQuery)
    
    if (!token) {
      throw new Error('No authentication token available')
    }
    
    // Call the paginated ML-powered university recommendation API
    const response = await fetch(`${API_BASE_URL}/api/recommendations/universities/paginated?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    console.log('Paginated response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Paginated API call failed: ${response.status} - ${response.statusText}`)
      console.error('Error response:', errorText)
      throw new Error(`Paginated API call failed: ${response.status} - ${errorText}`)
    }

    const paginatedData = await response.json()
    console.log('Received paginated university data:', paginatedData)
    
    // Transform the content to match the frontend expected format
    const transformedContent = paginatedData.content.map((rec, index) => ({
      id: rec.id || (page * size + index + 1),
      name: rec.name,
      address: rec.address,
      country: rec.country,
      matchScore: Math.round((rec.matchScore || 0) * 100), // Convert 0-1 score to percentage
      tuitionFees: rec.tuitionFees,
      ranking: rec.ranking,
      description: rec.description,
      websiteUrl: rec.websiteUrl,
      applicationDeadline: getApplicationDeadline(rec.name),
    }))
    
    return {
      content: transformedContent,
      page: paginatedData.page,
      size: paginatedData.size,
      totalElements: paginatedData.totalElements,
      totalPages: paginatedData.totalPages,
      first: paginatedData.first,
      last: paginatedData.last
    }
  } catch (error) {
    console.error('Error fetching paginated university recommendations:', error)
    
    // Fallback to regular function and manually paginate with filtering and sorting
    console.log('Falling back to manual pagination with full dataset')
    const allUniversities = await getUniversityMatches(userEmail)
    
    // Apply client-side filtering
    let filteredUniversities = allUniversities
    
    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filteredUniversities = filteredUniversities.filter(uni => 
        uni.name.toLowerCase().includes(query) ||
        uni.address.toLowerCase().includes(query) ||
        uni.country.toLowerCase().includes(query)
      )
    }
    
    // Apply country filter
    if (filters.countries && filters.countries.length > 0) {
      filteredUniversities = filteredUniversities.filter(uni => 
        filters.countries.includes(uni.country)
      )
    }
    
    // Apply match score filter
    if (filters.minMatchScore !== undefined && filters.minMatchScore > 0) {
      filteredUniversities = filteredUniversities.filter(uni => 
        uni.matchScore >= filters.minMatchScore
      )
    }
    
    // Apply tuition filter
    if (filters.maxTuition !== undefined && filters.maxTuition < 100000) {
      filteredUniversities = filteredUniversities.filter(uni => 
        uni.tuitionFees <= filters.maxTuition
      )
    }
    
    // Apply sorting
    if (sortBy) {
      filteredUniversities.sort((a, b) => {
        switch (sortBy) {
          case 'ranking':
            return a.ranking - b.ranking
          case 'tuition':
            return a.tuitionFees - b.tuitionFees
          case 'deadline':
            return new Date(a.applicationDeadline) - new Date(b.applicationDeadline)
          case 'match':
          default:
            return b.matchScore - a.matchScore
        }
      })
    }
    
    // Apply pagination
    const startIndex = page * size
    const endIndex = Math.min(startIndex + size, filteredUniversities.length)
    const pageContent = filteredUniversities.slice(startIndex, endIndex)
    
    return {
      content: pageContent,
      page: page,
      size: size,
      totalElements: filteredUniversities.length,
      totalPages: Math.ceil(filteredUniversities.length / size),
      first: page === 0,
      last: endIndex >= filteredUniversities.length
    }
  }
}

// Helper function to get application deadline
function getApplicationDeadline(universityName) {
  // Generate a reasonable deadline based on university tier/ranking
  const deadlineMap = {
    'Massachusetts Institute of Technology': 'Dec 1, 2025',
    'Stanford University': 'Dec 1, 2025',
    'Harvard University': 'Dec 1, 2025',
    'University of California, Berkeley': 'Dec 8, 2025',
    'University of California, Los Angeles': 'Dec 8, 2025',
    'Carnegie Mellon University': 'Dec 15, 2025',
    'University of Michigan': 'Dec 15, 2025',
    'Georgia Institute of Technology': 'Jan 1, 2026',
    'University of Illinois at Urbana-Champaign': 'Jan 1, 2026',
    'University of Texas at Austin': 'Jan 1, 2026',
    'University of Washington': 'Jan 15, 2026',
    'Cornell University': 'Dec 15, 2025',
    'University of Wisconsin-Madison': 'Jan 1, 2026',
    'University of Maryland': 'Jan 15, 2026',
    'Purdue University': 'Jan 15, 2026',
    'University of Pennsylvania': 'Dec 15, 2025',
    'Columbia University': 'Dec 15, 2025',
    'Princeton University': 'Dec 1, 2025',
    'Yale University': 'Dec 1, 2025',
    'Duke University': 'Dec 1, 2025',
    'University of Oxford': 'Jan 20, 2026',
    'University of Cambridge': 'Jan 20, 2026',
    'Imperial College London': 'Jan 20, 2026',
    'ETH Zurich': 'Jan 15, 2026',
    'National University of Singapore': 'Jan 31, 2026',
    'Technical University of Munich': 'Jan 15, 2026',
  }
  
  return deadlineMap[universityName] || 'Dec 15, 2025'
}

// Helper function to extract location from university name
function getLocationFromUniversity(universityName) {
  const locationMap = {
    'Massachusetts Institute of Technology': 'Cambridge, USA',
    'Stanford University': 'Stanford, USA',
    'Harvard University': 'Cambridge, USA',
    'University of California, Berkeley': 'Berkeley, USA',
    'University of California, Los Angeles': 'Los Angeles, USA',
    'Carnegie Mellon University': 'Pittsburgh, USA',
    'University of Michigan': 'Ann Arbor, USA',
    'Georgia Institute of Technology': 'Atlanta, USA',
    'University of Illinois at Urbana-Champaign': 'Urbana, USA',
    'University of Texas at Austin': 'Austin, USA',
    'University of Washington': 'Seattle, USA',
    'Cornell University': 'Ithaca, USA',
    'University of Wisconsin-Madison': 'Madison, USA',
    'University of Maryland': 'College Park, USA',
    'Purdue University': 'West Lafayette, USA',
    'University of Pennsylvania': 'Philadelphia, USA',
    'Columbia University': 'New York, USA',
    'Princeton University': 'Princeton, USA',
    'Yale University': 'New Haven, USA',
    'Duke University': 'Durham, USA',
    'University of Oxford': 'Oxford, UK',
    'University of Cambridge': 'Cambridge, UK',
    'Imperial College London': 'London, UK',
    'ETH Zurich': 'Zurich, Switzerland',
    'National University of Singapore': 'Singapore, Singapore',
    'Technical University of Munich': 'Munich, Germany',
  }
  
  return locationMap[universityName] || 'Unknown Location'
}

// Helper function to generate deadline based on category
function getDeadlineForCategory(category) {
  const deadlines = {
    'reach': 'Dec 1, 2025',
    'match': 'Dec 15, 2025', 
    'safety': 'Jan 15, 2026'
  }
  return deadlines[category] || 'Dec 15, 2025'
}

// Helper function to get tuition for university
function getTuitionForUniversity(universityName) {
  const tuitionMap = {
    'Massachusetts Institute of Technology': 53450,
    'Stanford University': 55473,
    'Harvard University': 51925,
    'University of California, Berkeley': 43980,
    'University of California, Los Angeles': 42984,
    'Carnegie Mellon University': 58000,
    'University of Michigan': 52000,
    'Georgia Institute of Technology': 33000,
    'University of Illinois at Urbana-Champaign': 35000,
    'University of Texas at Austin': 40000,
    'University of Washington': 39000,
    'Cornell University': 59000,
    'University of Wisconsin-Madison': 38000,
    'University of Maryland': 36000,
    'Purdue University': 29000,
    'University of Pennsylvania': 61000,
    'Columbia University': 62000,
    'Princeton University': 56000,
    'Yale University': 59000,
    'Duke University': 60000,
    'University of Oxford': 29700,
    'University of Cambridge': 30000,
    'Imperial College London': 35000,
    'ETH Zurich': 1500,
    'National University of Singapore': 22500,
    'Technical University of Munich': 0,
  }
  
  return tuitionMap[universityName] || 45000
}

// Helper function to get ranking for university
function getRankingForUniversity(universityName) {
  const rankingMap = {
    'Massachusetts Institute of Technology': 1,
    'Stanford University': 2,
    'Harvard University': 3,
    'University of California, Berkeley': 4,
    'University of California, Los Angeles': 5,
    'Carnegie Mellon University': 6,
    'University of Michigan': 7,
    'Georgia Institute of Technology': 8,
    'University of Illinois at Urbana-Champaign': 9,
    'University of Texas at Austin': 10,
    'University of Washington': 11,
    'Cornell University': 12,
    'University of Wisconsin-Madison': 13,
    'University of Maryland': 14,
    'Purdue University': 15,
    'University of Pennsylvania': 16,
    'Columbia University': 17,
    'Princeton University': 18,
    'Yale University': 19,
    'Duke University': 20,
    'University of Oxford': 5,
    'University of Cambridge': 6,
    'Imperial College London': 7,
    'ETH Zurich': 7,
    'National University of Singapore': 11,
    'Technical University of Munich': 17,
  }
  
  return rankingMap[universityName] || 25
}

// Helper function to get research areas for university
function getResearchAreasForUniversity(universityName) {
  const researchAreasMap = {
    'Massachusetts Institute of Technology': ['Machine Learning', 'Artificial Intelligence', 'Robotics'],
    'Stanford University': ['Natural Language Processing', 'Computer Vision', 'Data Science'],
    'Harvard University': ['Computational Biology', 'Artificial Intelligence', 'Data Science'],
    'University of California, Berkeley': ['Artificial Intelligence', 'Systems', 'Theory'],
    'University of California, Los Angeles': ['Machine Learning', 'Computer Vision', 'Data Science'],
    'Carnegie Mellon University': ['Machine Learning', 'Robotics', 'Computer Vision'],
    'University of Michigan': ['Machine Learning', 'Computer Vision', 'Systems'],
    'Georgia Institute of Technology': ['Machine Learning', 'Robotics', 'Computer Vision'],
    'University of Illinois at Urbana-Champaign': ['Machine Learning', 'Computer Vision', 'Systems'],
    'University of Texas at Austin': ['Machine Learning', 'Computer Vision', 'Data Science'],
    'University of Washington': ['Machine Learning', 'Computer Vision', 'Systems'],
    'Cornell University': ['Machine Learning', 'Computer Vision', 'Theory'],
    'University of Wisconsin-Madison': ['Machine Learning', 'Computer Vision', 'Systems'],
    'University of Maryland': ['Machine Learning', 'Computer Vision', 'Cybersecurity'],
    'Purdue University': ['Machine Learning', 'Computer Vision', 'Systems'],
    'University of Pennsylvania': ['Machine Learning', 'Computer Vision', 'Data Science'],
    'Columbia University': ['Machine Learning', 'Computer Vision', 'Data Science'],
    'Princeton University': ['Machine Learning', 'Theory', 'Algorithms'],
    'Yale University': ['Machine Learning', 'Computer Vision', 'Data Science'],
    'Duke University': ['Machine Learning', 'Computer Vision', 'Data Science'],
    'University of Oxford': ['Machine Learning', 'Quantum Computing', 'Algorithms'],
    'University of Cambridge': ['Machine Learning', 'Computer Vision', 'Theory'],
    'Imperial College London': ['Machine Learning', 'Computer Vision', 'Robotics'],
    'ETH Zurich': ['Robotics', 'Machine Learning', 'Computer Graphics'],
    'National University of Singapore': ['Machine Learning', 'Computer Vision', 'Cybersecurity'],
    'Technical University of Munich': ['Robotics', 'Computer Vision', 'Artificial Intelligence'],
  }
  
  return researchAreasMap[universityName] || ['Machine Learning', 'Computer Vision', 'Data Science']
}

// Helper function to get default description for university
function getDefaultDescription(universityName) {
  const descriptionMap = {
    'Massachusetts Institute of Technology': 'A world-renowned institution known for cutting-edge research in technology and engineering.',
    'Stanford University': 'Leading research university with strong programs in computer science and artificial intelligence.',
    'Harvard University': 'Ivy League institution with excellence across all academic disciplines.',
    'University of California, Berkeley': 'Premier public research university with strong engineering and computer science programs.',
    'University of California, Los Angeles': 'Top-ranked public university with diverse academic offerings.',
    'Carnegie Mellon University': 'Renowned for computer science, robotics, and engineering programs.',
    'University of Michigan': 'Leading public research university with strong graduate programs.',
    'Georgia Institute of Technology': 'Premier engineering and technology institution.',
    'University of Illinois at Urbana-Champaign': 'Top-ranked public university with excellent computer science programs.',
    'University of Texas at Austin': 'Flagship public university with strong research programs.',
    'University of Washington': 'Leading research university in the Pacific Northwest.',
    'Cornell University': 'Ivy League institution with world-class research facilities.',
    'University of Wisconsin-Madison': 'Premier public research university with strong graduate programs.',
    'University of Maryland': 'Leading public research university with excellent computer science programs.',
    'Purdue University': 'Renowned engineering and technology institution.',
    'University of Pennsylvania': 'Ivy League institution with strong professional programs.',
    'Columbia University': 'Ivy League institution in the heart of New York City.',
    'Princeton University': 'Ivy League institution known for research excellence.',
    'Yale University': 'Ivy League institution with world-class academic programs.',
    'Duke University': 'Premier private research university with strong graduate programs.',
    'University of Oxford': 'World-renowned British institution with centuries of academic excellence.',
    'University of Cambridge': 'Historic British university with outstanding research programs.',
    'Imperial College London': 'Leading British institution for science, engineering, and medicine.',
    'ETH Zurich': 'Premier Swiss institution for science and technology.',
    'National University of Singapore': 'Leading Asian university with strong research programs.',
    'Technical University of Munich': 'Premier German institution for engineering and technology.',
  }
  
  return descriptionMap[universityName] || 'A prestigious institution with excellent academic programs and research opportunities.'
}

// Helper function to get default website URL for university
function getDefaultWebsiteUrl(universityName) {
  const websiteMap = {
    'Massachusetts Institute of Technology': 'https://web.mit.edu',
    'Stanford University': 'https://www.stanford.edu',
    'Harvard University': 'https://www.harvard.edu',
    'University of California, Berkeley': 'https://www.berkeley.edu',
    'University of California, Los Angeles': 'https://www.ucla.edu',
    'Carnegie Mellon University': 'https://www.cmu.edu',
    'University of Michigan': 'https://www.umich.edu',
    'Georgia Institute of Technology': 'https://www.gatech.edu',
    'University of Illinois at Urbana-Champaign': 'https://illinois.edu',
    'University of Texas at Austin': 'https://www.utexas.edu',
    'University of Washington': 'https://www.washington.edu',
    'Cornell University': 'https://www.cornell.edu',
    'University of Wisconsin-Madison': 'https://www.wisc.edu',
    'University of Maryland': 'https://www.umd.edu',
    'Purdue University': 'https://www.purdue.edu',
    'University of Pennsylvania': 'https://www.upenn.edu',
    'Columbia University': 'https://www.columbia.edu',
    'Princeton University': 'https://www.princeton.edu',
    'Yale University': 'https://www.yale.edu',
    'Duke University': 'https://www.duke.edu',
    'University of Oxford': 'https://www.ox.ac.uk',
    'University of Cambridge': 'https://www.cam.ac.uk',
    'Imperial College London': 'https://www.imperial.ac.uk',
    'ETH Zurich': 'https://ethz.ch',
    'National University of Singapore': 'https://www.nus.edu.sg',
    'Technical University of Munich': 'https://www.tum.de',
  }
  
  return websiteMap[universityName] || 'https://example.edu'
}

// Fallback mock data function
function getMockUniversityData() {
  return [
    {
      id: 1,
      name: "Massachusetts Institute of Technology",
      address: "Cambridge, USA",
      country: "United States",
      matchScore: 95,
      applicationDeadline: "Dec 15, 2025",
      tuitionFees: 53450,
      ranking: 1,
      description: "A world-renowned institution known for cutting-edge research in technology and engineering.",
      websiteUrl: "https://web.mit.edu",
      locationUrl: "https://maps.google.com/maps?q=42.360001,-71.094003&hl=en&z=18&output=embed",
    },
    {
      id: 2,
      name: "Stanford University",
      address: "Stanford, USA",
      country: "United States",
      matchScore: 92,
      applicationDeadline: "Dec 1, 2025",
      tuitionFees: 55473,
      ranking: 2,
      description: "Leading research university with strong programs in computer science and artificial intelligence.",
      websiteUrl: "https://www.stanford.edu",
      locationUrl: "https://maps.google.com/maps?q=37.427475,-122.169719&hl=en&z=18&output=embed",
    },
    {
      id: 3,
      name: "ETH Zurich",
      address: "Zurich, Switzerland",
      country: "Switzerland",
      matchScore: 88,
      applicationDeadline: "Jan 15, 2026",
      tuitionFees: 1500,
      ranking: 7,
      description: "Premier Swiss institution for science and technology.",
      websiteUrl: "https://ethz.ch",
      locationUrl: "https://maps.google.com/maps?q=47.376888,8.547994&hl=en&z=18&output=embed",
    },
    {
      id: 4,
      name: "University of California, Berkeley",
      address: "Berkeley, USA",
      country: "United States",
      matchScore: 87,
      applicationDeadline: "Dec 8, 2025",
      tuitionFees: 43980,
      ranking: 4,
      description: "Premier public research university with strong engineering and computer science programs.",
      websiteUrl: "https://www.berkeley.edu",
      locationUrl: "https://maps.google.com/maps?q=37.871853,-122.258423&hl=en&z=18&output=embed",
    },
    {
      id: 5,
      name: "University of Oxford",
      address: "Oxford, UK",
      country: "United Kingdom",
      matchScore: 85,
      applicationDeadline: "Jan 20, 2026",
      tuitionFees: 29700,
      ranking: 5,
      description: "World-renowned British institution with centuries of academic excellence.",
      websiteUrl: "https://www.ox.ac.uk",
      locationUrl: "https://maps.google.com/maps?q=51.754816,-1.254434&hl=en&z=18&output=embed",
    },
    {
      id: 6,
      name: "Harvard University",
      address: "Cambridge, USA",
      country: "United States",
      matchScore: 84,
      applicationDeadline: "Dec 15, 2025",
      tuitionFees: 51925,
      ranking: 3,
      description: "Ivy League institution with excellence across all academic disciplines.",
      websiteUrl: "https://www.harvard.edu",
      locationUrl: "https://maps.google.com/maps?q=42.374444,-71.116944&hl=en&z=18&output=embed",
    },
    {
      id: 7,
      name: "National University of Singapore",
      address: "Singapore, Singapore",
      country: "Singapore",
      matchScore: 82,
      applicationDeadline: "Jan 31, 2026",
      tuitionFees: 22500,
      ranking: 11,
      description: "Leading Asian university with strong research programs.",
      websiteUrl: "https://www.nus.edu.sg",
      locationUrl: "https://maps.google.com/maps?q=1.296568,103.776199&hl=en&z=18&output=embed",
    },
    {
      id: 8,
      name: "Technical University of Munich",
      address: "Munich, Germany",
      country: "Germany",
      matchScore: 80,
      applicationDeadline: "Jan 15, 2026",
      tuitionFees: 0,
      ranking: 17,
      description: "Premier German institution for engineering and technology.",
      websiteUrl: "https://www.tum.de",
      locationUrl: "https://maps.google.com/maps?q=48.149777,11.568478&hl=en&z=18&output=embed",
    },
  ]
}
