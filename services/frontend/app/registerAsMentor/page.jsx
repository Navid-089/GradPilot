"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "hsl(var(--background))",
    borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--border))",
    borderWidth: "1px",
    borderRadius: "6px",
    minHeight: "40px",
    boxShadow: state.isFocused ? "0 0 0 2px hsl(var(--ring))" : "none",
    "&:hover": {
      borderColor: "hsl(var(--border))",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "6px",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    zIndex: 50,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "hsl(var(--accent))"
      : state.isFocused
      ? "hsl(var(--accent) / 0.5)"
      : "transparent",
    color: state.isSelected
      ? "hsl(var(--accent-foreground))"
      : "hsl(var(--foreground))",
    "&:hover": {
      backgroundColor: "hsl(var(--accent) / 0.5)",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "hsl(var(--muted-foreground))",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "hsl(var(--foreground))",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "hsl(var(--secondary))",
    borderRadius: "4px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "hsl(var(--secondary-foreground))",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "hsl(var(--secondary-foreground))",
    "&:hover": {
      backgroundColor: "hsl(var(--destructive))",
      color: "hsl(var(--destructive-foreground))",
    },
  }),
  input: (provided) => ({
    ...provided,
    color: "hsl(var(--foreground))",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: "hsl(var(--border))",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "hsl(var(--muted-foreground))",
    "&:hover": {
      color: "hsl(var(--foreground))",
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "hsl(var(--muted-foreground))",
    "&:hover": {
      color: "hsl(var(--foreground))",
    },
  }),
};

export default function MentorSignupPage() {
  // Option states
  const [universityOptions, setUniversityOptions] = useState([]);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [expertiseOptions, setExpertiseOptions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    universityId: null,
    fieldStudyId: null,
    countryId: null,
    bio: "",
    linkedin: "",
    expertiseAreaIds: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { registerAsMentor } = useAuth();

  // Fetch options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [universitiesRes, fieldsRes, countriesRes, expertiseRes] =
          await Promise.all([
            fetch(`/api/universities`),
            fetch(`/api/fields-of-study`),
            fetch(`/api/countries`),
            fetch(`/api/expertise-areas`),
          ]);

        const universities = await universitiesRes.json();
        const fields = await fieldsRes.json();
        const countries = await countriesRes.json();
        const expertise = await expertiseRes.json();

        // Transform data for react-select
        setUniversityOptions(
          universities.map((u) => ({ value: u.id, label: u.name }))
        );
        setFieldOptions(fields.map((f) => ({ value: f.id, label: f.name })));
        setCountryOptions(
          countries.map((c) => ({ value: c.id, label: c.name }))
        );
        setExpertiseOptions(
          expertise.map((e) => ({ value: e.id, label: e.name }))
        );
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const mentorData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        universityId: formData.universityId,
        fieldStudyId: formData.fieldStudyId,
        countryId: formData.countryId,
        bio: formData.bio,
        linkedin: formData.linkedin,
        expertiseAreaIds: formData.expertiseAreaIds,
      };

      const result = await registerAsMentor(mentorData);

      if (result.success) {
        // Redirect to mentor dashboard on successful registration
        router.push("/loginAsMentor");
      } else {
        setError(result.error || "Failed to register. Please try again.");
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
        backgroundImage: "url('/mentor2.svg')",
        backgroundSize: "350px auto",
        backgroundPosition: "bottom right",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GradPilot</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Sign Up as Mentor
            </CardTitle>
            <CardDescription className="text-center">
              Join our mentorship network and help guide students through their
              graduate school journey
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                  {error}
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="mentor@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="******"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
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
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="******"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
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
              </div>

              {/* Academic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>University</Label>
                  <Select
                    options={universityOptions}
                    value={universityOptions.find(
                      (option) => option.value === formData.universityId
                    )}
                    onChange={(selectedOption) =>
                      handleSelectChange("universityId", selectedOption)
                    }
                    placeholder="Select your university"
                    isClearable
                    styles={customSelectStyles}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Select
                    options={fieldOptions}
                    value={fieldOptions.find(
                      (option) => option.value === formData.fieldStudyId
                    )}
                    onChange={(selectedOption) =>
                      handleSelectChange("fieldStudyId", selectedOption)
                    }
                    placeholder="Select your field"
                    isClearable
                    styles={customSelectStyles}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(
                    (option) => option.value === formData.countryId
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange("countryId", selectedOption)
                  }
                  placeholder="Select your country"
                  isClearable
                  styles={customSelectStyles}
                />
              </div>

              <div className="space-y-2">
                <Label>Areas of Expertise</Label>
                <Select
                  options={expertiseOptions}
                  value={expertiseOptions.filter((option) =>
                    formData.expertiseAreaIds.includes(option.value)
                  )}
                  onChange={(selectedOptions) =>
                    handleMultiSelectChange("expertiseAreaIds", selectedOptions)
                  }
                  placeholder="Select your areas of expertise"
                  isMulti
                  isClearable
                  styles={customSelectStyles}
                />
              </div>

              {/* Professional Information */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself, your experience, and how you can help students..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={formData.linkedin}
                  onChange={handleInputChange}
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
                  "Sign Up as Mentor"
                )}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/loginAsMentor"
                  className="text-primary hover:underline"
                >
                  Log in
                </Link>
              </div>
              <div className="text-center text-sm">
                Want to sign up as a student?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Student Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
