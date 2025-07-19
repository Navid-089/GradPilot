"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Award, Search, Calendar, DollarSign, ExternalLink, Star, Check } from "lucide-react"
import { getScholarships } from "@/lib/scholarship-service"

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([])
  const [filteredScholarships, setFilteredScholarships] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("deadline")

  const [filters, setFilters] = useState({
    providers: [],
    coverageTypes: [],
  })

  const providers = ["USA Government", "DAAD", "Fulbright", "University Specific", "Private Foundation", "Government"]
  const coverageTypes = ["Full tuition", "Partial tuition", "Monthly stipend", "Travel allowance", "Health insurance"]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getScholarships()
        setScholarships(data)
        setFilteredScholarships(data)
      } catch (error) {
        console.error("Error fetching scholarship data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Apply filters and search
    let result = [...scholarships]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (scholarship) =>
          scholarship.title.toLowerCase().includes(query) || scholarship.provider.toLowerCase().includes(query),
      )
    }

    // Apply provider filter
    if (filters.providers.length > 0) {
      result = result.filter((scholarship) => filters.providers.includes(scholarship.provider))
    }

    // Apply coverage type filter
    if (filters.coverageTypes.length > 0) {
      result = result.filter((scholarship) => filters.coverageTypes.some((type) => scholarship.amount.includes(type)))
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

    setFilteredScholarships(result)
  }, [searchQuery, filters, scholarships, sortBy])

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Finding scholarships for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scholarship Finder</h1>
        <p className="text-muted-foreground">Discover scholarships tailored to your profile</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Refine your scholarship search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scholarships..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Scholarships</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="applied">Applied</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 mt-4">
              {filteredScholarships.length > 0 ? (
                filteredScholarships.map((scholarship) => (
                  <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                ))
              ) : (
                <div className="text-center py-10">
                  <Award className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No scholarships found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="saved" className="space-y-4 mt-4">
              <div className="text-center py-10">
                <Star className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No saved scholarships</h3>
                <p className="text-muted-foreground">Save scholarships to track them here</p>
              </div>
            </TabsContent>
            <TabsContent value="applied" className="space-y-4 mt-4">
              <div className="text-center py-10">
                <Check className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No applications yet</h3>
                <p className="text-muted-foreground">Scholarships you've applied to will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function ScholarshipCard({ scholarship }) {
  return (
    <Card>
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
              <Button variant="default" asChild>
                <a href={scholarship.applyLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Apply Now
                </a>
              </Button>
              <Button variant="outline">
                <Star className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline">
                <Check className="mr-2 h-4 w-4" />
                Mark as Applied
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
