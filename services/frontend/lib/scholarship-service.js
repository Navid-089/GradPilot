// Real scholarship service that calls the backend API

// const API_BASE_URL = 'http://localhost:8083';
const API_BASE_URL = "https://gradpilot.me/api";

export async function getScholarships() {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return {
        needsSubscription: true,
        message: "Please log in to access scholarships",
        requiresLogin: true,
        scholarshipsCount: 0
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/recommendations/scholarships`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        return {
          needsSubscription: true,
          message: "Please log in to access scholarships",
          requiresLogin: true,
          scholarshipsCount: 0
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("=== SCHOLARSHIP SERVICE DEBUG ===")
    console.log("Raw response from backend:", data)
    
    // Check if subscription is required
    if (data.needsSubscription) {
      console.log("Subscription required response received")
      return data
    }
    
    // If we get here, we have actual scholarship data
    const scholarships = data
    console.log("Raw scholarships from backend:", scholarships)
    
    // Log deadline information specifically
    scholarships.forEach(scholarship => {
      console.log(`Scholarship ID ${scholarship.id}: deadline = "${scholarship.deadline}"`)
    })
    
    // Transform backend data to match frontend expectations
    const transformedScholarships = scholarships.map(scholarship => {
      // Map provider based on university or default to the scholarship name prefix
      let provider = 'External Provider'
      
      if (scholarship.university && scholarship.university.name) {
        // If it's a university-specific scholarship, use "University Specific" as provider
        // This allows filtering by "University Specific" to work
        provider = 'University Specific'
      } else {
        // For external scholarships, extract provider from name or use known mappings
        const name = scholarship.name.toLowerCase()
        if (name.includes('fulbright')) {
          provider = 'USA Government'
        } else if (name.includes('daad')) {
          provider = 'DAAD'
        } else if (name.includes('gates cambridge')) {
          provider = 'Gates Foundation'
        } else if (name.includes('chevening')) {
          provider = 'UK Government'
        } else if (name.includes('commonwealth')) {
          provider = 'Government'
        } else if (name.includes('erasmus')) {
          provider = 'European Union'
        } else if (name.includes('tsinghua')) {
          provider = 'Tsinghua University'
        } else if (name.includes('peking') || name.includes('pku')) {
          provider = 'Peking University'
        } else if (name.includes('imperial')) {
          provider = 'Imperial College London'
        } else if (name.includes('edinburgh')) {
          provider = 'University of Edinburgh'
        } else {
          // Try to extract from the scholarship name or use 'Private Foundation'
          provider = 'Private Foundation'
        }
      }
      
      const transformedScholarship = {
        id: scholarship.id,
        title: scholarship.name,
        provider: provider,
        universityName: scholarship.university ? scholarship.university.name : null, // Keep university name for display
        amount: scholarship.coverage || 'Contact for details',
        deadline: scholarship.deadline || '2025-12-31', // Use real deadline from backend
        applyLink: scholarship.applyLink || '#',
        description: scholarship.description || 'No description available',
        eligibility: scholarship.eligibility || 'Contact for eligibility details'
      }
      
      console.log(`Transformed scholarship ${scholarship.id}: deadline = "${transformedScholarship.deadline}"`)
      return transformedScholarship
    })
    
    console.log("Transformed scholarships:", transformedScholarships)
    console.log("Unique providers:", [...new Set(transformedScholarships.map(s => s.provider))])
    
    return transformedScholarships
  } catch (error) {
    console.error('Error fetching scholarships:', error)
    // Don't fall back to mock data - instead return subscription required
    return {
      needsSubscription: true,
      message: "Unable to load scholarships. Please try again or contact support.",
      scholarshipsCount: 0
    }
  }
}

export async function getScholarshipById(id) {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/api/recommendations/scholarships/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const scholarship = await response.json()
    
    // Transform backend data to match frontend expectations
    return {
      id: scholarship.id,
      title: scholarship.name,
      provider: scholarship.university ? scholarship.university.name : 'External Provider',
      amount: scholarship.coverage || 'Contact for details',
      deadline: '2025-12-31', // Default deadline
      applyLink: scholarship.applyLink || '#',
      description: scholarship.description || 'No description available',
      eligibility: scholarship.eligibility || 'Contact for eligibility details'
    }
  } catch (error) {
    console.error('Error fetching scholarship:', error)
    throw error
  }
}

// Mock data as fallback
function getMockScholarships() {
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
