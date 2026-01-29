'use client';

// LOCRA Atlas - Referral Context Provider
// =====================================================
// Wraps the app to track referrals and show banners to referred visitors

import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ReferralBanner } from '@/components/loyalty/ReferralSystem';

interface ReferralContextValue {
  referralCode: string | null;
  isReferred: boolean;
  clearReferral: () => void;
  showBanner: boolean;
  dismissBanner: () => void;
}

const ReferralContext = createContext<ReferralContextValue>({
  referralCode: null,
  isReferred: false,
  clearReferral: () => {},
  showBanner: false,
  dismissBanner: () => {},
});

export const useReferral = () => useContext(ReferralContext);

const COOKIE_NAME = 'locra_ref';
const BANNER_DISMISSED_KEY = 'locra_ref_banner_dismissed';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

function ReferralProviderContent({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check URL params first
    const refFromUrl = searchParams.get('ref') || searchParams.get('referral');
    
    if (refFromUrl) {
      const code = refFromUrl.toUpperCase();
      setCookie(COOKIE_NAME, code, 30);
      setReferralCode(code);
      
      // Show banner if not previously dismissed
      const dismissed = sessionStorage.getItem(BANNER_DISMISSED_KEY);
      if (!dismissed) {
        setShowBanner(true);
      }
    } else {
      // Check existing cookie
      const existingRef = getCookie(COOKIE_NAME);
      if (existingRef) {
        setReferralCode(existingRef);
      }
    }
  }, [searchParams]);

  const clearReferral = () => {
    deleteCookie(COOKIE_NAME);
    setReferralCode(null);
    setShowBanner(false);
  };

  const dismissBanner = () => {
    sessionStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    setShowBanner(false);
  };

  return (
    <ReferralContext.Provider
      value={{
        referralCode,
        isReferred: !!referralCode,
        clearReferral,
        showBanner,
        dismissBanner,
      }}
    >
      {showBanner && (
        <ReferralBanner
          bonusMiles={500}
          onDismiss={dismissBanner}
        />
      )}
      {children}
    </ReferralContext.Provider>
  );
}

export function ReferralProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ReferralProviderContent>{children}</ReferralProviderContent>
    </Suspense>
  );
}
