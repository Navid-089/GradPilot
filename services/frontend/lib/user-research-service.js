/**
 * Service to get user's research interests from the backend
 */

export async function getUserResearchInterests() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch('http://localhost:8083/api/user/research-interests', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.map(interest => interest.name) // Extract just the names
  } catch (error) {
    console.error('Error fetching user research interests:', error)
    // Fallback to mock data if API fails
    return ["Machine Learning", "Natural Language Processing", "Computer Vision"]
  }
}
