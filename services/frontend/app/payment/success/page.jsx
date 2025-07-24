"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import { paymentService } from "@/lib/payment-service"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState(null)
  const [paymentDetails, setPaymentDetails] = useState(null)

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get payment details from URL parameters
        const transactionId = searchParams.get('tran_id')
        const validationId = searchParams.get('val_id')
        const amount = searchParams.get('amount')
        const currency = searchParams.get('currency')

        console.log("Payment success callback received:", {
          transactionId,
          validationId,
          amount,
          currency
        })

        if (!transactionId || !validationId) {
          throw new Error("Missing payment information")
        }

        // Validate the payment with backend using the validate endpoint
        const response = await fetch(`http://localhost:8083/api/recommendations/payment/validate?tran_id=${transactionId}&val_id=${validationId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Payment validation failed')
        }

        const result = await response.json()
        setPaymentDetails({
          transactionId,
          amount,
          currency,
          ...result
        })

      } catch (error) {
        console.error("Error processing payment:", error)
        setError(error.message)
      } finally {
        setIsProcessing(false)
      }
    }

    processPayment()
  }, [searchParams])

  const handleContinue = () => {
    router.push('/scholarships')
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-600">Payment Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => router.push('/scholarships')} className="w-full">
                Back to Scholarships
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">
              Your subscription has been activated successfully. You now have access to all premium features!
            </p>
            
            {paymentDetails && (
              <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Transaction ID:</span>
                  <span className="text-sm text-gray-600">{paymentDetails.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span className="text-sm text-gray-600">{paymentDetails.currency} {paymentDetails.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>
            )}
          </div>

          <Button onClick={handleContinue} className="w-full bg-green-600 hover:bg-green-700">
            Continue to Scholarships
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
