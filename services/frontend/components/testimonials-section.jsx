import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "PhD Student, Stanford University",
    content:
      "GradPilot was instrumental in my graduate school journey. The university matching algorithm helped me find programs that perfectly aligned with my research interests. I'm now at my dream school!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "MS in Computer Science, MIT",
    content:
      "The professor finder feature saved me countless hours of research. I connected with faculty members whose work aligned with my interests, which significantly strengthened my application.",
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "MS in Data Science, UC Berkeley",
    content:
      "As an international student, the scholarship finder was a game-changer. GradPilot helped me secure funding that made my graduate education possible. Highly recommend!",
    rating: 4,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-secondary-50 dark:bg-secondary-950">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Join thousands of students who have found their perfect graduate programs with GradPilot
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="text-left border-secondary-200 dark:border-secondary-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3 border-2 border-secondary-200 dark:border-secondary-700">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback className="bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
