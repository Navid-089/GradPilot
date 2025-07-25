"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Lock, Star, LogIn } from "lucide-react"

export function SubscriptionRequired({ onSubscribe, scholarshipsCount, className = "", requiresLogin = false }) {
  if (requiresLogin) {
    return (
      <div className={`relative ${className}`}>
        {/* Blurred content overlay */}
        <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-center h-full">
            <Card className="max-w-md w-full mx-4 shadow-lg border-2 border-blue-200">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <LogIn className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Login Required
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Please log in to access scholarship opportunities and premium features
                  </p>
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3" size="lg">
                    <Link href="/login">
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full" size="lg">
                    <Link href="/signup">
                      Create Account
                    </Link>
                  </Button>
                  
                  <p className="text-xs text-gray-500">
                    New to GradPilot? Create an account to get started
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Background content hint */}
        <div className="opacity-30 pointer-events-none">
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-40">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Lock className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={`relative ${className}`}>
      {/* Blurred content overlay */}
      <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md w-full mx-4 shadow-lg border-2 border-yellow-200">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="relative">
                  <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <div className="absolute -top-1 -right-1">
                    <Star className="h-6 w-6 text-yellow-400 fill-current" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Premium Subscription Required
                </h2>
                <p className="text-gray-600 mb-4">
                  Unlock access to {'all'} scholarship opportunities and premium features
                </p>
              </div>

              <div className="space-y-3 mb-6 text-sm text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Advanced scholarship search & filtering</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Personalized recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Application deadline tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Priority customer support</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={onSubscribe}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3"
                  size="lg"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Upgrade to Premium
                </Button>
                
                <p className="text-xs text-gray-500">
                  Starting from ৳500/month • Secure payment • Instant access
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background content hint */}
      <div className="opacity-30 pointer-events-none">
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-40">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Lock className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
