'use client';

/**
 * Auth Provider - React Context for Authentication State
 * ======================================================
 * Provides authentication state and methods to the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Customer type from Shopify Customer Account API
export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: {
    emailAddress: string;
  } | null;
  phoneNumber: {
    phoneNumber: string;
  } | null;
  defaultAddress: {
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zip: string | null;
  } | null;
  orders: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        processedAt: string;
        fulfillments: {
          nodes: Array<{ status: string }>;
        };
        totalPrice: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

interface AuthContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (redirectTo?: string) => void;
  logout: (redirectTo?: string) => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialCustomer?: Customer | null;
}

export function AuthProvider({ children, initialCustomer = null }: AuthProviderProps) {
  const [customer, setCustomer] = useState<Customer | null>(initialCustomer);
  const [isLoading, setIsLoading] = useState(!initialCustomer);
  const [error, setError] = useState<string | null>(null);

  // Fetch customer data
  const fetchCustomerData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/customer', {
        credentials: 'include',
      });

      if (response.status === 401) {
        // Not authenticated
        setCustomer(null);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch customer data');
      }

      const data = await response.json();
      setCustomer(data.customer);
    } catch (err) {
      console.error('Auth fetch error:', err);
      setError(err instanceof Error ? err.message : 'Authentication error');
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    if (!initialCustomer) {
      fetchCustomerData();
    }
  }, [initialCustomer, fetchCustomerData]);

  // Login - redirect to OAuth flow
  const login = useCallback((redirectTo: string = '/') => {
    window.location.href = `/api/auth/login?redirect=${encodeURIComponent(redirectTo)}`;
  }, []);

  // Logout - clear tokens and redirect
  const logout = useCallback((redirectTo: string = '/') => {
    window.location.href = `/api/auth/logout?redirect=${encodeURIComponent(redirectTo)}`;
  }, []);

  // Refresh customer data
  const refresh = useCallback(async () => {
    await fetchCustomerData();
  }, [fetchCustomerData]);

  const value: AuthContextType = {
    customer,
    isAuthenticated: !!customer,
    isLoading,
    error,
    login,
    logout,
    refresh,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Utility hook for protected routes
export function useRequireAuth(redirectTo: string = '/account/login') {
  const { isAuthenticated, isLoading, login } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      login(redirectTo);
    }
  }, [isAuthenticated, isLoading, login, redirectTo]);

  return { isAuthenticated, isLoading };
}
