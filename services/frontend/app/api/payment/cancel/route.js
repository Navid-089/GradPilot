import { NextResponse } from 'next/server';

export async function GET(request) {
  // Handle GET requests
  const { searchParams } = new URL(request.url);
  const tranId = searchParams.get('tran_id');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency');
  
  // Redirect to the cancel page with parameters
  const redirectUrl = new URL('/payment/cancel', request.url);
  if (tranId) redirectUrl.searchParams.set('tran_id', tranId);
  if (amount) redirectUrl.searchParams.set('amount', amount);
  if (currency) redirectUrl.searchParams.set('currency', currency);
  
  return NextResponse.redirect(redirectUrl);
}

export async function POST(request) {
  console.log('=== SSLCommerz CANCEL POST Callback Received ===');
  
  try {
    // Parse form data from SSLCommerz POST request
    const formData = await request.formData();
    
    // Extract key parameters
    const tranId = formData.get('tran_id');
    const amount = formData.get('amount');
    const currency = formData.get('currency');
    const status = formData.get('status');
    
    console.log('SSLCommerz CANCEL POST data:', {
      tranId,
      amount,
      currency,
      status
    });
    
    // Redirect to cancel page with parameters
    const cancelUrl = new URL('/payment/cancel', request.url);
    if (tranId) cancelUrl.searchParams.set('tran_id', tranId);
    if (amount) cancelUrl.searchParams.set('amount', amount);
    if (currency) cancelUrl.searchParams.set('currency', currency);
    
    console.log('Redirecting to cancel page:', cancelUrl.toString());
    
    return NextResponse.redirect(cancelUrl);
    
  } catch (error) {
    console.error('Error processing SSLCommerz cancel callback:', error);
    return NextResponse.redirect(new URL('/payment/cancel?error=processing_error', request.url));
  }
}
