import { NextRequest, NextResponse } from 'next/server'

// Handle POST requests from SSLCommerz
export async function POST(request) {
  try {
    const formData = await request.formData()
    
    // Extract payment data from form
    const paymentData = {
      tran_id: formData.get('tran_id'),
      val_id: formData.get('val_id'),
      amount: formData.get('amount'),
      currency: formData.get('currency'),
      status: formData.get('status'),
      card_type: formData.get('card_type'),
      store_amount: formData.get('store_amount'),
      bank_tran_id: formData.get('bank_tran_id'),
      tran_date: formData.get('tran_date')
    }

    console.log('SSLCommerz POST callback received:', paymentData)

    // Build redirect URL with payment parameters
    const redirectUrl = new URL('/payment/success', request.url)
    Object.entries(paymentData).forEach(([key, value]) => {
      if (value) {
        redirectUrl.searchParams.set(key, value)
      }
    })

    console.log('Redirecting to:', redirectUrl.toString())

    // Redirect to the frontend success page with parameters
    return NextResponse.redirect(redirectUrl.toString())

  } catch (error) {
    console.error('Error handling SSLCommerz POST callback:', error)
    
    // Redirect to error page
    const errorUrl = new URL('/payment/fail', request.url)
    errorUrl.searchParams.set('error', 'Invalid payment callback')
    return NextResponse.redirect(errorUrl.toString())
  }
}

// Handle GET requests (if SSLCommerz uses GET)
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  
  const paymentData = {
    tran_id: searchParams.get('tran_id'),
    val_id: searchParams.get('val_id'),
    amount: searchParams.get('amount'),
    currency: searchParams.get('currency'),
    status: searchParams.get('status')
  }

  console.log('SSLCommerz GET callback received:', paymentData)

  // Build redirect URL with payment parameters
  const redirectUrl = new URL('/payment/success', request.url)
  searchParams.forEach((value, key) => {
    redirectUrl.searchParams.set(key, value)
  })

  console.log('Redirecting to:', redirectUrl.toString())

  // Redirect to the frontend success page with parameters
  return NextResponse.redirect(redirectUrl.toString())
}
