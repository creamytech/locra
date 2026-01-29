/**
 * Shopify Customer Account API - OAuth 2.0 PKCE Implementation
 * ============================================================
 * Handles authentication with Shopify's new Customer Account API
 */

import { cookies } from 'next/headers';

// Environment variables (add to .env.local)
const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID!;
// SHOPIFY_CUSTOMER_ACCOUNT_API_URL should be like: https://shopify.com/91266023789
const SHOPIFY_CUSTOMER_ACCOUNT_API_URL = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000';

// Extract shop ID from URL (e.g., "91266023789" from "https://shopify.com/91266023789")
const SHOP_ID = SHOPIFY_CUSTOMER_ACCOUNT_API_URL?.split('/').pop() || '';

// OAuth endpoints - Use the /authentication/ path as shown in Shopify Admin
const AUTHORIZATION_ENDPOINT = `https://shopify.com/authentication/${SHOP_ID}/oauth/authorize`;
const TOKEN_ENDPOINT = `https://shopify.com/authentication/${SHOP_ID}/oauth/token`;
const LOGOUT_ENDPOINT = `https://shopify.com/authentication/${SHOP_ID}/logout`;
// Customer API GraphQL endpoint - format: https://shopify.com/{shop_id}/account/customer/api/graphql.json
const CUSTOMER_API_ENDPOINT = `https://shopify.com/${SHOP_ID}/account/customer/api/graphql.json`;

// Cookie names
const ACCESS_TOKEN_COOKIE = 'shopify_customer_access_token';
const REFRESH_TOKEN_COOKIE = 'shopify_customer_refresh_token';
const ID_TOKEN_COOKIE = 'shopify_customer_id_token';
const CODE_VERIFIER_COOKIE = 'shopify_code_verifier';
const STATE_COOKIE = 'shopify_oauth_state';

// Token expiration (in seconds)
const ACCESS_TOKEN_EXPIRES = 60 * 60; // 1 hour
const REFRESH_TOKEN_EXPIRES = 60 * 60 * 24 * 30; // 30 days

/**
 * Generate a random string for PKCE code verifier
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

/**
 * Generate code challenge from verifier (S256 method)
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(digest));
}

/**
 * Generate a random state parameter
 */
export function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

/**
 * Base64 URL encode
 */
function base64URLEncode(buffer: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Build the authorization URL for initiating OAuth flow
 */
export async function buildAuthorizationUrl(redirectUri: string): Promise<{
  url: string;
  codeVerifier: string;
  state: string;
}> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();

  const params = new URLSearchParams({
    client_id: SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'openid email customer-account-api:full',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
  });

  return {
    url: `${AUTHORIZATION_ENDPOINT}?${params.toString()}`,
    codeVerifier,
    state,
  };
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
} | null> {
  try {
    console.log('Token exchange: Starting exchange...');
    console.log('Token exchange: Using endpoint:', TOKEN_ENDPOINT);
    console.log('Token exchange: Redirect URI:', redirectUri);
    
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID,
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    });

    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    console.log('Token exchange: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    
    // Log token info (first 20 chars only for security)
    console.log('Token exchange: Success!');
    console.log('Token exchange: Access token prefix:', data.access_token?.substring(0, 20) + '...');
    console.log('Token exchange: Refresh token prefix:', data.refresh_token?.substring(0, 20) + '...');
    console.log('Token exchange: ID token present:', !!data.id_token);
    console.log('Token exchange: Expires in:', data.expires_in);
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      idToken: data.id_token,
      expiresIn: data.expires_in,
    };
  } catch (error) {
    console.error('Token exchange error:', error);
    return null;
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
} | null> {
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID,
      refresh_token: refreshToken,
    });

    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      console.error('Token refresh failed:', await response.text());
      return null;
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

/**
 * Store tokens in HTTP-only cookies
 */
export async function storeTokens(tokens: {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
  expiresIn: number;
}) {
  const cookieStore = await cookies();
  
  cookieStore.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: tokens.expiresIn,
    path: '/',
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_EXPIRES,
    path: '/',
  });

  if (tokens.idToken) {
    cookieStore.set(ID_TOKEN_COOKIE, tokens.idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expiresIn,
      path: '/',
    });
  }
}

/**
 * Store PKCE parameters in cookies for callback
 */
export async function storeOAuthParams(codeVerifier: string, state: string) {
  const cookieStore = await cookies();
  
  cookieStore.set(CODE_VERIFIER_COOKIE, codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });
}

/**
 * Get stored OAuth params from cookies
 */
export async function getOAuthParams(): Promise<{
  codeVerifier: string | undefined;
  state: string | undefined;
}> {
  const cookieStore = await cookies();
  return {
    codeVerifier: cookieStore.get(CODE_VERIFIER_COOKIE)?.value,
    state: cookieStore.get(STATE_COOKIE)?.value,
  };
}

/**
 * Clear OAuth params after use
 */
export async function clearOAuthParams() {
  const cookieStore = await cookies();
  cookieStore.delete(CODE_VERIFIER_COOKIE);
  cookieStore.delete(STATE_COOKIE);
}

/**
 * Get access token from cookies (with auto-refresh)
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  
  if (accessToken) {
    return accessToken;
  }

  // Try to refresh using refresh token
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) {
    return null;
  }

  const tokens = await refreshAccessToken(refreshToken);
  if (!tokens) {
    // Refresh failed, clear all tokens
    await clearTokens();
    return null;
  }

  // Store new tokens
  await storeTokens(tokens);
  return tokens.accessToken;
}

/**
 * Clear all auth tokens (logout)
 */
export async function clearTokens() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(ID_TOKEN_COOKIE);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  return !!(accessToken || refreshToken);
}

/**
 * Get logout URL for Shopify
 */
export function getLogoutUrl(postLogoutRedirectUri: string): string {
  const idToken = ''; // We'd need to get this from cookies in a server action
  const params = new URLSearchParams({
    id_token_hint: idToken,
    post_logout_redirect_uri: postLogoutRedirectUri,
  });
  return `${LOGOUT_ENDPOINT}?${params.toString()}`;
}

/**
 * Fetch customer data from Customer Account API
 */
export async function fetchCustomer(accessToken: string) {
  const query = `
    query {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        phoneNumber {
          phoneNumber
        }
        defaultAddress {
          address1
          address2
          city
          province
          country
          zip
        }
        orders(first: 10) {
          edges {
            node {
              id
              name
              processedAt
              fulfillments(first: 1) {
                nodes {
                  status
                }
              }
              totalPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  try {
    console.log('fetchCustomer: Calling endpoint:', CUSTOMER_API_ENDPOINT);
    
    const response = await fetch(CUSTOMER_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query }),
    });

    console.log('fetchCustomer: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Customer fetch failed:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    console.log('fetchCustomer: Response data:', JSON.stringify(data, null, 2));
    
    if (data.errors) {
      console.error('fetchCustomer: GraphQL errors:', data.errors);
      return null;
    }
    
    return data.data?.customer;
  } catch (error) {
    console.error('Customer fetch error:', error);
    return null;
  }
}

// Export constants for use in routes
export {
  APP_URL,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ID_TOKEN_COOKIE,
};
