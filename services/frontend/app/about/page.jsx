import { MainNav } from "@/components/main-nav";
import { GraduationCap, Users, Award, MessageSquare } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-12 px-4 mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-4 text-primary">
          About GradPilot
        </h1>
        <p className="mb-6 text-lg text-muted-foreground">
          GradPilot is your all-in-one platform for navigating the graduate
          school application process. Our mission is to empower students and
          mentors with the tools, resources, and connections needed to achieve
          academic success.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col items-center text-center">
            <GraduationCap className="h-10 w-10 text-primary mb-2" />
            <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
            <p>
              To make graduate education accessible and transparent for
              everyone, regardless of background or location.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Users className="h-10 w-10 text-primary mb-2" />
            <h2 className="text-xl font-semibold mb-2">Our Community</h2>
            <p>
              Join thousands of students and mentors who collaborate, share
              experiences, and support each other on their academic journeys.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center text-center">
            <Award className="h-10 w-10 text-primary mb-2" />
            <h2 className="text-xl font-semibold mb-2">What We Offer</h2>
            <ul className="list-disc list-inside text-left">
              <li>University and professor matching</li>
              <li>Document review and feedback</li>
              <li>Scholarship finder</li>
              <li>Application timeline and reminders</li>
              <li>AI-powered chat assistant</li>
            </ul>
          </div>
          <div className="flex flex-col items-center text-center">
            <MessageSquare className="h-10 w-10 text-primary mb-2" />
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p>
              Have questions or feedback? Reach out at{" "}
              <a
                href="mailto:support@gradpilot.me"
                className="text-primary underline"
              >
                support@gradpilot.me
              </a>
            </p>
          </div>
        </div>
        <div className="mt-12 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} GradPilot. All rights reserved.
        </div>
      </main>
    </div>
  );
}
