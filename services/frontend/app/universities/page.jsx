"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { School, Search, MapPin, Calendar, DollarSign, GraduationCap, Star, BookOpen } from "lucide-react"
import { getUniversityMatches } from "@/lib/university-service"
import { trackerService } from "@/lib/tracker-service"
import { useAuth } from "@/lib/auth-context"

export default function UniversitiesPage() {
  const { user } = useAuth()
  const [universities, setUniversities] = useState([])
  const [filteredUniversities, setFilteredUniversities] = useState([])
  const [savedUniversities, setSavedUniversities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("match")

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Germany",
    "Australia",
    "Singapore",
    "Japan",
    "China",
    "South Korea",
    "Switzerland",
    "Belgium"
  ]

  const [filters, setFilters] = useState({
    countries: [...countries],
    minMatchScore: 0,
    maxTuition: 50000,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUniversityMatches()
        setUniversities(data)
        setFilteredUniversities(data)
        
        // Load saved universities
        if (user) {
          await loadSavedUniversities(data)
        }
      } catch (error) {
        console.error("Error fetching university data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user])

  // Load saved universities from backend
  const loadSavedUniversities = async (allUniversities = universities) => {
    try {
      const savedTasks = await trackerService.getUserTasksByType('university')
      const savedUniversityIds = savedTasks.map(task => task.universityId)
      const saved = allUniversities.filter(uni => savedUniversityIds.includes(uni.id))
      setSavedUniversities(saved)
    } catch (error) {
      console.error("Error loading saved universities:", error)
    }
  }

  // Save a university
  const handleSaveUniversity = async (universityId) => {
    try {
      await trackerService.saveTask('university', universityId)
      await loadSavedUniversities()
      
      // Remove from filtered universities if in "all" tab
      if (activeTab === "all") {
        setFilteredUniversities(prev => prev.filter(uni => uni.id !== universityId))
      }
    } catch (error) {
      console.error("Error saving university:", error)
      alert("Failed to save university")
    }
  }

  // Unsave a university
  const handleUnsaveUniversity = async (universityId) => {
    try {
      await trackerService.removeTask('university', universityId)
      setSavedUniversities(prev => prev.filter(uni => uni.id !== universityId))
      
      // Add back to all universities if in "all" tab
      if (activeTab === "all") {
        const universityToAdd = universities.find(uni => uni.id === universityId)
        if (universityToAdd) {
          setFilteredUniversities(prev => [...prev, universityToAdd])
        }
      }
    } catch (error) {
      console.error("Error unsaving university:", error)
      alert("Failed to unsave university")
    }
  }

  // Check if university is saved
  const isUniversitySaved = (universityId) => {
    return savedUniversities.some(uni => uni.id === universityId)
  }

  useEffect(() => {
    let result = [...universities]
    
    // Exclude saved universities from "all" tab
    if (activeTab === "all") {
      const savedUniversityIds = savedUniversities.map(uni => uni.id)
      result = result.filter(uni => !savedUniversityIds.includes(uni.id))
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((uni) => 
        uni.name.toLowerCase().includes(query)
      )
    }
    if (filters.countries.length > 0) {
      result = result.filter((uni) => filters.countries.includes(uni.country))
    }
    result = result.filter((uni) => uni.matchScore >= filters.minMatchScore)
    result = result.filter((uni) => uni.tuitionFees <= filters.maxTuition)
    
    // Apply sorting
    switch (sortBy) {
      case "match":
        result.sort((a, b) => b.matchScore - a.matchScore)
        break
      case "ranking":
        result.sort((a, b) => a.ranking - b.ranking)
        break
      case "deadline":
        result.sort((a, b) => new Date(a.applicationDeadline) - new Date(b.applicationDeadline))
        break
      case "tuition":
        result.sort((a, b) => (a.tuitionFees || 0) - (b.tuitionFees || 0))
        break
      default:
        break
    }
    
    setFilteredUniversities(result)
  }, [searchQuery, filters, universities, savedUniversities, activeTab, sortBy])

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

  const resetFilters = () => {
    setFilters({
      countries: [...countries],
      minMatchScore: 0,
      maxTuition: 50000,
    })
    setSearchQuery("")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <MainNav />
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">University Matches</h1>
            <p className="text-muted-foreground">
              Explore universities that match your academic profile and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters */}
            <Card className="md:col-span-1">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Filters</h3>
                  <p className="text-sm text-muted-foreground mb-4">Refine your university matches</p>
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
                <Button variant="outline" className="w-full" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
            {/* University List */}
            <div className="md:col-span-3 space-y-6">
              {/* Search and Sort */}
              <div className="flex gap-4 items-center">
                {/* Search Field */}
                <div className="relative flex-1 max-w-md">
                  <Input
                    placeholder="Search universities by name..."
                    className="pr-8 h-12 text-base font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                
                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 h-12 text-base">
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
              
              {/* Add tabs for All Universities and Saved */}
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All Universities</TabsTrigger>
                  <TabsTrigger value="saved">Saved ({savedUniversities.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4 mt-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredUniversities.length > 0 ? (
                    filteredUniversities.map((university) => (
                      <UniversityCard 
                        key={university.id} 
                        university={university} 
                        onSave={handleSaveUniversity}
                        onUnsave={handleUnsaveUniversity}
                        isSaved={isUniversitySaved(university.id)}
                      />
                    ))
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
                    savedUniversities.map((university) => (
                      <UniversityCard 
                        key={university.id} 
                        university={university} 
                        onSave={handleSaveUniversity}
                        onUnsave={handleUnsaveUniversity}
                        isSaved={true}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <Star className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No saved universities</h3>
                      <p className="text-muted-foreground">Save universities to track them here</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <GraduationCap className="h-6 w-6" />
              <span className="text-xl font-bold">GradPilot</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 GradPilot. Developed by Souvik Mandol, Wahid Al Azad Navid, and Ananya Shahrin Promi.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function UniversityCard({ university, onSave, onUnsave, isSaved }) {
  const handleSaveToggle = () => {
    if (isSaved) {
      onUnsave(university.id)
    } else {
      onSave(university.id)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <School className="h-8 w-8" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold">{university.name}</h3>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{university.address}</span>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 w-fit">
                {university.matchScore}% Match
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Application Deadline</p>
                  <p className="text-sm text-muted-foreground">{university.applicationDeadline}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tuition</p>
                  <p className="text-sm text-muted-foreground">
                    {university.tuitionFees != null ? `$${university.tuitionFees.toLocaleString()}/year` : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Ranking</p>
                  <p className="text-sm text-muted-foreground">#{university.ranking} Worldwide</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">About</p>
              <p className="text-sm text-muted-foreground">{university.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="default" asChild>
                <a href={university.websiteUrl ?? "#"} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Visit Website
                </a>
              </Button>
              <Button 
                variant={isSaved ? "default" : "outline"} 
                size="sm" 
                onClick={handleSaveToggle}
                className={isSaved ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}
              >
                <Star className="mr-2 h-4 w-4" />
                {isSaved ? "Unsave" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
