import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import {
  GraduationCap,
  ArrowRight,
  School,
  Users,
  FileText,
  Calendar,
  Award,
  MessageSquare,
  CheckCircle,
  Star,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-8 md:py-16 lg:py-24 xl:py-32 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Your Graduate School Journey Starts Here
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Navigate Your Path to Graduate School Success From Today!
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  GradPilot helps you find the perfect graduate programs, connect with professors, and streamline your
                  application process.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <Link href="/signup">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/features">Learn More</Link>
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                    <span>Free to start</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto flex justify-center">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 bg-primary/10 w-full h-full rounded-xl"></div>
                  <img
                    alt="Graduate students"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last relative z-10 border shadow-lg"
                    height="550"
                    src="/placeholder.svg?height=550&width=800"
                    width="800"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-primary/5 p-4 rounded-lg border shadow-md z-20">
                    <div className="flex items-center space-x-2">
                      <div className="text-4xl font-bold text-primary">94%</div>
                      <div className="text-sm">
                        <div className="font-medium">Success Rate</div>
                        <div className="text-muted-foreground">of our users</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Why Choose GradPilot
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Everything You Need for Graduate School Applications
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Our platform provides all the tools and resources you need to navigate the complex graduate school
                  application process.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {features.map((feature) => (
                <Card key={feature.title} className="overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                      <div className="rounded-full bg-primary/10 p-3 text-primary">{feature.icon}</div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Success Stories
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">What Our Users Say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Hear from students who have successfully navigated their graduate school journey with GradPilot.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                          <AvatarFallback>
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.program}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {testimonial.university}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Button variant="outline" size="lg">
                Read More Success Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-8 md:py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-4xl font-bold">{stat.value}</div>
                  <div className="text-sm font-medium opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Ready to Start Your Graduate School Journey?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Join thousands of successful applicants who have used GradPilot to get into their dream programs.
                </p>
              </div>
              <div className="w-full max-w-md">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90" asChild>
                  <Link href="/signup">
                    Create Your Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">GradPilot</span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline" href="/terms">
              Terms of Service
            </Link>
            <Link className="text-sm font-medium hover:underline" href="/privacy">
              Privacy
            </Link>
            <Link className="text-sm font-medium hover:underline" href="/about">
              About
            </Link>
          </nav>
          <div className="text-sm text-muted-foreground">© 2023 GradPilot. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "University Matching",
    description: "Find the perfect graduate programs based on your profile, interests, and goals.",
    icon: <School className="h-6 w-6" />,
  },
  {
    title: "Professor Connections",
    description: "Discover and connect with professors whose research aligns with your interests.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Document Review",
    description: "Get feedback on your Statement of Purpose, CV, and other application documents.",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    title: "Application Timeline",
    description: "Stay on track with a personalized timeline and deadline reminders.",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    title: "Scholarship Finder",
    description: "Discover scholarships and funding opportunities for your graduate studies.",
    icon: <Award className="h-6 w-6" />,
  },
  {
    title: "AI Assistant",
    description: "Get instant answers to your questions about the application process.",
    icon: <MessageSquare className="h-6 w-6" />,
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    program: "Ph.D. in Computer Science",
    university: "Stanford University",
    quote:
      "GradPilot helped me find the perfect advisor match. The professor search tool saved me countless hours of research.",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Michael Chen",
    program: "M.S. in Electrical Engineering",
    university: "MIT",
    quote:
      "The timeline feature kept me on track with all my application deadlines. I wouldn't have made it without GradPilot!",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Priya Patel",
    program: "Ph.D. in Neuroscience",
    university: "UC Berkeley",
    quote: "The document review feature helped me refine my SOP. I received offers from 4 of my top 5 schools!",
    rating: 4,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "James Wilson",
    program: "M.S. in Data Science",
    university: "Carnegie Mellon",
    quote:
      "GradPilot's university matching algorithm recommended schools I hadn't considered that ended up being perfect fits.",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Aisha Rahman",
    program: "Ph.D. in Biomedical Engineering",
    university: "Johns Hopkins",
    quote:
      "The scholarship finder helped me secure funding I didn't know existed. GradPilot paid for itself many times over!",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "David Kim",
    program: "M.S. in Mechanical Engineering",
    university: "Georgia Tech",
    quote:
      "As an international student, the visa information resources were invaluable. GradPilot made the process so much clearer.",
    rating: 4,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const stats = [
  { value: "10,000+", label: "Students Helped" },
  { value: "94%", label: "Acceptance Rate" },
  { value: "$2.5M+", label: "Scholarships Found" },
  { value: "500+", label: "Partner Universities" },
]
