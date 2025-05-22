import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { School, ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"

export function FeaturePreview() {
  const topUniversities = [
    { name: "Stanford University", ranking: 1, programs: 120 },
    { name: "MIT", ranking: 2, programs: 115 },
    { name: "UC Berkeley", ranking: 3, programs: 110 },
    { name: "Harvard University", ranking: 4, programs: 105 },
    { name: "Carnegie Mellon", ranking: 5, programs: 95 },
  ]

  return (
    <div className="bg-accent-50 dark:bg-accent-950 rounded-xl p-8 border border-accent-200 dark:border-accent-800">
      <div className="mb-4">
        <Badge variant="outline" className="bg-info/20 text-info border-info/30">
          <TrendingUp className="mr-1 h-3 w-3" />
          Feature Preview
        </Badge>
      </div>

      <h2 className="text-2xl font-bold mb-6">Discover Top Universities</h2>

      <div className="space-y-4">
        {topUniversities.map((university, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-accent-200 dark:bg-accent-800 flex items-center justify-center mr-3">
                <School className="h-4 w-4 text-accent-700 dark:text-accent-300" />
              </div>
              <span className="font-medium">{university.name}</span>
            </div>
            <div className="flex items-center">
              <Badge
                variant="secondary"
                className="mr-2 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 border-accent-200 dark:border-accent-800"
              >
                Rank #{university.ranking}
              </Badge>
              <span className="text-sm text-muted-foreground">{university.programs} Programs</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-sm text-muted-foreground">
          Sign up to get personalized university matches based on your academic profile and preferences.
        </p>
        <Link href="/signup">
          <Button className="w-full bg-accent hover:bg-accent-600 text-accent-foreground">
            Create Your Profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
