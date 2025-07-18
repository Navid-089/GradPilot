"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const countries = [
  "United States", "Canada", "United Kingdom", "Australia"
  // ...add all countries you want
];

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gpa: "",
    testScores: {
      GRE: "",
      IELTS: "",
      TOFEL: ""
    },
    targetCountries: [],
    targetMajors: [],
    researchInterests: [],
    deadlineYear: ""
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { register } = useAuth()
  const [currentInterest, setCurrentInterest] = useState("");
  const [currentMajor, setCurrentMajor] = useState("");

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentCountries = prev.targetCountries || [];
      if (checked) {
        return {
          ...prev,
          targetCountries: [...currentCountries, value]
        };
      } else {
        return {
          ...prev,
          targetCountries: currentCountries.filter(country => country !== value)
        };
      }
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "targetCountries") {
      setFormData(prev => {
        const currentCountries = prev.targetCountries || [];
        if (checked) {
          return {
            ...prev,
            targetCountries: [...currentCountries, value]
          };
        } else {
          return {
            ...prev,
            targetCountries: currentCountries.filter(country => country !== value)
          };
        }
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // === Required fields ===
    if (!formData.name.trim()) {
      setError("Full Name is required.")
      return
    }
    if (!formData.email.trim()) {
      setError("Email is required.")
      return
    }
    if (!formData.password) {
      setError("Password is required.")
      return
    }
    if (!formData.confirmPassword) {
      setError("Please confirm your password.")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    // === Optional fields: Validate only if not empty ===
    if (
      formData.gpa &&
      (isNaN(formData.gpa) || formData.gpa < 0 || formData.gpa > 4)
    ) {
      setError("Please enter a valid GPA between 0 and 4.0.");
      return;
    }

    if (
      formData.testScores.GRE &&
      (isNaN(formData.testScores.GRE) || formData.testScores.GRE < 260 || formData.testScores.GRE > 340)
    ) {
      setError("Please enter a valid GRE score between 260 and 340.");
      return;
    }

    if (
      formData.testScores.IELTS &&
      (isNaN(formData.testScores.IELTS) || formData.testScores.IELTS < 0 || formData.testScores.IELTS > 9)
    ) {
      setError("Please enter a valid IELTS score between 0 and 9.");
      return;
    }

    if (
      formData.testScores.TOFEL &&
      (isNaN(formData.testScores.TOFEL) || formData.testScores.TOFEL < 0 || formData.testScores.TOFEL > 120)
    ) {
      setError("Please enter a valid TOEFL score between 0 and 120.");
      return;
    }

    const currentYear = new Date().getFullYear();
    if (
      formData.deadlineYear &&
      (isNaN(formData.deadlineYear) ||
        formData.deadlineYear < currentYear ||
        formData.deadlineYear > currentYear + 10)
    ) {
      setError(`Please enter a valid deadline year between ${currentYear} and ${currentYear + 10}.`);
      return;
    }

    setIsLoading(true)

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gpa: formData.gpa,
        testScores: formData.testScores,
        targetCountries: formData.targetCountries,
        targetMajors: formData.targetMajors,
        researchInterests: formData.researchInterests,
        deadlineYear: formData.deadlineYear
      })

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "Failed to create account. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handlers for researchInterests & targetMajors
  const handleInterestInputChange = (e) => setCurrentInterest(e.target.value);
  const handleInterestKeyDown = (e) => {
    if (e.key === "Enter" && currentInterest.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        researchInterests: [...(prev.researchInterests || []), currentInterest.trim()],
      }));
      setCurrentInterest("");
    }
  };
  const handleRemoveInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      researchInterests: prev.researchInterests.filter((i) => i !== interest),
    }));
  };
  const handleMajorInputChange = (e) => setCurrentMajor(e.target.value);
  const handleMajorKeyDown = (e) => {
    if (e.key === "Enter" && currentMajor.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        targetMajors: [...(prev.targetMajors || []), currentMajor.trim()],
      }));
      setCurrentMajor("");
    }
  };
  const handleRemoveMajor = (major) => {
    setFormData((prev) => ({
      ...prev,
      targetMajors: prev.targetMajors.filter((m) => m !== major),
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GradPilot</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">Sign up to start your graduate school journey</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  name="gpa"
                  type="number"
                  placeholder="e.g. 3.9"
                  value={formData.gpa}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Test Scores</Label>
                <div className="flex gap-2">
                  <Input
                    id="gre"
                    name="GRE"
                    type="number"
                    placeholder="GRE"
                    value={formData.testScores.GRE}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        testScores: { ...prev.testScores, GRE: e.target.value }
                      }))
                    }
                  />
                  <Input
                    id="ielts"
                    name="IELTS"
                    type="number"
                    placeholder="IELTS"
                    value={formData.testScores.IELTS}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        testScores: { ...prev.testScores, IELTS: e.target.value }
                      }))
                    }
                  />
                  <Input
                    id="tofel"
                    name="TOFEL"
                    type="number"
                    placeholder="TOFEL"
                    value={formData.testScores.TOFEL}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        testScores: { ...prev.testScores, TOFEL: e.target.value }
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetMajors">Target Majors</Label>
                <Input
                  id="targetMajors"
                  name="targetMajors"
                  type="text"
                  value={currentMajor}
                  onChange={handleMajorInputChange}
                  onKeyDown={handleMajorKeyDown}
                  placeholder="Type and press Enter to add"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.targetMajors.map((major, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center">
                      {major}
                      <button
                        type="button"
                        onClick={() => handleRemoveMajor(major)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="researchInterests">Research Interests</Label>
                <Input
                  id="researchInterests"
                  name="researchInterests"
                  type="text"
                  value={currentInterest}
                  onChange={handleInterestInputChange}
                  onKeyDown={handleInterestKeyDown}
                  placeholder="Type and press Enter to add"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.researchInterests.map((interest, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadlineYear">Deadline Year</Label>
                <Input
                  id="deadlineYear"
                  name="deadlineYear"
                  type="number"
                  placeholder="2026"
                  value={formData.deadlineYear}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Target Countries</Label>
                <div className="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
                  {countries.map((country) => (
                    <div key={country} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`country-${country}`}
                        name="targetCountries"
                        value={country}
                        checked={formData.targetCountries?.includes(country) || false}
                        onChange={handleCheckboxChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label 
                        htmlFor={`country-${country}`} 
                        className="text-sm font-medium cursor-pointer"
                      >
                        {country}
                      </label>
                    </div>
                  ))}
                </div>
                {/* Show selected countries */}
                {formData.targetCountries && formData.targetCountries.length > 0 && (
                  <div className="text-sm text-gray-600">
                    Selected: {formData.targetCountries.join(", ")}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="******"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-destructive">*</span></Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="******"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
