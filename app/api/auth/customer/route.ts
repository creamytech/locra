/**
 * Customer Data API Route
 * Fetches the current customer's data from Shopify Customer Account API
 */

import { NextResponse } from 'next/server';
import { getAccessToken, fetchCustomer } from '@/lib/auth/shopify-auth';

export async function GET() {
  try {
    // Get access token (auto-refreshes if needed)
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      console.log('Customer API: No access token found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Log the token prefix to see what type of token we have
    console.log('Customer API: Token prefix:', accessToken.substring(0, 20) + '...');
    console.log('Customer API: Token starts with shcat_:', accessToken.startsWith('shcat_'));
    console.log('Customer API: Fetching customer with token...');

    // Fetch customer data
    const customer = await fetchCustomer(accessToken);
    
    if (!customer) {
      console.error('Customer API: fetchCustomer returned null');
      return NextResponse.json(
        { error: 'Failed to fetch customer data' },
        { status: 500 }
      );
    }

    console.log('Customer API: Successfully fetched customer:', customer.id);
    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Customer data error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

