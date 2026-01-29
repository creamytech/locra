'use client';

// LOCRA Atlas Loyalty - React Hook
// =====================================================

import { useState, useEffect, useCallback } from 'react';
import type { MemberStatus, RedeemRewardResponse } from '@/lib/loyalty/types';

interface UseLoyaltyOptions {
  shopifyCustomerId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  autoFetch?: boolean;
  autoEnroll?: boolean; // Auto-enroll if no account exists
}

interface UseLoyaltyReturn {
  status: MemberStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  redeemReward: (rewardId: string) => Promise<RedeemRewardResponse>;
  claimReferral: (code: string) => Promise<{ success: boolean; error?: string }>;
  enrolling: boolean;
}

export function useLoyalty(options: UseLoyaltyOptions = {}): UseLoyaltyReturn {
  const { 
    shopifyCustomerId, 
    email, 
    firstName, 
    lastName, 
    autoFetch = true,
    autoEnroll = true,
  } = options;
  
  const [status, setStatus] = useState<MemberStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-enroll function
  const enrollCustomer = useCallback(async () => {
    if (!shopifyCustomerId || !email) return false;
    
    setEnrolling(true);
    try {
      console.log('useLoyalty: Auto-enrolling customer', shopifyCustomerId);
      const response = await fetch('/api/loyalty/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopifyCustomerId,
          email,
          firstName,
          lastName,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to enroll customer');
      }
      
      const data = await response.json();
      console.log('useLoyalty: Enrollment result:', data);
      return data.success;
    } catch (err) {
      console.error('useLoyalty: Enrollment error:', err);
      return false;
    } finally {
      setEnrolling(false);
    }
  }, [shopifyCustomerId, email, firstName, lastName]);

  const fetchStatus = useCallback(async () => {
    if (!shopifyCustomerId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/loyalty/status?customerId=${shopifyCustomerId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // No account found - try to auto-enroll
          if (autoEnroll && email) {
            console.log('useLoyalty: No account found, attempting auto-enroll');
            const enrolled = await enrollCustomer();
            if (enrolled) {
              // Retry fetching status after enrollment
              const retryResponse = await fetch(`/api/loyalty/status?customerId=${shopifyCustomerId}`);
              if (retryResponse.ok) {
                const data = await retryResponse.json();
                setStatus(data);
                return;
              }
            }
          }
          setStatus(null);
          return;
        }
        throw new Error('Failed to fetch loyalty status');
      }
      
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [shopifyCustomerId, autoEnroll, email, enrollCustomer]);

  useEffect(() => {
    if (autoFetch && shopifyCustomerId) {
      fetchStatus();
    }
  }, [autoFetch, shopifyCustomerId, fetchStatus]);

  const redeemReward = useCallback(async (rewardId: string): Promise<RedeemRewardResponse> => {
    if (!status?.account) {
      return { success: false, error: 'Not logged in' };
    }

    try {
      const response = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: status.account.id,
          rewardId,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refetch status to update miles
        await fetchStatus();
      }
      
      return data;
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [status, fetchStatus]);

  const claimReferral = useCallback(async (code: string): Promise<{ success: boolean; error?: string }> => {
    if (!status?.account) {
      return { success: false, error: 'Not logged in' };
    }

    try {
      const response = await fetch('/api/loyalty/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode: code,
          newAccountId: status.account.id,
        }),
      });
      
      return await response.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [status]);

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
    redeemReward,
    claimReferral,
    enrolling,
  };
}

// =====================================================
// Loyalty Context Provider
// =====================================================

import { createContext, useContext, ReactNode } from 'react';

interface LoyaltyContextValue extends UseLoyaltyReturn {
  customerId: string | null;
}

const LoyaltyContext = createContext<LoyaltyContextValue | null>(null);

interface LoyaltyProviderProps {
  children: ReactNode;
  customerId?: string;
}

export function LoyaltyProvider({ children, customerId }: LoyaltyProviderProps) {
  const loyalty = useLoyalty({ shopifyCustomerId: customerId });
  
  return (
    <LoyaltyContext.Provider value={{ ...loyalty, customerId: customerId || null }}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyaltyContext(): LoyaltyContextValue {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyaltyContext must be used within a LoyaltyProvider');
  }
  return context;
}
