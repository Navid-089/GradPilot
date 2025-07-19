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
import { School, Search, MapPin, Calendar, DollarSign, GraduationCap, Star, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import { getUniversityMatches, getUniversityMatchesPaginated } from "@/lib/university-service"
import { trackerService } from "@/lib/tracker-service"
import { useAuth } from "@/lib/auth-context"

export default function UniversitiesPage() {
  const { user } = useAuth()
  const [allUniversities, setAllUniversities] = useState([]) // Store all universities
  const [universities, setUniversities] = useState([])
  const [filteredUniversities, setFilteredUniversities] = useState([])
  const [savedUniversities, setSavedUniversities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("match")
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(30)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

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

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch all universities once
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true)
        console.log('Fetching all universities...')
        
        // Fetch all universities (not paginated)
        const data = await getUniversityMatches()
        
        // Store all universities
        setAllUniversities(data)
        
        // Debug: Log unique countries in the data
        const uniqueCountries = [...new Set(data.map(uni => uni.country))].sort()
        console.log('=== COUNTRIES IN DATA ===')
        console.log('Unique countries found:', uniqueCountries)
        console.log('Countries in filter list:', countries)
        console.log('Countries not in data:', countries.filter(c => !uniqueCountries.includes(c)))
        console.log('Countries in data but not in filter:', uniqueCountries.filter(c => !countries.includes(c)))
        
        console.log('Fetched all university data:', {
          totalUniversities: data.length
        })
        
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
    fetchAllData()
  }, [user]) // Only fetch once when user changes

  // Handle client-side filtering, sorting, and pagination
  useEffect(() => {
    if (!allUniversities.length) return

    console.log('=== FILTERING DEBUG START ===')
    console.log('Processing filters, sort, and pagination...', {
      search: debouncedSearchQuery,
      filters,
      sortBy,
      currentPage,
      totalUniversities: allUniversities.length
    })

    let result = [...allUniversities]
    console.log(`Starting with ${result.length} universities`)

    // Apply search filter
    if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim()
      const beforeSearch = result.length
      result = result.filter(uni => 
        uni.name.toLowerCase().includes(query) ||
        uni.address.toLowerCase().includes(query) ||
        uni.country.toLowerCase().includes(query)
      )
      console.log(`Search filter: ${beforeSearch} -> ${result.length} universities`)
    }

    // Apply country filter - only apply when some but not all countries are selected
    if (filters.countries && filters.countries.length > 0 && filters.countries.length < countries.length) {
      console.log('Applying country filter. Selected countries:', filters.countries)
      console.log('Available countries in data:')
      const uniqueCountriesInResult = [...new Set(result.map(uni => uni.country || 'Unknown'))].sort()
      console.log('Unique countries in current result:', uniqueCountriesInResult)
      
      const beforeFilter = result.length
      result = result.filter(uni => {
        // Safeguard against null/undefined country values
        const uniCountry = uni.country || 'Unknown'
        const matchesFilter = filters.countries.includes(uniCountry)
        if (!matchesFilter) {
          console.log(`University "${uni.name}" with country "${uniCountry}" filtered out`)
        }
        return matchesFilter
      })
      console.log(`Country filter: ${beforeFilter} -> ${result.length} universities`)
      
      // If no universities remain after filtering, there might be a country name mismatch
      if (result.length === 0 && beforeFilter > 0) {
        console.warn('⚠️ NO UNIVERSITIES AFTER COUNTRY FILTER - POSSIBLE COUNTRY NAME MISMATCH!')
        console.warn('Selected countries:', filters.countries)
        console.warn('Countries in data:', uniqueCountriesInResult)
      }
    } else if (filters.countries && filters.countries.length === 0) {
      console.log('No countries selected - showing no results')
      result = []
    } else {
      console.log('All countries selected or no country filter - showing all results')
    }

    // Apply match score filter
    if (filters.minMatchScore > 0) {
      result = result.filter(uni => 
        uni.matchScore >= filters.minMatchScore
      )
    }

    // Apply tuition filter
    if (filters.maxTuition < 50000) {
      result = result.filter(uni => 
        uni.tuitionFees <= filters.maxTuition
      )
    }

    // Apply sorting
    result.sort((a, b) => {
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

    // For "all" tab, exclude saved universities
    if (activeTab === "all") {
      const savedUniversityIds = savedUniversities.map(uni => uni.id)
      result = result.filter(uni => !savedUniversityIds.includes(uni.id))
    }

    // Calculate pagination
    setTotalElements(result.length)
    setTotalPages(Math.ceil(result.length / pageSize))

    // Apply pagination
    const startIndex = currentPage * pageSize
    const endIndex = startIndex + pageSize
    const paginatedResult = result.slice(startIndex, endIndex)

    setUniversities(paginatedResult)
    setFilteredUniversities(paginatedResult)

    console.log('=== FINAL RESULTS ===')
    console.log('Processed results:', {
      totalFiltered: result.length,
      currentPageResults: paginatedResult.length,
      totalPages: Math.ceil(result.length / pageSize)
    })
    console.log('=== FILTERING DEBUG END ===')
  }, [allUniversities, debouncedSearchQuery, filters, sortBy, currentPage, pageSize, activeTab, savedUniversities, countries.length])

  // Reset pagination when search or filters change
  useEffect(() => {
    if (currentPage !== 0) {
      console.log('Resetting to page 0 due to search/filter change')
      setCurrentPage(0)
    }
  }, [debouncedSearchQuery, filters, sortBy])

  // Load saved universities from backend
  const loadSavedUniversities = async (universities = allUniversities) => {
    try {
      const savedTasks = await trackerService.getUserTasksByType('university')
      const savedUniversityIds = savedTasks.map(task => task.universityId)
      const saved = universities.filter(uni => savedUniversityIds.includes(uni.id))
      setSavedUniversities(saved)
    } catch (error) {
      console.error("Error loading saved universities:", error)
    }
  }

  // Save a university with blur effect
  const handleSaveUniversity = async (universityId) => {
    try {
      // Add visual feedback with blur effect
      const universityElement = document.querySelector(`[data-university-id="${universityId}"]`)
      if (universityElement) {
        universityElement.style.filter = 'blur(2px)'
        universityElement.style.opacity = '0.7'
        universityElement.style.transition = 'all 0.3s ease-in-out'
      }

      await trackerService.saveTask('university', universityId)
      await loadSavedUniversities()
      
    } catch (error) {
      console.error("Error saving university:", error)
      alert("Failed to save university")
      
      // Reset visual feedback on error
      const universityElement = document.querySelector(`[data-university-id="${universityId}"]`)
      if (universityElement) {
        universityElement.style.filter = 'none'
        universityElement.style.opacity = '1'
      }
    }
  }

  // Unsave a university with blur effect
  const handleUnsaveUniversity = async (universityId) => {
    try {
      // Add visual feedback with blur effect
      const universityElement = document.querySelector(`[data-university-id="${universityId}"]`)
      if (universityElement) {
        universityElement.style.filter = 'blur(2px)'
        universityElement.style.opacity = '0.7'
        universityElement.style.transition = 'all 0.3s ease-in-out'
      }

      await trackerService.removeTask('university', universityId)
      setSavedUniversities(prev => prev.filter(uni => uni.id !== universityId))
    } catch (error) {
      console.error("Error unsaving university:", error)
      alert("Failed to unsave university")
      
      // Reset visual feedback on error
      const universityElement = document.querySelector(`[data-university-id="${universityId}"]`)
      if (universityElement) {
        universityElement.style.filter = 'none'
        universityElement.style.opacity = '1'
      }
    }
  }

  // Check if university is saved
  const isUniversitySaved = (universityId) => {
    return savedUniversities.some(uni => uni.id === universityId)
  }

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

  const handleMinMatchScoreChange = (value) => {
    setFilters((prev) => ({ ...prev, minMatchScore: value[0] }))
  }

  const handleMaxTuitionChange = (value) => {
    setFilters((prev) => ({ ...prev, maxTuition: value[0] }))
  }

  const resetFilters = () => {
    setFilters({
      countries: [...countries],
      minMatchScore: 0,
      maxTuition: 50000,
    })
    setSearchQuery("")
    setSortBy("match")
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
                    onValueChange={handleMinMatchScoreChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Tuition: ${filters.maxTuition.toLocaleString()}</Label>
                  <Slider
                    value={[filters.maxTuition]}
                    min={0}
                    max={100000}
                    step={5000}
                    onValueChange={handleMaxTuitionChange}
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
              
              {/* Page Info */}
              {!isLoading && totalElements > 0 && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} universities</span>
                  <span>Page {currentPage + 1} of {totalPages}</span>
                </div>
              )}
              
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
                  
                  {/* Pagination Controls */}
                  {!isLoading && totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentPage(prev => Math.max(0, prev - 1))
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        disabled={currentPage === 0 || isLoading}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i;
                          } else if (currentPage <= 2) {
                            page = i;
                          } else if (currentPage >= totalPages - 3) {
                            page = totalPages - 5 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                setCurrentPage(page)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                              }}
                              className="w-8 h-8 p-0"
                              disabled={isLoading}
                            >
                              {page + 1}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        disabled={currentPage >= totalPages - 1 || isLoading}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Results info */}
                  {!isLoading && totalElements > 0 && (
                    <div className="text-center text-sm text-muted-foreground mt-4">
                      Showing {(currentPage * pageSize) + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} universities
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="saved" className="space-y-4 mt-4">
                  {(() => {
                    // Apply filtering and search to saved universities
                    let filteredSaved = [...savedUniversities]
                    
                    // Apply search filter
                    if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
                      const query = debouncedSearchQuery.toLowerCase().trim()
                      filteredSaved = filteredSaved.filter(uni => 
                        uni.name.toLowerCase().includes(query) ||
                        uni.address.toLowerCase().includes(query) ||
                        uni.country.toLowerCase().includes(query)
                      )
                    }

                    // Apply country filter - only apply when some but not all countries are selected
                    if (filters.countries && filters.countries.length > 0 && filters.countries.length < countries.length) {
                      filteredSaved = filteredSaved.filter(uni => {
                        const uniCountry = uni.country || 'Unknown'
                        return filters.countries.includes(uniCountry)
                      })
                    } else if (filters.countries && filters.countries.length === 0) {
                      filteredSaved = []
                    }

                    // Apply match score filter
                    if (filters.minMatchScore > 0) {
                      filteredSaved = filteredSaved.filter(uni => 
                        uni.matchScore >= filters.minMatchScore
                      )
                    }

                    // Apply tuition filter
                    if (filters.maxTuition < 50000) {
                      filteredSaved = filteredSaved.filter(uni => 
                        uni.tuitionFees <= filters.maxTuition
                      )
                    }

                    // Apply sorting
                    filteredSaved.sort((a, b) => {
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

                    return filteredSaved.length > 0 ? (
                      <>
                        {filteredSaved.map((university) => (
                          <UniversityCard 
                            key={university.id} 
                            university={university} 
                            onSave={handleSaveUniversity}
                            onUnsave={handleUnsaveUniversity}
                            isSaved={true}
                          />
                        ))}
                        {filteredSaved.length !== savedUniversities.length && (
                          <div className="text-center text-sm text-muted-foreground mt-4">
                            Showing {filteredSaved.length} of {savedUniversities.length} saved universities
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-10">
                        <Star className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">
                          {savedUniversities.length === 0 ? "No saved universities" : "No universities match your filters"}
                        </h3>
                        <p className="text-muted-foreground">
                          {savedUniversities.length === 0 ? "Save universities to track them here" : "Try adjusting your filters or search query"}
                        </p>
                      </div>
                    )
                  })()}
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
    <Card data-university-id={university.id}>
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
