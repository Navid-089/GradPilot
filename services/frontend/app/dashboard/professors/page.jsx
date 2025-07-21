"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Users, Search, School, Mail, ExternalLink, BookOpen, Star, StarIcon } from "lucide-react"
import { getProfessorSuggestions } from "@/lib/professor-service"
import { trackerService } from "@/lib/tracker-service"
import { useAuth } from "@/lib/auth-context"

export default function ProfessorsPage() {
  const { user } = useAuth()
  const [professors, setProfessors] = useState([])
  const [filteredProfessors, setFilteredProfessors] = useState([])
  const [savedProfessors, setSavedProfessors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

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
        const data = await getProfessorSuggestions()
        setProfessors(data)
        setFilteredProfessors(data)
      } catch (error) {
        console.error("Error fetching professor data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Load saved professors from backend
  const loadSavedProfessors = useCallback(async () => {
    try {
      console.log("Loading saved professors...")
      const savedTasks = await trackerService.getUserTasksByType('professor')
      console.log("Saved tasks:", savedTasks)
      const savedProfessorIds = savedTasks.map(task => task.professorId)
      console.log("Saved professor IDs:", savedProfessorIds)
      
      // Filter professors to get saved ones
      const saved = professors.filter(prof => savedProfessorIds.includes(prof.id))
      console.log("Saved professors:", saved)
      setSavedProfessors(saved)
    } catch (error) {
      console.error("Error loading saved professors:", error)
    }
  }, [professors])

  // Load saved professors when professors data is available
  useEffect(() => {
    if (professors.length > 0 && user) {
      loadSavedProfessors()
    }
  }, [professors, user, loadSavedProfessors])

  // Save a professor
  const handleSaveProfessor = async (professorId) => {
    try {
      console.log("Saving professor with ID:", professorId)
      await trackerService.saveTask('professor', professorId)
      console.log("Professor saved successfully")
      await loadSavedProfessors()
      
      // Remove from filtered professors if in "all" tab
      if (activeTab === "all") {
        setFilteredProfessors(prev => prev.filter(prof => prof.id !== professorId))
      }
    } catch (error) {
      console.error("Error saving professor:", error)
      alert("Failed to save professor")
    }
  }

  // Unsave a professor
  const handleUnsaveProfessor = async (professorId) => {
    try {
      await trackerService.removeTask('professor', professorId)
      
      // Remove from saved professors list
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
    }
  }

  // Check if professor is saved
  const isProfessorSaved = (professorId) => {
    return savedProfessors.some(prof => prof.id === professorId)
  }

  useEffect(() => {
    // Apply filters and search
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
          prof.name.toLowerCase().includes(query) ||
          prof.university.toLowerCase().includes(query) ||
          prof.researchAreas.some((area) => area.toLowerCase().includes(query)),
      )
    }

    // Apply university filter
    if (filters.universities.length > 0) {
      result = result.filter((prof) => filters.universities.includes(prof.university))
    }

    // Apply research areas filter
    if (filters.researchAreas.length > 0) {
      result = result.filter((prof) => prof.researchAreas.some((area) => filters.researchAreas.includes(area)))
    }

    setFilteredProfessors(result)
  }, [searchQuery, filters, professors, savedProfessors, activeTab])

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
    setFilters({
      universities: [],
      researchAreas: [],
    })
    setSearchQuery("")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Finding professors in your research areas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Professor Explorer</h1>
        <p className="text-muted-foreground">Discover professors working in your research areas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Refine your professor search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

        {/* Professor List */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search professors..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="relevance">
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

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Professors</TabsTrigger>
              <TabsTrigger value="saved">Saved ({savedProfessors.length})</TabsTrigger>
              <TabsTrigger value="contacted">Contacted</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 mt-4">
              {filteredProfessors.length > 0 ? (
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
            </TabsContent>
            <TabsContent value="saved" className="space-y-4 mt-4">
              {savedProfessors.length > 0 ? (
                savedProfessors.map((professor) => (
                  <ProfessorCard 
                    key={professor.id} 
                    professor={professor} 
                    onSave={handleSaveProfessor}
                    onUnsave={handleUnsaveProfessor}
                    isSaved={true}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No saved professors</h3>
                  <p className="text-muted-foreground">Save professors to track them here</p>
                </div>
              )}
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
  )
}

function ProfessorCard({ professor, onSave, onUnsave, isSaved }) {
  const handleSaveToggle = () => {
    console.log("Save toggle clicked for professor:", professor.id, "isSaved:", isSaved)
    if (isSaved) {
      onUnsave(professor.id)
    } else {
      onSave(professor.id)
    }
  }

  return (
    <Card>
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
                {professor.researchAreas.map((area, index) => (
                  <Badge key={index} variant="secondary">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Recent Paperssss</p>
              <ul className="space-y-1">
                {professor.recentPapers && professor.recentPapers.length > 0 ? (
                  professor.recentPapers.map((paper, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {paper.url ? (
                        <a 
                          href={paper.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {paper.title}
                        </a>
                      ) : (
                        paper.title
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">No recent papers available</li>
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
                {isSaved ? <StarIcon className="mr-2 h-4 w-4 fill-current" /> : <Star className="mr-2 h-4 w-4" />}
                {isSaved ? "Unsave" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
