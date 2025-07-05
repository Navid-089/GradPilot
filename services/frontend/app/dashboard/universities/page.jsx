"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { School, Search, MapPin, Calendar, DollarSign, GraduationCap, Star, StarHalf, BookOpen } from "lucide-react"
import { getUniversityMatches } from "@/lib/university-service"
import { trackerService } from "@/lib/tracker-service"
import { useAuth } from "@/lib/auth-context"

export default function UniversitiesPage() {
  const { isAuthenticated, user } = useAuth()
  console.log("UniversitiesPage - isAuthenticated:", isAuthenticated, "user:", user)
  const [universities, setUniversities] = useState([])
  const [filteredUniversities, setFilteredUniversities] = useState([])
  const [savedUniversities, setSavedUniversities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const [filters, setFilters] = useState({
    countries: [],
    minMatchScore: 0,
    maxTuition: 50000,
    researchAreas: [],
    categories: [], // Add categories filter
  })

  const countries = ["USA", "UK", "Canada", "Germany", "Australia", "Singapore", "Japan"]
  const categories = ["reach", "match", "safety"]
  const researchAreas = [
    "Machine Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Robotics",
    "Bioinformatics",
    "Quantum Computing",
    "Cybersecurity",
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUniversityMatches()
        console.log("Fetched university data:", data)
        setUniversities(data)
        setFilteredUniversities(data)
        
        // Fetch saved universities
        const savedTasks = await trackerService.getUserTasksByType('university')
        const savedUniIds = savedTasks.map(task => task.universityId)
        const savedUnis = data.filter(uni => savedUniIds.includes(uni.id))
        setSavedUniversities(savedUnis)
      } catch (error) {
        console.error("Error fetching university data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Apply filters and search
    let result = [...universities]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (uni) => uni.name.toLowerCase().includes(query) || uni.location.toLowerCase().includes(query),
      )
    }

    // Apply country filter
    if (filters.countries.length > 0) {
      result = result.filter((uni) => {
        const country = uni.location.split(", ").pop()
        return filters.countries.includes(country)
      })
    }

    // Apply match score filter
    result = result.filter((uni) => uni.matchScore >= filters.minMatchScore)

    // Apply tuition filter
    result = result.filter((uni) => uni.tuition <= filters.maxTuition)

    // Apply research areas filter
    if (filters.researchAreas.length > 0) {
      result = result.filter((uni) => uni.researchAreas.some((area) => filters.researchAreas.includes(area)))
    }

    // Apply categories filter
    if (filters.categories.length > 0) {
      result = result.filter((uni) => filters.categories.includes(uni.category))
    }

    setFilteredUniversities(result)
  }, [searchQuery, filters, universities])

  const handleCountryChange = (country) => {
    setFilters((prev) => {
      const updatedCountries = prev.countries.includes(country)
        ? prev.countries.filter((c) => c !== country)
        : [...prev.countries, country]

      return {
        ...prev,
        countries: updatedCountries,
      }
    })
  }

  const handleResearchAreaChange = (area) => {
    setFilters((prev) => {
      const updatedAreas = prev.researchAreas.includes(area)
        ? prev.researchAreas.filter((a) => a !== area)
        : [...prev.researchAreas, area]

      return {
        ...prev,
        researchAreas: updatedAreas,
      }
    })
  }

  const handleCategoryChange = (category) => {
    setFilters((prev) => {
      const updatedCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]

      return {
        ...prev,
        categories: updatedCategories,
      }
    })
  }

  const resetFilters = () => {
    setFilters({
      countries: [],
      minMatchScore: 0,
      maxTuition: 50000,
      researchAreas: [],
      categories: [],
    })
    setSearchQuery("")
  }

  const handleUniversitySaveToggle = (university, isSaved) => {
    if (isSaved) {
      // Add to saved universities if not already there
      setSavedUniversities(prev => {
        if (!prev.find(uni => uni.id === university.id)) {
          return [...prev, university]
        }
        return prev
      })
    } else {
      // Remove from saved universities
      setSavedUniversities(prev => prev.filter(uni => uni.id !== university.id))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Finding your university matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">University Matches</h1>
        <p className="text-muted-foreground">Explore universities that match your academic profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        {/* Filters */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Refine your university matches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label htmlFor={`category-${category}`} className="cursor-pointer capitalize">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Countries</Label>
              <div className="space-y-2">
                {countries.map((country) => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox
                      id={`country-${country}`}
                      checked={filters.countries.includes(country)}
                      onCheckedChange={() => handleCountryChange(country)}
                    />
                    <Label htmlFor={`country-${country}`} className="cursor-pointer">
                      {country}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Minimum Match Score: {filters.minMatchScore}%</Label>
              <Slider
                value={[filters.minMatchScore]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, minMatchScore: value[0] }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Maximum Tuition: ${filters.maxTuition.toLocaleString()}</Label>
              <Slider
                value={[filters.maxTuition]}
                min={0}
                max={100000}
                step={5000}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, maxTuition: value[0] }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Research Areas</Label>
              <div className="space-y-2">
                {researchAreas.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={`area-${area}`}
                      checked={filters.researchAreas.includes(area)}
                      onCheckedChange={() => handleResearchAreaChange(area)}
                    />
                    <Label htmlFor={`area-${area}`} className="cursor-pointer">
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={resetFilters}>
              Reset Filters
            </Button>
          </CardContent>
        </Card>

        {/* University List */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search universities..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="match">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Match Score</SelectItem>
                <SelectItem value="ranking">Ranking</SelectItem>
                <SelectItem value="deadline">Application Deadline</SelectItem>
                <SelectItem value="tuition">Tuition (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Universities</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="applied">Applied</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 mt-4">
              {filteredUniversities.length > 0 ? (
                filteredUniversities.map((university) => <UniversityCard key={university.id} university={university} onSaveToggle={handleUniversitySaveToggle} />)
              ) : (
                <div className="text-center py-10">
                  <School className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No universities found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="saved" className="space-y-4 mt-4">
              {savedUniversities.length > 0 ? (
                savedUniversities.map((university) => <UniversityCard key={university.id} university={university} onSaveToggle={handleUniversitySaveToggle} />)
              ) : (
                <div className="text-center py-10">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No saved universities</h3>
                  <p className="text-muted-foreground">Save universities to track them here</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="applied" className="space-y-4 mt-4">
              <div className="text-center py-10">
                <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No applications yet</h3>
                <p className="text-muted-foreground">Universities you've applied to will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function UniversityCard({ university, onSaveToggle }) {
  console.log("UniversityCard rendered for:", university.name, "ID:", university.id)
  const { isAuthenticated, user } = useAuth()
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Check if university is saved on component mount
  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const saved = await trackerService.isItemSaved('university', university.id)
        setIsSaved(saved)
      } catch (error) {
        console.error('Error checking saved status:', error)
      }
    }
    checkSavedStatus()
  }, [university.id])

  // Handle save/unsave university
  const handleSaveToggle = async () => { 
    console.log("Save button clicked for university:", university.name, "ID:", university.id)
    console.log("User authenticated:", isAuthenticated)
    console.log("Current user:", user)
    
    if (!isAuthenticated) {
      alert("Please log in to save universities")
      return
    }
    
    setIsSaving(true)
    try {
      if (isSaved) {
        console.log("Removing university from tracker...")
        await trackerService.removeTask('university', university.id)
        console.log("University removed successfully")
        setIsSaved(false)
        // Notify parent component about the save toggle
        if (onSaveToggle) {
          onSaveToggle(university, false)
        }
      } else {
        console.log("Saving university to tracker...")
        const result = await trackerService.saveTask('university', university.id)
        console.log("Save result:", result)
        setIsSaved(true)
        // Notify parent component about the save toggle
        if (onSaveToggle) {
          onSaveToggle(university, true)
        }
      }
    } catch (error) {
      console.error('Error toggling save status:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Get category color and label
  const getCategoryInfo = (category) => {
    switch (category) {
      case 'reach':
        return { color: 'bg-red-50 text-red-700 border-red-200', label: 'Reach' }
      case 'match':
        return { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Match' }
      case 'safety':
        return { color: 'bg-green-50 text-green-700 border-green-200', label: 'Safety' }
      default:
        return { color: 'bg-gray-50 text-gray-700 border-gray-200', label: 'Unknown' }
    }
  }

  const categoryInfo = getCategoryInfo(university.category || (university.matchScore > 80 ? 'reach' : university.matchScore > 60 ? 'match' : 'safety'))

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <School className="h-8 w-8" />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold">{university.name}</h3>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{university.address || university.location}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant="outline" className="bg-green-50 w-fit">
                  {university.matchScore}% Match
                </Badge>
                <Badge variant="outline" className={`w-fit ${categoryInfo.color}`}>
                  {categoryInfo.label}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Application Deadline</p>
                  <p className="text-sm text-muted-foreground">{university.applicationDeadline || university.deadline}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tuition</p>
                  <p className="text-sm text-muted-foreground">${(university.tuitionFees || university.tuition || 0).toLocaleString()}/year</p>
                </div>
              </div>
              <div className="flex items-center">
                <StarHalf className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Ranking</p>
                  <p className="text-sm text-muted-foreground">#{university.ranking} Worldwide</p>
                </div>
              </div>
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Admission Probability</p>
                  <p className="text-sm text-muted-foreground">{university.admissionProbability || Math.round((university.matchScore || 50) * 0.8)}%</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Research Areas</p>
              <div className="flex flex-wrap gap-2">
                {(university.researchAreas || ['Machine Learning', 'Computer Vision', 'Data Science']).map((area, index) => (
                  <Badge key={index} variant="secondary">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="default">
                <BookOpen className="mr-2 h-4 w-4" />
                View Details
              </Button>
              <Button
                variant={isSaved ? "default" : "outline"}
                onClick={() => {
                  console.log("🚀 SAVE BUTTON CLICKED! 🚀")
                  console.log("University:", university.name, "ID:", university.id)
                  handleSaveToggle()
                }}
                disabled={isSaving}
                data-testid={`save-button-${university.id}`}
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                ) : (
                  <Star className={`mr-2 h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                )}
                {isSaving ? 'Saving...' : (isSaved ? 'Saved' : 'Save')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
