"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function PaymentCancelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState(null)

  useEffect(() => {
    // Get payment details from URL parameters
    const transactionId = searchParams.get('tran_id')
    const amount = searchParams.get('amount')
    const currency = searchParams.get('currency')

    setPaymentDetails({
      transactionId,
      amount,
      currency
    })
  }, [searchParams])

  const handleRetry = () => {
    router.push('/scholarships')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <CardTitle className="text-2xl text-yellow-600">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">
              You have cancelled the payment process. You can try again anytime to access premium features.
            </p>
            
            {paymentDetails && paymentDetails.transactionId && (
              <div className="bg-yellow-50 p-4 rounded-lg text-left space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Transaction ID:</span>
                  <span className="text-sm text-gray-600">{paymentDetails.transactionId}</span>
                </div>
                {paymentDetails.amount && (
                  <div className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span className="text-sm text-gray-600">{paymentDetails.currency} {paymentDetails.amount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="text-sm text-yellow-600 font-medium">Cancelled</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button onClick={handleRetry} className="w-full">
              Try Payment Again
            </Button>
            <Button onClick={() => router.push('/')} variant="outline" className="w-full">
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
