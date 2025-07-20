"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle, User, BookOpen, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { MainNav } from "@/components/main-nav"

export default function ProfileSetupPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("personal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleNextTab = () => {
    if (activeTab === "personal") setActiveTab("academic")
    else if (activeTab === "academic") setActiveTab("interests")
    else if (activeTab === "interests") handleSubmit()
  }

  const handlePrevTab = () => {
    if (activeTab === "interests") setActiveTab("academic")
    else if (activeTab === "academic") setActiveTab("personal")
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsComplete(true)
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    }, 1500)
  }

  if (isComplete) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Profile Setup Complete!</h2>
              <p className="text-muted-foreground mb-6">
                Your profile has been successfully set up. You'll be redirected to your dashboard in a moment.
              </p>
              <Button className="w-full" onClick={() => router.push("/dashboard")}>
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Complete Your Profile</h1>
            <p className="text-muted-foreground mt-2">
              Help us personalize your experience by providing some information about yourself.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full overflow-x-auto">
              <TabsTrigger value="personal" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="academic" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Academic Background
              </TabsTrigger>
              <TabsTrigger value="interests" className="flex items-center">
                <Award className="mr-2 h-4 w-4" />
                Interests & Goals
              </TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Tell us a bit about yourself. This information will be used to personalize your experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue={user?.name?.split(" ")[0] || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue={user?.name?.split(" ")[1] || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                      <p className="text-sm text-muted-foreground">Your email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="location">Location</Label>
                      <Select defaultValue="us">
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleNextTab}>
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Academic Background */}
            <TabsContent value="academic">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Background</CardTitle>
                  <CardDescription>Tell us about your educational background and achievements.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="university">Current/Previous University</Label>
                      <Input id="university" placeholder="e.g., University of California, Berkeley" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="major">Major/Field of Study</Label>
                      <Input id="major" placeholder="e.g., Computer Science" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="degree">Highest Degree Earned</Label>
                      <Select defaultValue="bachelors">
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="associates">Associate's</SelectItem>
                          <SelectItem value="bachelors">Bachelor's</SelectItem>
                          <SelectItem value="masters">Master's</SelectItem>
                          <SelectItem value="phd">Ph.D.</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gpa">GPA (out of 4.0)</Label>
                      <Input id="gpa" type="number" step="0.01" min="0" max="4.0" placeholder="e.g., 3.8" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="test-scores">Test Scores</Label>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="gre">GRE</Label>
                          <Input id="gre" placeholder="e.g., 320" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="toefl">TOEFL</Label>
                          <Input id="toefl" placeholder="e.g., 100" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ielts">IELTS</Label>
                          <Input id="ielts" placeholder="e.g., 7.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevTab}>
                    Previous Step
                  </Button>
                  <Button onClick={handleNextTab}>
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Interests & Goals */}
            <TabsContent value="interests">
              <Card>
                <CardHeader>
                  <CardTitle>Interests & Goals</CardTitle>
                  <CardDescription>Tell us about your research interests and graduate school goals.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base">Target Degree</Label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="masters" />
                          <Label htmlFor="masters">Master's</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="phd" defaultChecked />
                          <Label htmlFor="phd">Ph.D.</Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base">Research Interests</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Select all that apply to your research interests.
                      </p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="ai" defaultChecked />
                          <Label htmlFor="ai">Artificial Intelligence</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="ml" defaultChecked />
                          <Label htmlFor="ml">Machine Learning</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="nlp" />
                          <Label htmlFor="nlp">Natural Language Processing</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="cv" />
                          <Label htmlFor="cv">Computer Vision</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="robotics" />
                          <Label htmlFor="robotics">Robotics</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="security" />
                          <Label htmlFor="security">Cybersecurity</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="systems" />
                          <Label htmlFor="systems">Systems & Networking</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="theory" />
                          <Label htmlFor="theory">Theory & Algorithms</Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base">Target Countries</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Select countries where you're interested in studying.
                      </p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="usa" defaultChecked />
                          <Label htmlFor="usa">United States</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="canada" defaultChecked />
                          <Label htmlFor="canada">Canada</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="uk" />
                          <Label htmlFor="uk">United Kingdom</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="germany" />
                          <Label htmlFor="germany">Germany</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="australia" />
                          <Label htmlFor="australia">Australia</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="other-countries" />
                          <Label htmlFor="other-countries">Other</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="statement">Brief Statement of Purpose</Label>
                      <textarea
                        id="statement"
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Briefly describe your research interests and career goals..."
                      />
                      <p className="text-sm text-muted-foreground">
                        This helps us match you with relevant universities and professors.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevTab}>
                    Previous Step
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete Setup
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
