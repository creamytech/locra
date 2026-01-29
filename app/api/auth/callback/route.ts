/**
 * OAuth Callback Route
 * Handles the callback from Shopify after user authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  exchangeCodeForTokens, 
  storeTokens, 
  getOAuthParams,
  clearOAuthParams 
} from '@/lib/auth/shopify-auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    await clearOAuthParams();
    return NextResponse.redirect(`${origin}/account/login?error=${error}`);
  }

  // Validate required params
  if (!code || !state) {
    console.error('Missing code or state');
    await clearOAuthParams();
    return NextResponse.redirect(`${origin}/account/login?error=invalid_request`);
  }

  try {
    // Get stored PKCE params
    const oauthParams = await getOAuthParams();
    
    if (!oauthParams.codeVerifier || !oauthParams.state) {
      console.error('Missing stored OAuth params');
      return NextResponse.redirect(`${origin}/account/login?error=session_expired`);
    }

    // Parse state (format: "randomState:redirectPath")
    const [storedState, encodedRedirect] = oauthParams.state.split(':');
    
    // Validate state
    if (state !== storedState) {
      console.error('State mismatch');
      await clearOAuthParams();
      return NextResponse.redirect(`${origin}/account/login?error=invalid_state`);
    }

    // Build the callback URL (same as login route)
    const callbackUrl = `${origin}/api/auth/callback`;

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(
      code,
      oauthParams.codeVerifier,
      callbackUrl
    );

    if (!tokens) {
      await clearOAuthParams();
      return NextResponse.redirect(`${origin}/account/login?error=token_exchange_failed`);
    }

    // Store tokens in secure cookies
    await storeTokens(tokens);
    
    // Clear OAuth params
    await clearOAuthParams();

    // Redirect to the original destination
    const redirectTo = encodedRedirect ? decodeURIComponent(encodedRedirect) : '/';
    return NextResponse.redirect(`${origin}${redirectTo}`);
    
  } catch (error) {
    console.error('Callback error:', error);
    await clearOAuthParams();
    return NextResponse.redirect(`${origin}/account/login?error=callback_failed`);
  }
}
