"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  // Option states
  const [majorOptions, setMajorOptions] = useState([]);
  const [interestOptions, setInterestOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Selected values (ID arrays)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gpa: "",
    gender: "",
    testScores: {
      GRE: "",
      IELTS: "",
      TOEFL: "",
    },
    targetMajors: [],
    researchInterests: [],
    targetCountries: [],
    deadlineYear: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { register } = useAuth();

  // Fetch options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // You can replace with your actual API endpoints
        const [majorsRes, interestsRes, countriesRes] = await Promise.all([
          fetch("/api/majors"),
          fetch("/api/research-interests"),
          fetch("/api/countries"),
        ]);
        const majors = await majorsRes.json();
        const interests = await interestsRes.json();
        const countries = await countriesRes.json();

        setMajorOptions(majors.map((m) => ({ value: m.id, label: m.name })));
        setInterestOptions(
          interests.map((i) => ({ value: i.id, label: i.name }))
        );
        setCountryOptions(
          countries.map((c) => ({ value: c.id, label: c.name }))
        );
      } catch (err) {
        setError("Failed to fetch options from server. Please refresh.");
      }
    };
    fetchOptions();
  }, []);

  // Text fields and test scores
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["GRE", "IELTS", "TOEFL"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        testScores: { ...prev.testScores, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Multi-select handlers
  const handleMajorChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      targetMajors: selected ? selected.map((opt) => opt.value) : [],
    }));
  };
  const handleInterestChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      researchInterests: selected ? selected.map((opt) => opt.value) : [],
    }));
  };
  const handleCountryChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      targetCountries: selected ? selected.map((opt) => opt.value) : [],
    }));
  };

  // Form submit/validation (as before)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Required
    if (!formData.name.trim()) {
      setError("Full Name is required.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!formData.password) {
      setError("Password is required.");
      return;
    }
    if (!formData.confirmPassword) {
      setError("Please confirm your password.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Optional but validate if entered
    if (
      formData.gpa &&
      (isNaN(formData.gpa) || formData.gpa < 0 || formData.gpa > 4)
    ) {
      setError("Please enter a valid GPA between 0 and 4.0.");
      return;
    }

    if (
      formData.testScores.GRE &&
      (isNaN(formData.testScores.GRE) ||
        formData.testScores.GRE < 260 ||
        formData.testScores.GRE > 340)
    ) {
      setError("Please enter a valid GRE score between 260 and 340.");
      return;
    }

    if (
      formData.testScores.IELTS &&
      (isNaN(formData.testScores.IELTS) ||
        formData.testScores.IELTS < 0 ||
        formData.testScores.IELTS > 9)
    ) {
      setError("Please enter a valid IELTS score between 0 and 9.");
      return;
    }

    if (
      formData.testScores.TOEFL &&
      (isNaN(formData.testScores.TOEFL) ||
        formData.testScores.TOEFL < 0 ||
        formData.testScores.TOEFL > 120)
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
      setError(
        `Please enter a valid deadline year between ${currentYear} and ${
          currentYear + 10
        }.`
      );
      return;
    }

    setIsLoading(true);

    try {
      // Send selected IDs in arrays
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gpa: formData.gpa,
        gender: formData.gender,
        testScores: formData.testScores,
        targetMajors: formData.targetMajors, // Array of IDs
        researchInterests: formData.researchInterests, // Array of IDs
        targetCountries: formData.targetCountries, // Array of IDs
        deadlineYear: formData.deadlineYear,
      });

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Failed to create account. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-muted/40 p-4"
      style={{
        backgroundImage: "url('/meye2.svg')",
        backgroundSize: "450px auto",
        backgroundPosition: "bottom right",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GradPilot</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Sign up to start your graduate school journey
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
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
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
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
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select gender (optional)</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
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
                    onChange={handleChange}
                  />
                  <Input
                    id="ielts"
                    name="IELTS"
                    type="number"
                    placeholder="IELTS"
                    value={formData.testScores.IELTS}
                    onChange={handleChange}
                  />
                  <Input
                    id="toefl"
                    name="TOEFL"
                    type="number"
                    placeholder="TOEFL"
                    value={formData.testScores.TOEFL}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Majors Multi-Select */}
              <div className="space-y-2">
                <Label htmlFor="targetMajors">Target Majors</Label>
                <Select
                  id="targetMajors"
                  isMulti
                  options={majorOptions}
                  onChange={handleMajorChange}
                  value={majorOptions.filter((opt) =>
                    formData.targetMajors.includes(opt.value)
                  )}
                  placeholder="Select one or more majors"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  closeMenuOnSelect={false}
                />
              </div>

              {/* Research Interests Multi-Select */}
              <div className="space-y-2">
                <Label htmlFor="researchInterests">Research Interests</Label>
                <Select
                  id="researchInterests"
                  isMulti
                  options={interestOptions}
                  onChange={handleInterestChange}
                  value={interestOptions.filter((opt) =>
                    formData.researchInterests.includes(opt.value)
                  )}
                  placeholder="Select one or more interests"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  closeMenuOnSelect={false}
                />
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

              {/* Countries Multi-Select */}
              <div className="space-y-2">
                <Label htmlFor="targetCountries">Target Countries</Label>
                <Select
                  id="targetCountries"
                  isMulti
                  options={countryOptions}
                  onChange={handleCountryChange}
                  value={countryOptions.filter((opt) =>
                    formData.targetCountries.includes(opt.value)
                  )}
                  placeholder="Select one or more countries"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  closeMenuOnSelect={false}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <div
                    className="absolute right-3 top-2.5 cursor-pointer text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="******"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <div
                    className="absolute right-3 top-2.5 cursor-pointer text-muted-foreground"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </div>
                </div>
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
              <div className="text-center text-sm">
                Want to become a mentor?{" "}
                <Link
                  href="/mentor/signup"
                  className="text-primary hover:underline"
                >
                  Mentor Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
