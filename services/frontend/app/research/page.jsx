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
import { Users, Search, School, Mail, ExternalLink, BookOpen, Star, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react"
import { getProfessorSuggestions, getProfessorsByResearchInterests } from "@/lib/professor-service"
import { getUserResearchInterests } from "@/lib/user-research-service"
import { trackerService } from "@/lib/tracker-service"
import { useAuth } from "@/lib/auth-context"

export default function ResearchPage() {
  const { user } = useAuth()
  const [professors, setProfessors] = useState([])
  const [filteredProfessors, setFilteredProfessors] = useState([])
  const [savedProfessors, setSavedProfessors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [availableResearchAreas, setAvailableResearchAreas] = useState([])
  const [userResearchInterests, setUserResearchInterests] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 6

  const [filters, setFilters] = useState({
    universities: [],
    researchAreas: [],
  })

  const universities = [
    "MIT",
    "Stanford University",
    "Harvard University",
    "Caltech",
    "Oxford University",
    "Cambridge University",
    "ETH Zurich",
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch ALL professors (not filtered by research interests)
        const data = await getProfessorSuggestions() // This should get all professors
        setProfessors(data)
        
        // Extract all unique research areas from the professor data
        const allResearchAreas = new Set()
        data.forEach(professor => {
          if (professor.researchAreas) {
            professor.researchAreas.forEach(area => allResearchAreas.add(area))
          }
        })
        setAvailableResearchAreas(Array.from(allResearchAreas))
        
        // Get user's actual research interests from backend
        const interests = await getUserResearchInterests()
        setUserResearchInterests(interests)
        
        // Set initial filters to user's research interests
        setFilters(prev => ({
          ...prev,
          researchAreas: interests
        }))
        
        // Apply initial filtering based on user's interests
        const initialFiltered = data.filter(prof => 
          prof.researchAreas && prof.researchAreas.some(area => 
            interests.includes(area)
          )
        )
        setFilteredProfessors(initialFiltered)
        
        // Load saved professors
        if (user) {
          await loadSavedProfessors(data)
        }
      } catch (error) {
        console.error("Error fetching professor data:", error)
        // Fallback: show all professors if filtering fails
        setFilteredProfessors(professors)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Load saved professors from backend
  const loadSavedProfessors = async (allProfessors = professors) => {
    try {
      const savedTasks = await trackerService.getUserTasksByType('professor')
      const savedProfessorIds = savedTasks.map(task => task.professorId)
      const saved = allProfessors.filter(prof => savedProfessorIds.includes(prof.id))
      setSavedProfessors(saved)
    } catch (error) {
      console.error("Error loading saved professors:", error)
    }
  }

  // Save a professor with blur effect
  const handleSaveProfessor = async (professorId) => {
    try {
      // Add visual feedback with blur effect
      const professorElement = document.querySelector(`[data-professor-id="${professorId}"]`)
      if (professorElement) {
        professorElement.style.filter = 'blur(2px)'
        professorElement.style.opacity = '0.7'
        professorElement.style.transition = 'all 0.3s ease-in-out'
      }

      await trackerService.saveTask('professor', professorId)
      await loadSavedProfessors()
      
      // Remove from filtered professors if in "all" tab
      if (activeTab === "all") {
        setFilteredProfessors(prev => prev.filter(prof => prof.id !== professorId))
      }
    } catch (error) {
      console.error("Error saving professor:", error)
      alert("Failed to save professor")
      
      // Reset visual feedback on error
      const professorElement = document.querySelector(`[data-professor-id="${professorId}"]`)
      if (professorElement) {
        professorElement.style.filter = 'none'
        professorElement.style.opacity = '1'
      }
    }
  }

  // Unsave a professor with blur effect
  const handleUnsaveProfessor = async (professorId) => {
    try {
      // Add visual feedback with blur effect
      const professorElement = document.querySelector(`[data-professor-id="${professorId}"]`)
      if (professorElement) {
        professorElement.style.filter = 'blur(2px)'
        professorElement.style.opacity = '0.7'
        professorElement.style.transition = 'all 0.3s ease-in-out'
      }

      await trackerService.removeTask('professor', professorId)
      setSavedProfessors(prev => prev.filter(prof => prof.id !== professorId))
      
      // Add back to all professors if in "all" tab
      if (activeTab === "all") {
        const professorToAdd = professors.find(prof => prof.id === professorId)
        if (professorToAdd) {
          setFilteredProfessors(prev => [...prev, professorToAdd])
        }
      }
    } catch (error) {
      console.error("Error unsaving professor:", error)
      alert("Failed to unsave professor")
      
      // Reset visual feedback on error
      const professorElement = document.querySelector(`[data-professor-id="${professorId}"]`)
      if (professorElement) {
        professorElement.style.filter = 'none'
        professorElement.style.opacity = '1'
      }
    }
  }

  // Check if professor is saved
  const isProfessorSaved = (professorId) => {
    return savedProfessors.some(prof => prof.id === professorId)
  }

  useEffect(() => {
    // Apply filters and search with pagination
    let result = [...professors]

    // Exclude saved professors from "all" tab
    if (activeTab === "all") {
      const savedProfessorIds = savedProfessors.map(prof => prof.id)
      result = result.filter(prof => !savedProfessorIds.includes(prof.id))
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (prof) =>
          prof.name?.toLowerCase().includes(query) ||
          prof.university?.toLowerCase().includes(query) ||
          (prof.researchAreas && prof.researchAreas.some((area) => area.toLowerCase().includes(query)))
      )
    }

    // Apply university filter (commented out for now)
    /*
    if (filters.universities.length > 0) {
      result = result.filter((prof) => prof.university && filters.universities.includes(prof.university))
    }
    */

    // Apply research areas filter - show only matching professors if filters are set
    if (filters.researchAreas.length > 0) {
      result = result.filter((prof) => prof.researchAreas && prof.researchAreas.some((area) => filters.researchAreas.includes(area)))
    }

    // Apply sorting
    switch (sortBy) {
      case "relevance":
        // Sort by number of matching research areas (if user has research interests)
        if (userResearchInterests.length > 0) {
          result.sort((a, b) => {
            const aMatches = a.researchAreas ? a.researchAreas.filter(area => 
              userResearchInterests.some(interest => interest.toLowerCase() === area.toLowerCase())
            ).length : 0
            const bMatches = b.researchAreas ? b.researchAreas.filter(area => 
              userResearchInterests.some(interest => interest.toLowerCase() === area.toLowerCase())
            ).length : 0
            return bMatches - aMatches // Higher matches first
          })
        }
        break
      case "name":
        result.sort((a, b) => a.name?.localeCompare(b.name || "") || 0)
        break
      case "university":
        result.sort((a, b) => a.university?.localeCompare(b.university || "") || 0)
        break
      default:
        break
    }

    // Calculate pagination
    setTotalElements(result.length)
    setTotalPages(Math.ceil(result.length / pageSize))

    // Apply pagination
    const startIndex = currentPage * pageSize
    const endIndex = startIndex + pageSize
    const paginatedResult = result.slice(startIndex, endIndex)

    setFilteredProfessors(paginatedResult)
  }, [searchQuery, filters, professors, savedProfessors, activeTab, sortBy, userResearchInterests, currentPage, pageSize])

  // Reset pagination when search or filters change
  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0)
    }
  }, [searchQuery, filters, sortBy])

  const handleUniversityChange = (university) => {
    setFilters((prev) => {
      const updatedUniversities = prev.universities.includes(university)
        ? prev.universities.filter((u) => u !== university)
        : [...prev.universities, university]

      return {
        ...prev,
        universities: updatedUniversities,
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

  const resetFilters = () => {
    // Reset to user's research interests
    setFilters({
      universities: [],
      researchAreas: userResearchInterests,
    })
    setSearchQuery("")
  }

  const selectAllResearchAreas = () => {
    setFilters(prev => ({
      ...prev,
      researchAreas: [...availableResearchAreas]
    }))
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
            <h1 className="text-3xl font-bold tracking-tight">Research Scope Finder</h1>
            <p className="text-muted-foreground">
              Discover professors working in your research areas. Results are filtered by your interests by default.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters */}
            <Card className="md:col-span-1">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Filters</h3>

                </div>

                {/* University filtering commented out for now */}
                {/*
                <div className="space-y-2">
                  <Label>Universities</Label>
                  <div className="space-y-2">
                    {universities.map((university) => (
                      <div key={university} className="flex items-center space-x-2">
                        <Checkbox
                          id={`university-${university}`}
                          checked={filters.universities.includes(university)}
                          onCheckedChange={() => handleUniversityChange(university)}
                        />
                        <Label htmlFor={`university-${university}`} className="cursor-pointer">
                          {university}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                */}

                <div className="space-y-2">
                  <Label>Research Areas</Label>
                  <div className="space-y-2">
                    {availableResearchAreas.map((area) => (
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
                
                <Button variant="outline" className="w-full" onClick={selectAllResearchAreas}>
                  Select All Research Areas
                </Button>
              </CardContent>
            </Card>

            {/* Professor List */}
            <div className="md:col-span-3 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search professors..."
                    className="pr-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page Info */}
              {!isLoading && totalElements > 0 && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} professors</span>
                  <span>Page {currentPage + 1} of {totalPages}</span>
                </div>
              )}

              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Professors</TabsTrigger>
                  <TabsTrigger value="saved">Saved ({savedProfessors.length})</TabsTrigger>
                  
                </TabsList>
                <TabsContent value="all" className="space-y-4 mt-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredProfessors.length > 0 ? (
                    filteredProfessors.map((professor) => (
                      <ProfessorCard 
                        key={professor.id} 
                        professor={professor} 
                        onSave={handleSaveProfessor}
                        onUnsave={handleUnsaveProfessor}
                        isSaved={isProfessorSaved(professor.id)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No professors found</h3>
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
                </TabsContent>
                <TabsContent value="saved" className="space-y-4 mt-4">
                  {(() => {
                    // Apply filtering and search to saved professors
                    let filteredSaved = [...savedProfessors]
                    
                    // Apply search query
                    if (searchQuery) {
                      const query = searchQuery.toLowerCase()
                      filteredSaved = filteredSaved.filter(
                        (prof) =>
                          prof.name?.toLowerCase().includes(query) ||
                          prof.university?.toLowerCase().includes(query) ||
                          (prof.researchAreas && prof.researchAreas.some((area) => area.toLowerCase().includes(query)))
                      )
                    }

                    // Apply research areas filter - show only matching professors if filters are set
                    if (filters.researchAreas.length > 0) {
                      filteredSaved = filteredSaved.filter((prof) => prof.researchAreas && prof.researchAreas.some((area) => filters.researchAreas.includes(area)))
                    }

                    // Apply sorting
                    switch (sortBy) {
                      case "relevance":
                        // Sort by number of matching research areas (if user has research interests)
                        if (userResearchInterests.length > 0) {
                          filteredSaved.sort((a, b) => {
                            const aMatches = a.researchAreas ? a.researchAreas.filter(area => 
                              userResearchInterests.some(interest => interest.toLowerCase() === area.toLowerCase())
                            ).length : 0
                            const bMatches = b.researchAreas ? b.researchAreas.filter(area => 
                              userResearchInterests.some(interest => interest.toLowerCase() === area.toLowerCase())
                            ).length : 0
                            return bMatches - aMatches
                          })
                        }
                        break
                      case "name":
                        filteredSaved.sort((a, b) => a.name.localeCompare(b.name))
                        break
                      case "university":
                        filteredSaved.sort((a, b) => (a.university || '').localeCompare(b.university || ''))
                        break
                      default:
                        break
                    }

                    return filteredSaved.length > 0 ? (
                      <>
                        {filteredSaved.map((professor) => (
                          <ProfessorCard 
                            key={professor.id} 
                            professor={professor} 
                            onSave={handleSaveProfessor}
                            onUnsave={handleUnsaveProfessor}
                            isSaved={true}
                          />
                        ))}
                        {filteredSaved.length !== savedProfessors.length && (
                          <div className="text-center text-sm text-muted-foreground mt-4">
                            Showing {filteredSaved.length} of {savedProfessors.length} saved professors
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-10">
                        <Star className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">
                          {savedProfessors.length === 0 ? "No saved professors" : "No professors match your filters"}
                        </h3>
                        <p className="text-muted-foreground">
                          {savedProfessors.length === 0 ? "Save professors to track them here" : "Try adjusting your filters or search query"}
                        </p>
                      </div>
                    )
                  })()}
                </TabsContent>
                <TabsContent value="contacted" className="space-y-4 mt-4">
                  <div className="text-center py-10">
                    <Mail className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No contacted professors</h3>
                    <p className="text-muted-foreground">Professors you've contacted will appear here</p>
                  </div>
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

function ProfessorCard({ professor, onSave, onUnsave, isSaved }) {
  const handleSaveToggle = () => {
    if (isSaved) {
      onUnsave(professor.id)
    } else {
      onSave(professor.id)
    }
  }

  return (
    <Card data-professor-id={professor.id}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Users className="h-8 w-8" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-bold">{professor.name}</h3>
              <div className="flex items-center text-muted-foreground">
                <School className="h-4 w-4 mr-1" />
                <span>{professor.university}</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Research Areas</p>
              <div className="flex flex-wrap gap-2">
                {professor.researchAreas && professor.researchAreas.length > 0 ? (
                  professor.researchAreas.map((area, index) => (
                    <Badge key={index} variant="secondary">
                      {area}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">No research areas specified</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Recent Papers</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {professor.recentPapers && professor.recentPapers.length > 0 ? (
                  professor.recentPapers.map((paper, index) => (
                    <li key={index}>
                      {paper.url ? (
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {paper.title}
                        </a>
                      ) : (
                        <span>{paper.title}</span>
                      )}
                    </li>
                  ))
                ) : (
                  <li>No recent papers available</li>
                )}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`mailto:${professor.email}`} target="_blank" rel="noopener noreferrer">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </a>
              </Button>
              {professor.googleScholar && (
                <Button variant="outline" size="sm" asChild>
                  <a href={professor.googleScholar} target="_blank" rel="noopener noreferrer">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Google Scholar
                  </a>
                </Button>
              )}
              {professor.labLink && (
                <Button variant="outline" size="sm" asChild>
                  <a href={professor.labLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Lab Website
                  </a>
                </Button>
              )}
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
