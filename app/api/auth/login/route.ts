/**
 * OAuth Login Route
 * Initiates the Shopify Customer Account API OAuth flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  buildAuthorizationUrl, 
  storeOAuthParams 
} from '@/lib/auth/shopify-auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get('redirect') || '/';
  
  // Build the callback URL
  const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const callbackUrl = `${origin}/api/auth/callback`;

  try {
    // Generate OAuth parameters
    const { url, codeVerifier, state } = await buildAuthorizationUrl(callbackUrl);
    
    // Store PKCE params and redirect destination in cookies
    await storeOAuthParams(codeVerifier, `${state}:${encodeURIComponent(redirectTo)}`);
    
    // Redirect to Shopify's authorization page
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.redirect(`${origin}/account/login?error=auth_failed`);
  }
}
