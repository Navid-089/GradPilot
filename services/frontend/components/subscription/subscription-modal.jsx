"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, CreditCard, Shield, Zap, Crown } from "lucide-react"
import { paymentService } from "@/lib/payment-service"

export function SubscriptionModal({ isOpen, onClose, userInfo }) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('monthly')

  const pricing = paymentService.getSubscriptionPricing()

  const features = [
    "Access to all scholarship opportunities",
    "Advanced search and filtering",
    "Personalized recommendations",
    "Application tracking",
    "Deadline notifications",
    "Priority customer support"
  ]

  const handleSubscribe = async () => {
    try {
      setIsLoading(true)
      
      const plan = pricing[selectedPlan]
      const paymentData = {
        amount: plan.amount,
        currency: plan.currency,
        subscriptionType: selectedPlan.toUpperCase(),
        customerName: userInfo?.name,
        customerEmail: userInfo?.email,
        customerPhone: userInfo?.phone || "01712345678"
      }

      const response = await paymentService.initializePayment(paymentData)
      
      if (response.success && response.paymentUrl) {
        // Redirect to SSLCommerz payment page
        window.location.href = response.paymentUrl
      } else {
        throw new Error(response.message || 'Payment initialization failed')
      }
    } catch (error) {
      console.error('Error initializing payment:', error)
      alert('Failed to initialize payment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="h-6 w-6 text-yellow-500" />
            Upgrade to GradPilot Premium
          </DialogTitle>
          <DialogDescription>
            Get unlimited access to scholarship opportunities and premium features
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Plan Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Your Plan</h3>
            
            {Object.entries(pricing).map(([key, plan]) => (
              <Card 
                key={key}
                className={`cursor-pointer transition-all ${
                  selectedPlan === key 
                    ? 'ring-2 ring-blue-500 border-blue-500' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan(key)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{plan.label}</CardTitle>
                    {key === 'yearly' && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Save 17%
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">৳{plan.amount.toLocaleString()}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Premium Features</h3>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Security Info */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Secure payment powered by SSLCommerz</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap className="h-4 w-4" />
              <span>Instant activation after payment</span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Selected Plan:</span>
            <span>{pricing[selectedPlan].label}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Amount:</span>
            <span className="text-xl font-bold">৳{pricing[selectedPlan].amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Payment Method:</span>
            <span>Credit/Debit Card, Mobile Banking</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubscribe}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Subscribe Now
              </div>
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Subscriptions auto-renew unless cancelled.
        </p>
      </DialogContent>
    </Dialog>
  )
}
