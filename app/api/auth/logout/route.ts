/**
 * Logout Route
 * Clears auth tokens and redirects to Shopify logout
 */

import { NextRequest, NextResponse } from 'next/server';
import { clearTokens } from '@/lib/auth/shopify-auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get('redirect') || '/';
  
  const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    // Clear all auth tokens
    await clearTokens();
    
    // Redirect back to the site (optionally could redirect to Shopify logout first)
    return NextResponse.redirect(`${origin}${redirectTo}`);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(`${origin}/`);
  }
}

export async function POST(request: NextRequest) {
  // Also support POST for form submissions
  return GET(request);
}
