'use client';

// LOCRA Atlas Loyalty - Referral Tracking Hook
// =====================================================
// Captures referral codes from URL params and stores in cookies

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

const REFERRAL_COOKIE_NAME = 'locra_ref';
const REFERRAL_COOKIE_DAYS = 30; // Referral attribution window

interface ReferralState {
  referralCode: string | null;
  isReferred: boolean;
  clearReferral: () => void;
}

// Set a cookie
function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

// Get a cookie
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

// Delete a cookie
function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export function useReferralTracking(): ReferralState {
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    // Check URL params first (ref=CODE or referral=CODE)
    const refFromUrl = searchParams.get('ref') || searchParams.get('referral');
    
    if (refFromUrl) {
      // Store in cookie
      setCookie(REFERRAL_COOKIE_NAME, refFromUrl.toUpperCase(), REFERRAL_COOKIE_DAYS);
      setReferralCode(refFromUrl.toUpperCase());
    } else {
      // Check existing cookie
      const existingRef = getCookie(REFERRAL_COOKIE_NAME);
      setReferralCode(existingRef);
    }
  }, [searchParams]);

  const clearReferral = useCallback(() => {
    deleteCookie(REFERRAL_COOKIE_NAME);
    setReferralCode(null);
  }, []);

  return {
    referralCode,
    isReferred: !!referralCode,
    clearReferral,
  };
}

// Server-side helper to get referral from cookies
export function getReferralFromCookies(cookieString: string): string | null {
  const cookies = cookieString.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  return cookies[REFERRAL_COOKIE_NAME] || null;
}

// Claim a referral code via API
export async function claimReferralCode(
  referralCode: string,
  email: string,
  shopifyCustomerId?: string
): Promise<{ success: boolean; error?: string; accountId?: string }> {
  try {
    const response = await fetch('/api/loyalty/referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referralCode,
        email,
        shopifyCustomerId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Claim referral error:', error);
    return { success: false, error: 'Failed to claim referral code' };
  }
}
