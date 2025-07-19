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
import { Award, Search, Calendar, DollarSign, ExternalLink, Star, Check, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react"
import { getScholarships } from "@/lib/scholarship-service"
import { trackerService } from "@/lib/tracker-service"
import { applicationService } from "@/lib/application-service"
import { useAuth } from "@/lib/auth-context"

export default function ScholarshipsPage() {
  const { user } = useAuth()
  const [scholarships, setScholarships] = useState([])
  const [filteredScholarships, setFilteredScholarships] = useState([])
  const [savedScholarships, setSavedScholarships] = useState([])
  const [appliedScholarships, setAppliedScholarships] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("deadline")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 6

  const [filters, setFilters] = useState({
    providers: [],
    coverageTypes: [],
  })

  const providers = [
    "USA Government", 
    "DAAD", 
    "Gates Foundation",
    "UK Government",
    "European Union",
    "Government", 
    "Private Foundation",
    "University Specific"
  ]
  const coverageTypes = ["Full tuition", "Partial tuition", "Monthly stipend", "Travel allowance", "Health insurance"]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getScholarships()
        setScholarships(data)
        setFilteredScholarships(data)
        
        // Load saved scholarships and applications
        if (user) {
          await loadSavedScholarships(data)
          await loadAppliedScholarships(data)
        }
      } catch (error) {
        console.error("Error fetching scholarship data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Load saved scholarships from backend
  const loadSavedScholarships = async (allScholarships = scholarships) => {
    try {
      const savedTasks = await trackerService.getUserTasksByType('scholarship')
      const savedScholarshipIds = savedTasks.map(task => task.scholarshipId)
      const saved = allScholarships.filter(scholarship => savedScholarshipIds.includes(scholarship.id))
      setSavedScholarships(saved)
    } catch (error) {
      console.error("Error loading saved scholarships:", error)
    }
  }

  // Save a scholarship with blur effect
  const handleSaveScholarship = async (scholarshipId) => {
    try {
      // Add visual feedback with blur effect
      const scholarshipElement = document.querySelector(`[data-scholarship-id="${scholarshipId}"]`)
      if (scholarshipElement) {
        scholarshipElement.style.filter = 'blur(2px)'
        scholarshipElement.style.opacity = '0.7'
        scholarshipElement.style.transition = 'all 0.3s ease-in-out'
      }

      await trackerService.saveTask('scholarship', scholarshipId)
      await loadSavedScholarships()
      
      // Remove from filtered scholarships if in "all" tab
      if (activeTab === "all") {
        setFilteredScholarships(prev => prev.filter(scholarship => scholarship.id !== scholarshipId))
      }
    } catch (error) {
      console.error("Error saving scholarship:", error)
      alert("Failed to save scholarship")
      
      // Reset visual feedback on error
      const scholarshipElement = document.querySelector(`[data-scholarship-id="${scholarshipId}"]`)
      if (scholarshipElement) {
        scholarshipElement.style.filter = 'none'
        scholarshipElement.style.opacity = '1'
      }
    }
  }

  // Unsave a scholarship with blur effect
  const handleUnsaveScholarship = async (scholarshipId) => {
    try {
      // Add visual feedback with blur effect
      const scholarshipElement = document.querySelector(`[data-scholarship-id="${scholarshipId}"]`)
      if (scholarshipElement) {
        scholarshipElement.style.filter = 'blur(2px)'
        scholarshipElement.style.opacity = '0.7'
        scholarshipElement.style.transition = 'all 0.3s ease-in-out'
      }

      await trackerService.removeTask('scholarship', scholarshipId)
      setSavedScholarships(prev => prev.filter(scholarship => scholarship.id !== scholarshipId))
      
      // Add back to all scholarships if in "all" tab
      if (activeTab === "all") {
        const scholarshipToAdd = scholarships.find(scholarship => scholarship.id === scholarshipId)
        if (scholarshipToAdd) {
          setFilteredScholarships(prev => [...prev, scholarshipToAdd])
        }
      }
    } catch (error) {
      console.error("Error unsaving scholarship:", error)
      alert("Failed to unsave scholarship")
      
      // Reset visual feedback on error
      const scholarshipElement = document.querySelector(`[data-scholarship-id="${scholarshipId}"]`)
      if (scholarshipElement) {
        scholarshipElement.style.filter = 'none'
        scholarshipElement.style.opacity = '1'
      }
    }
  }

  // Load applied scholarships from backend
  const loadAppliedScholarships = async (allScholarships = scholarships) => {
    try {
      const applications = await applicationService.getUserApplications()
      const appliedScholarshipIds = applications.map(app => app.scholarshipId)
      const applied = allScholarships.filter(scholarship => appliedScholarshipIds.includes(scholarship.id))
      setAppliedScholarships(applied)
    } catch (error) {
      console.error("Error loading applied scholarships:", error)
    }
  }

  // Apply to a scholarship with blur effect
  const handleApplyToScholarship = async (scholarshipId) => {
    try {
      // Add visual feedback with blur effect
      const scholarshipElement = document.querySelector(`[data-scholarship-id="${scholarshipId}"]`)
      if (scholarshipElement) {
        scholarshipElement.style.filter = 'blur(2px)'
        scholarshipElement.style.opacity = '0.7'
        scholarshipElement.style.transition = 'all 0.3s ease-in-out'
      }

      await applicationService.applyToScholarship(scholarshipId)
      await loadAppliedScholarships()
      
      // Remove from filtered scholarships if in "all" tab
      if (activeTab === "all") {
        setFilteredScholarships(prev => prev.filter(scholarship => scholarship.id !== scholarshipId))
      }
    } catch (error) {
      console.error("Error applying to scholarship:", error)
      alert("Failed to apply to scholarship")
      
      // Reset visual feedback on error
      const scholarshipElement = document.querySelector(`[data-scholarship-id="${scholarshipId}"]`)
      if (scholarshipElement) {
        scholarshipElement.style.filter = 'none'
        scholarshipElement.style.opacity = '1'
      }
    }
  }

  // Remove application from a scholarship with blur effect
  const handleRemoveApplication = async (scholarshipId) => {
    try {
      // Add visual feedback with blur effect
      const scholarshipElement = document.querySelector(`[data-scholarship-id="${scholarshipId}"]`)
      if (scholarshipElement) {
        scholarshipElement.style.filter = 'blur(2px)'
        scholarshipElement.style.opacity = '0.7'
        scholarshipElement.style.transition = 'all 0.3s ease-in-out'
      }

      await applicationService.removeApplication(scholarshipId)
      setAppliedScholarships(prev => prev.filter(scholarship => scholarship.id !== scholarshipId))
      
      // Add back to all scholarships if in "all" tab
      if (activeTab === "all") {
        const scholarshipToAdd = scholarships.find(scholarship => scholarship.id === scholarshipId)
        if (scholarshipToAdd) {
          setFilteredScholarships(prev => [...prev, scholarshipToAdd])
        }
      }
    } catch (error) {
      console.error("Error removing application:", error)
      alert("Failed to remove application")
      
      // Reset visual feedback on error
      const scholarshipElement = document.querySelector(`[data-scholarship-id="${scholarshipId}"]`)
      if (scholarshipElement) {
        scholarshipElement.style.filter = 'none'
        scholarshipElement.style.opacity = '1'
      }
    }
  }

  // Check if scholarship is applied to
  const isScholarshipApplied = (scholarshipId) => {
    return appliedScholarships.some(scholarship => scholarship.id === scholarshipId)
  }

  // Check if scholarship is saved
  const isScholarshipSaved = (scholarshipId) => {
    return savedScholarships.some(scholarship => scholarship.id === scholarshipId)
  }

  useEffect(() => {
    // Apply filters and search
    let result = [...scholarships]
    
    console.log("=== SCHOLARSHIP FILTERING DEBUG ===")
    console.log("Total scholarships:", scholarships.length)
    console.log("Active tab:", activeTab)
    console.log("Search query:", searchQuery)
    console.log("Provider filters:", filters.providers)
    console.log("Coverage filters:", filters.coverageTypes)

    // Exclude saved scholarships and applied scholarships from "all" tab
    if (activeTab === "all") {
      const savedScholarshipIds = savedScholarships.map(scholarship => scholarship.id)
      const appliedScholarshipIds = appliedScholarships.map(scholarship => scholarship.id)
      result = result.filter(scholarship => 
        !savedScholarshipIds.includes(scholarship.id) && 
        !appliedScholarshipIds.includes(scholarship.id)
      )
      console.log("After excluding saved and applied scholarships:", result.length)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (scholarship) =>
          scholarship.title.toLowerCase().includes(query) ||
          scholarship.provider.toLowerCase().includes(query)
      )
      console.log("After search filter:", result.length)
    }

    // Apply provider filter
    if (filters.providers.length > 0) {
      const beforeCount = result.length
      result = result.filter((scholarship) => {
        const matches = filters.providers.includes(scholarship.provider)
        if (!matches) {
          console.log(`Scholarship "${scholarship.title}" with provider "${scholarship.provider}" doesn't match filters:`, filters.providers)
        }
        return matches
      })
      console.log(`After provider filter: ${result.length} (was ${beforeCount})`)
    }

    // Apply coverage type filter
    if (filters.coverageTypes.length > 0) {
      const beforeCount = result.length
      result = result.filter((scholarship) => filters.coverageTypes.some((type) => scholarship.amount.includes(type)))
      console.log(`After coverage filter: ${result.length} (was ${beforeCount})`)
    }

    // Apply sorting
    switch (sortBy) {
      case "deadline":
        result.sort((a, b) => {
          const dateA = new Date(a.deadline)
          const dateB = new Date(b.deadline)
          return dateA.getTime() - dateB.getTime() // Soonest first
        })
        break
      case "amount":
        result.sort((a, b) => {
          // Extract numeric values from amount strings for comparison
          const getAmountValue = (amount) => {
            if (!amount || amount === 'Contact for details') return 0
            
            const amountLower = amount.toLowerCase()
            let value = 0
            
            // Base tuition values
            if (amountLower.includes('full tuition')) {
              value += 50000 // Base value for full tuition
            } else if (amountLower.includes('partial tuition')) {
              value += 25000 // Base value for partial tuition
            } else if (amountLower.includes('tuition')) {
              value += 30000 // Generic tuition
            }
            
            // Extract specific dollar amounts
            const dollarMatches = amountLower.match(/\$[\d,]+/g)
            if (dollarMatches) {
              dollarMatches.forEach(match => {
                const numValue = parseInt(match.replace(/[$,]/g, ''))
                value += numValue
              })
            }
            
            // Add values for additional benefits
            if (amountLower.includes('monthly stipend') || amountLower.includes('living allowance')) {
              value += 15000 // Annual equivalent of monthly stipend
            }
            if (amountLower.includes('stipend') && !amountLower.includes('monthly')) {
              value += 12000 // General stipend
            }
            if (amountLower.includes('airfare') || amountLower.includes('travel')) {
              value += 2000 // Travel allowance
            }
            if (amountLower.includes('health insurance') || amountLower.includes('insurance')) {
              value += 3000 // Health insurance value
            }
            if (amountLower.includes('monthly allowance')) {
              value += 18000 // Annual equivalent
            }
            
            return value
          }
          return getAmountValue(b.amount) - getAmountValue(a.amount) // Highest first
        })
        break
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title)) // A-Z
        break
      default:
        break
    }

    console.log("Final filtered scholarships:", result.length)
    
    // Calculate pagination
    setTotalElements(result.length)
    setTotalPages(Math.ceil(result.length / pageSize))

    // Apply pagination
    const startIndex = currentPage * pageSize
    const endIndex = startIndex + pageSize
    const paginatedResult = result.slice(startIndex, endIndex)

    setFilteredScholarships(paginatedResult)
  }, [searchQuery, filters, scholarships, savedScholarships, appliedScholarships, activeTab, sortBy, currentPage, pageSize])

  // Reset pagination when search or filters change
  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0)
    }
  }, [searchQuery, filters, sortBy])

  const handleProviderChange = (provider) => {
    setFilters((prev) => {
      const updatedProviders = prev.providers.includes(provider)
        ? prev.providers.filter((p) => p !== provider)
        : [...prev.providers, provider]

      return {
        ...prev,
        providers: updatedProviders,
      }
    })
  }

  const handleCoverageTypeChange = (type) => {
    setFilters((prev) => {
      const updatedTypes = prev.coverageTypes.includes(type)
        ? prev.coverageTypes.filter((t) => t !== type)
        : [...prev.coverageTypes, type]

      return {
        ...prev,
        coverageTypes: updatedTypes,
      }
    })
  }

  const resetFilters = () => {
    setFilters({
      providers: [],
      coverageTypes: [],
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
            <h1 className="text-3xl font-bold tracking-tight">Scholarship Finder</h1>
            <p className="text-muted-foreground">Discover scholarships tailored to your profile</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters */}
            <Card className="md:col-span-1">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Filters</h3>
                  <p className="text-sm text-muted-foreground mb-4">Refine your scholarship search</p>
                </div>

                <div className="space-y-2">
                  <Label>Providers</Label>
                  <div className="space-y-2">
                    {providers.map((provider) => (
                      <div key={provider} className="flex items-center space-x-2">
                        <Checkbox
                          id={`provider-${provider}`}
                          checked={filters.providers.includes(provider)}
                          onCheckedChange={() => handleProviderChange(provider)}
                        />
                        <Label htmlFor={`provider-${provider}`} className="cursor-pointer">
                          {provider}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Coverage Types</Label>
                  <div className="space-y-2">
                    {coverageTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={filters.coverageTypes.includes(type)}
                          onCheckedChange={() => handleCoverageTypeChange(type)}
                        />
                        <Label htmlFor={`type-${type}`} className="cursor-pointer">
                          {type}
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

            {/* Scholarship List */}
            <div className="md:col-span-3 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search scholarships..."
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
                    <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
                    <SelectItem value="amount">Amount (Highest)</SelectItem>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page Info */}
              {!isLoading && totalElements > 0 && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} scholarships</span>
                  <span>Page {currentPage + 1} of {totalPages}</span>
                </div>
              )}

              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All Scholarships</TabsTrigger>
                  <TabsTrigger value="saved">Saved ({savedScholarships.length})</TabsTrigger>
                  <TabsTrigger value="applied">Applied ({appliedScholarships.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4 mt-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredScholarships.length > 0 ? (
                    filteredScholarships.map((scholarship) => (
                      <ScholarshipCard 
                        key={scholarship.id} 
                        scholarship={scholarship} 
                        onSave={handleSaveScholarship}
                        onUnsave={handleUnsaveScholarship}
                        onApply={handleApplyToScholarship}
                        onRemoveApplication={handleRemoveApplication}
                        isSaved={isScholarshipSaved(scholarship.id)}
                        isApplied={isScholarshipApplied(scholarship.id)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <Award className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No scholarships found</h3>
                      <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                    </div>
                  )}
                  
                  {/* Pagination Controls */}
                  {!isLoading && totalPages > 1 && activeTab === "all" && (
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
                    // Apply filtering and search to saved scholarships
                    let filteredSaved = [...savedScholarships]
                    
                    // Apply search query
                    if (searchQuery) {
                      const query = searchQuery.toLowerCase()
                      filteredSaved = filteredSaved.filter(
                        (scholarship) =>
                          scholarship.title.toLowerCase().includes(query) ||
                          scholarship.provider.toLowerCase().includes(query)
                      )
                    }

                    // Apply provider filter
                    if (filters.providers.length > 0) {
                      filteredSaved = filteredSaved.filter((scholarship) => {
                        return filters.providers.includes(scholarship.provider)
                      })
                    }

                    // Apply coverage type filter
                    if (filters.coverageTypes.length > 0) {
                      filteredSaved = filteredSaved.filter((scholarship) => filters.coverageTypes.some((type) => scholarship.amount.includes(type)))
                    }

                    // Apply sorting
                    switch (sortBy) {
                      case "deadline":
                        filteredSaved.sort((a, b) => {
                          const dateA = new Date(a.deadline)
                          const dateB = new Date(b.deadline)
                          return dateA.getTime() - dateB.getTime() // Soonest first
                        })
                        break
                      case "amount":
                        filteredSaved.sort((a, b) => {
                          // Extract numeric values from amount strings for comparison
                          const getAmountValue = (amount) => {
                            const cleanAmount = amount.toLowerCase()
                            if (cleanAmount.includes('full')) return 100000
                            if (cleanAmount.includes('$')) {
                              const match = cleanAmount.match(/\$?(\d+(?:,\d+)*(?:\.\d+)?)/);
                              return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
                            }
                            return 0
                          }
                          return getAmountValue(b.amount) - getAmountValue(a.amount) // Highest first
                        })
                        break
                      case "title":
                        filteredSaved.sort((a, b) => a.title.localeCompare(b.title)) // A-Z
                        break
                      default:
                        break
                    }

                    return filteredSaved.length > 0 ? (
                      <>
                        {filteredSaved.map((scholarship) => (
                          <ScholarshipCard 
                            key={scholarship.id} 
                            scholarship={scholarship} 
                            onSave={handleSaveScholarship}
                            onUnsave={handleUnsaveScholarship}
                            onApply={handleApplyToScholarship}
                            onRemoveApplication={handleRemoveApplication}
                            isSaved={true}
                            isApplied={isScholarshipApplied(scholarship.id)}
                          />
                        ))}
                        {filteredSaved.length !== savedScholarships.length && (
                          <div className="text-center text-sm text-muted-foreground mt-4">
                            Showing {filteredSaved.length} of {savedScholarships.length} saved scholarships
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-10">
                        <Star className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">
                          {savedScholarships.length === 0 ? "No saved scholarships" : "No scholarships match your filters"}
                        </h3>
                        <p className="text-muted-foreground">
                          {savedScholarships.length === 0 ? "Save scholarships to track them here" : "Try adjusting your filters or search query"}
                        </p>
                      </div>
                    )
                  })()}
                </TabsContent>
                <TabsContent value="applied" className="space-y-4 mt-4">
                  {(() => {
                    // Apply filtering and search to applied scholarships
                    let filteredApplied = [...appliedScholarships]
                    
                    // Apply search query
                    if (searchQuery) {
                      const query = searchQuery.toLowerCase()
                      filteredApplied = filteredApplied.filter(
                        (scholarship) =>
                          scholarship.title.toLowerCase().includes(query) ||
                          scholarship.provider.toLowerCase().includes(query)
                      )
                    }

                    // Apply provider filter
                    if (filters.providers.length > 0) {
                      filteredApplied = filteredApplied.filter((scholarship) => {
                        return filters.providers.includes(scholarship.provider)
                      })
                    }

                    // Apply coverage type filter
                    if (filters.coverageTypes.length > 0) {
                      filteredApplied = filteredApplied.filter((scholarship) => filters.coverageTypes.some((type) => scholarship.amount.includes(type)))
                    }

                    // Apply sorting
                    switch (sortBy) {
                      case "deadline":
                        filteredApplied.sort((a, b) => {
                          const dateA = new Date(a.deadline)
                          const dateB = new Date(b.deadline)
                          return dateA.getTime() - dateB.getTime() // Soonest first
                        })
                        break
                      case "amount":
                        filteredApplied.sort((a, b) => {
                          // Extract numeric values from amount strings for comparison
                          const getAmountValue = (amount) => {
                            const cleanAmount = amount.toLowerCase()
                            if (cleanAmount.includes('full')) return 100000
                            if (cleanAmount.includes('$')) {
                              const match = cleanAmount.match(/\$?(\d+(?:,\d+)*(?:\.\d+)?)/);
                              return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
                            }
                            return 0
                          }
                          return getAmountValue(b.amount) - getAmountValue(a.amount) // Highest first
                        })
                        break
                      case "title":
                        filteredApplied.sort((a, b) => a.title.localeCompare(b.title)) // A-Z
                        break
                      default:
                        break
                    }

                    return filteredApplied.length > 0 ? (
                      <>
                        {filteredApplied.map((scholarship) => (
                          <ScholarshipCard 
                            key={scholarship.id} 
                            scholarship={scholarship} 
                            onSave={handleSaveScholarship}
                            onUnsave={handleUnsaveScholarship}
                            onApply={handleApplyToScholarship}
                            onRemoveApplication={handleRemoveApplication}
                            isSaved={isScholarshipSaved(scholarship.id)}
                            isApplied={true}
                          />
                        ))}
                        {filteredApplied.length !== appliedScholarships.length && (
                          <div className="text-center text-sm text-muted-foreground mt-4">
                            Showing {filteredApplied.length} of {appliedScholarships.length} applied scholarships
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-10">
                        <Check className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">
                          {appliedScholarships.length === 0 ? "No applications yet" : "No scholarships match your filters"}
                        </h3>
                        <p className="text-muted-foreground">
                          {appliedScholarships.length === 0 ? "Scholarships you've applied to will appear here" : "Try adjusting your filters or search query"}
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

function ScholarshipCard({ scholarship, onSave, onUnsave, onApply, onRemoveApplication, isSaved, isApplied }) {
  const handleSaveToggle = () => {
    if (isSaved) {
      onUnsave(scholarship.id)
    } else {
      onSave(scholarship.id)
    }
  }

  const handleApplyToggle = () => {
    if (isApplied) {
      onRemoveApplication(scholarship.id)
    } else {
      onApply(scholarship.id)
    }
  }

  return (
    <Card data-scholarship-id={scholarship.id}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Award className="h-8 w-8" />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold">{scholarship.title}</h3>
                <p className="text-muted-foreground">Provider: {scholarship.provider}</p>
              </div>
              <Badge variant="outline" className={`w-fit ${getDeadlineColor(scholarship.deadline)}`}>
                {getDaysUntilDeadline(scholarship.deadline)} days left
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Application Deadline</p>
                  <p className="text-sm text-muted-foreground">{scholarship.deadline}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-sm text-muted-foreground">{scholarship.amount}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {!isApplied && (
                <>
                  <Button variant="default" asChild>
                    <a href={scholarship.applyLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Apply Now
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
                </>
              )}
              <Button 
                variant={isApplied ? "default" : "outline"}
                size="sm"
                onClick={handleApplyToggle}
                className={isApplied ? "bg-red-600 hover:bg-red-700 text-white" : ""}
              >
                <Check className="mr-2 h-4 w-4" />
                {isApplied ? "Unmark as Applied" : "Mark as Applied"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getDaysUntilDeadline(deadlineStr) {
  const deadlineParts = deadlineStr.split("-")
  const deadline = new Date(
    Number.parseInt(deadlineParts[0]),
    Number.parseInt(deadlineParts[1]) - 1,
    Number.parseInt(deadlineParts[2]),
  )
  const today = new Date()
  const diffTime = deadline.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

function getDeadlineColor(deadlineStr) {
  const days = getDaysUntilDeadline(deadlineStr)
  
  if (days <= 30) {
    // Within 1 month - red/urgent
    return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
  } else if (days <= 90) {
    // 1-3 months - yellow/warning  
    return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
  } else {
    // More than 3 months - default/white
    return "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
  }
}
