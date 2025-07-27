"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { GraduationCap, Save, Upload, FileText, User, Book, Award } from "lucide-react"
import { getCurrentUser } from "@/lib/auth-service"

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Dropdown options state
  const [countryOptions, setCountryOptions] = useState([])
  const [majorOptions, setMajorOptions] = useState([])
  const [researchInterestOptions, setResearchInterestOptions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user first
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.email) {
          console.error("No authenticated user found");
          router.push('/login'); // Redirect to login
          return;
        }

        // Fetch profile directly from backend and dropdown options in parallel
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const [profileResponse, countries, majors, interests] = await Promise.all([
          fetch(`/api/profile?email=${currentUser.email}`, { headers }),
          fetch("/api/countries").then(res => res.json()),
          fetch("/api/majors").then(res => res.json()),
          fetch("/api/research-interests").then(res => res.json())
        ]);

        if (!profileResponse.ok) {
          throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        setProfile(profileData);
        setCountryOptions(countries);
        setMajorOptions(majors);
        setResearchInterestOptions(interests);
      } catch (error) {
        console.error("Error fetching data:", error);
        // If there's an authentication error, redirect to login
        if (error.message.includes('401') || error.message.includes('authentication')) {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleTestScoreChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      testScores: {
        ...prev.testScores,
        [name]: value,
      },
    }))
  }

  const handleCheckboxChange = (category, itemId) => {
    setProfile((prev) => {
      const currentItems = prev[category] || []
      return {
        ...prev,
        [category]: currentItems.includes(itemId) 
          ? currentItems.filter((id) => id !== itemId) 
          : [...currentItems, itemId],
      }
    })
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Parse JWT token to get user email
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userEmail = payload.sub;

      const response = await fetch(`/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profile,
          email: userEmail, // Include email in the request body
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${response.status} - ${errorText}`);
      }

      await response.json();
      alert("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b bg-background">
          <div className="container mx-auto px-4 py-4">
            <MainNav />
          </div>
        </header>

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b bg-background">
          <div className="container mx-auto px-4 py-4">
            <MainNav />
          </div>
        </header>

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">Could not load your profile. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
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
                © 2025 GradPilot. Developed by Souvik Mandol, Ananya Shahrin Promi, and Wahid Al Azad Navid.
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
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">Manage your academic profile and preferences</p>
          </div>

          <Tabs defaultValue="academic">
            <TabsList className="mb-6">
              <TabsTrigger value="academic">
                <User className="mr-2 h-4 w-4" />
                Academic Info
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Book className="mr-2 h-4 w-4" />
                Preferences
              </TabsTrigger>
              {/* <TabsTrigger value="documents">
                <FileText className="mr-2 h-4 w-4" />
                Documents
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value="academic">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your basic information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={profile.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gpa">GPA / CGPA (out of 4.0)</Label>
                      <Input
                        id="gpa"
                        name="gpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        value={profile.gpa}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        id="gender"
                        name="gender"
                        value={profile.gender || ""}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select gender (optional)</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Test Scores</CardTitle>
                    <CardDescription>Update your standardized test scores</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="GRE">GRE</Label>
                      <Input
                        id="GRE"
                        name="GRE"
                        value={profile.testScores.GRE}
                        onChange={handleTestScoreChange}
                        placeholder="320"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="IELTS">IELTS</Label>
                      <Input
                        id="IELTS"
                        name="IELTS"
                        value={profile.testScores.IELTS}
                        onChange={handleTestScoreChange}
                        placeholder="7.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="TOEFL">TOEFL</Label>
                      <Input
                        id="TOEFL"
                        name="TOEFL"
                        value={profile.testScores.TOEFL || ""}
                        onChange={handleTestScoreChange}
                        placeholder="100"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preferences">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Target Countries</CardTitle>
                    <CardDescription>Select countries where you want to study</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {countryOptions.map((country) => (
                        <div key={country.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`country-${country.id}`}
                            checked={profile.targetCountries && profile.targetCountries.includes(country.id)}
                            onCheckedChange={() => handleCheckboxChange("targetCountries", country.id)}
                          />
                          <Label htmlFor={`country-${country.id}`} className="cursor-pointer">
                            {country.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Target Majors</CardTitle>
                    <CardDescription>Select majors you're interested in</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {majorOptions.map((major) => (
                        <div key={major.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`major-${major.id}`}
                            checked={profile.targetMajors && profile.targetMajors.includes(major.id)}
                            onCheckedChange={() => handleCheckboxChange("targetMajors", major.id)}
                          />
                          <Label htmlFor={`major-${major.id}`} className="cursor-pointer">
                            {major.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Research Interests</CardTitle>
                    <CardDescription>Select research areas you're interested in</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {researchInterestOptions.map((interest) => (
                        <div key={interest.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`interest-${interest.id}`}
                            checked={profile.researchInterests && profile.researchInterests.includes(interest.id)}
                            onCheckedChange={() => handleCheckboxChange("researchInterests", interest.id)}
                          />
                          <Label htmlFor={`interest-${interest.id}`} className="cursor-pointer">
                            {interest.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* <TabsContent value="documents">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>CV / Resume</CardTitle>
                    <CardDescription>Upload your latest CV or resume</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-8">
                      <div className="text-center">
                        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your CV here, or click to browse
                        </p>
                        <Button variant="outline" size="sm">
                          Upload CV
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statement of Purpose</CardTitle>
                    <CardDescription>Upload your statement of purpose</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-8">
                      <div className="text-center">
                        <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your SOP here, or click to browse
                        </p>
                        <Button variant="outline" size="sm">
                          Upload SOP
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Academic Transcripts</CardTitle>
                    <CardDescription>Upload your academic transcripts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-8">
                      <div className="text-center">
                        <Award className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your transcripts here, or click to browse
                        </p>
                        <Button variant="outline" size="sm">
                          Upload Transcripts
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent> */}
          </Tabs>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
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
