"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function PaymentFailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState(null)

  useEffect(() => {
    // Get payment details from URL parameters
    const transactionId = searchParams.get('tran_id')
    const amount = searchParams.get('amount')
    const currency = searchParams.get('currency')
    const reason = searchParams.get('error') || 'Payment was declined'

    setPaymentDetails({
      transactionId,
      amount,
      currency,
      reason
    })
  }, [searchParams])

  const handleRetry = () => {
    router.push('/scholarships')
  }

  const handleSupport = () => {
    // You can implement support contact logic here
    router.push('/contact')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">
              We're sorry, but your payment could not be processed. Please try again or contact support.
            </p>
            
            {paymentDetails && (
              <div className="bg-red-50 p-4 rounded-lg text-left space-y-2">
                {paymentDetails.transactionId && (
                  <div className="flex justify-between">
                    <span className="font-medium">Transaction ID:</span>
                    <span className="text-sm text-gray-600">{paymentDetails.transactionId}</span>
                  </div>
                )}
                {paymentDetails.amount && (
                  <div className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span className="text-sm text-gray-600">{paymentDetails.currency} {paymentDetails.amount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="text-sm text-red-600 font-medium">Failed</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Reason:</span>
                  <span className="text-sm text-gray-600">{paymentDetails.reason}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button onClick={handleRetry} className="w-full">
              Try Again
            </Button>
            <Button onClick={handleSupport} variant="outline" className="w-full">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
