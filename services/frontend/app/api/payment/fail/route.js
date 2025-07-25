import { NextResponse } from 'next/server';

export async function GET(request) {
  // Handle GET requests
  const { searchParams } = new URL(request.url);
  const tranId = searchParams.get('tran_id');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency');
  const error = searchParams.get('error');
  
  // Redirect to the fail page with parameters - use absolute URL
  const redirectUrl = new URL('/payment/fail', 'https://gradpilot.me');
  if (tranId) redirectUrl.searchParams.set('tran_id', tranId);
  if (amount) redirectUrl.searchParams.set('amount', amount);
  if (currency) redirectUrl.searchParams.set('currency', currency);
  if (error) redirectUrl.searchParams.set('error', error);
  
  return NextResponse.redirect(redirectUrl);
}

export async function POST(request) {
  console.log('=== SSLCommerz FAIL POST Callback Received ===');
  
  try {
    // Parse form data from SSLCommerz POST request
    const formData = await request.formData();
    
    // Extract key parameters
    const tranId = formData.get('tran_id');
    const amount = formData.get('amount');
    const currency = formData.get('currency');
    const error = formData.get('error') || formData.get('status') || 'Payment failed';
    
    console.log('SSLCommerz FAIL POST data:', {
      tranId,
      amount,
      currency,
      error
    });
    
    // Redirect to fail page with parameters - use absolute URL
    const failUrl = new URL('/payment/fail', 'https://gradpilot.me');
    if (tranId) failUrl.searchParams.set('tran_id', tranId);
    if (amount) failUrl.searchParams.set('amount', amount);
    if (currency) failUrl.searchParams.set('currency', currency);
    failUrl.searchParams.set('error', error);
    
    console.log('Redirecting to fail page:', failUrl.toString());
    
    return NextResponse.redirect(failUrl);
    
  } catch (error) {
    console.error('Error processing SSLCommerz fail callback:', error);
    return NextResponse.redirect(new URL('/payment/fail?error=processing_error', request.url));
  }
}
