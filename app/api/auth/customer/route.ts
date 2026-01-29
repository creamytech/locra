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
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Fetch customer data
    const customer = await fetchCustomer(accessToken);
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Failed to fetch customer data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Customer data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
