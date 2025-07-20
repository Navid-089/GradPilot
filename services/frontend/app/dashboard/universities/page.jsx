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

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([])
  const [filteredUniversities, setFilteredUniversities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const [filters, setFilters] = useState({
    countries: [],
    minMatchScore: 0,
    maxTuition: 50000,
    researchAreas: [],
  })

  const countries = ["USA", "UK", "Canada", "Germany", "Australia", "Singapore", "Japan"]
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
        setUniversities(data)
        setFilteredUniversities(data)
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

  const resetFilters = () => {
    setFilters({
      countries: [],
      minMatchScore: 0,
      maxTuition: 50000,
      researchAreas: [],
    })
    setSearchQuery("")
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
                filteredUniversities.map((university) => <UniversityCard key={university.id} university={university} />)
              ) : (
                <div className="text-center py-10">
                  <School className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No universities found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="saved" className="space-y-4 mt-4">
              <div className="text-center py-10">
                <Star className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No saved universities</h3>
                <p className="text-muted-foreground">Save universities to track them here</p>
              </div>
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

function UniversityCard({ university }) {
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
                  <span>{university.location}</span>
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
                  <p className="text-sm text-muted-foreground">{university.deadline}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tuition</p>
                  <p className="text-sm text-muted-foreground">${university.tuition.toLocaleString()}/year</p>
                </div>
              </div>
              <div className="flex items-center">
                <StarHalf className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Ranking</p>
                  <p className="text-sm text-muted-foreground">#{university.ranking} Worldwide</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Research Areas</p>
              <div className="flex flex-wrap gap-2">
                {university.researchAreas.map((area, index) => (
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
              <Button variant="outline">
                <Star className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
