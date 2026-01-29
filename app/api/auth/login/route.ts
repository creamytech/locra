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
  
  // Build the callback URL - use host header as fallback since origin isn't always present
  const host = request.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const origin = request.headers.get('origin') || `${protocol}://${host}` || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const callbackUrl = `${origin}/api/auth/callback`;

  console.log('Login route: Starting OAuth flow');
  console.log('Login route: Origin:', origin);
  console.log('Login route: Callback URL:', callbackUrl);
  console.log('Login route: Redirect after:', redirectTo);

  try {
    // Generate OAuth parameters
    const { url, codeVerifier, state } = await buildAuthorizationUrl(callbackUrl);
    
    console.log('Login route: Authorization URL generated');
    console.log('Login route: Redirecting to:', url.substring(0, 100) + '...');
    
    // Store PKCE params and redirect destination in cookies
    await storeOAuthParams(codeVerifier, `${state}:${encodeURIComponent(redirectTo)}`);
    
    // Redirect to Shopify's authorization page
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.redirect(`${origin}/account/login?error=auth_failed`);
  }
}

