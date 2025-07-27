"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, User } from "lucide-react"
import { updateMentorProfile } from "@/lib/mentor-service"

export default function MentorProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        // Parse JWT token to get mentor email
        const payload = JSON.parse(atob(token.split('.')[1]));
        const mentorEmail = payload.sub;
        const response = await fetch(`/api/mentor/profile?email=${mentorEmail}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch mentor profile');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching mentor profile:", error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      await updateMentorProfile({ ...profile, email: profile.email });
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating mentor profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
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
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b bg-background">
          <div className="container mx-auto px-4 py-4">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Mentor Profile Not Found</h1>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Mentor Profile</h1>
            <p className="text-muted-foreground">Update your mentor profile information</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>
                <User className="mr-2 h-4 w-4" /> Personal Information
              </CardTitle>
              <CardDescription>Update your mentor details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={profile.name || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={profile.email || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" name="bio" value={profile.bio || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" name="linkedin" value={profile.linkedin || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university_id">University ID</Label>
                <Input id="university_id" name="university_id" value={profile.university_id || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field_study_id">Field of Study ID</Label>
                <Input id="field_study_id" name="field_study_id" value={profile.field_study_id || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country_id">Country ID</Label>
                <Input id="country_id" name="country_id" value={profile.country_id || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  value={profile.gender || ''}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
}
