'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogoIcon } from '@/components/brand/Logo';
import { useAuth } from '@/components/auth';
import { 
  ArrowRight, 
  Plane, 
  Map, 
  Gift, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const ERROR_MESSAGES: Record<string, string> = {
  auth_failed: 'Authentication failed. Please try again.',
  invalid_request: 'Invalid request. Please try again.',
  session_expired: 'Your session has expired. Please sign in again.',
  invalid_state: 'Security validation failed. Please try again.',
  token_exchange_failed: 'Failed to complete sign in. Please try again.',
  callback_failed: 'An error occurred during sign in. Please try again.',
  access_denied: 'Access was denied. Please try again.',
};

const BENEFITS = [
  {
    icon: Plane,
    title: 'Earn Miles',
    description: '1 mile for every $1 spent, up to 2× with tier bonuses',
  },
  {
    icon: Map,
    title: 'Collect Stamps',
    description: 'Build your passport with every destination explored',
  },
  {
    icon: Gift,
    title: 'Exclusive Rewards',
    description: 'Early access, member discounts, and surprise perks',
  },
];

export default function LoginPageClient() {
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const error = searchParams.get('error');
  const redirect = searchParams.get('redirect') || '/passport';
  const errorMessage = error ? ERROR_MESSAGES[error] || 'An error occurred. Please try again.' : null;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setIsRedirecting(true);
      window.location.href = redirect;
    }
  }, [isAuthenticated, isLoading, redirect]);

  const handleLogin = () => {
    setIsRedirecting(true);
    window.location.href = `/api/auth/login?redirect=${encodeURIComponent(redirect)}`;
  };

  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
          <p className="text-stone-500">
            {isRedirecting ? 'Redirecting...' : 'Loading...'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left Panel - Login */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="inline-block mb-12">
            <LogoIcon className="h-10 w-auto text-stone-900 hover:text-gold transition-colors" />
          </Link>

          {/* Header */}
          <div className="mb-10">
            <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4 italic">
              Welcome Back
            </h1>
            <p className="text-stone-500 text-lg">
              Sign in to access your passport, track your journeys, and unlock exclusive rewards.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </motion.div>
          )}

          {/* Sign In Button */}
          <Button
            onClick={handleLogin}
            size="xl"
            className="w-full h-14 bg-stone-900 hover:bg-gold text-white rounded-sm font-medium tracking-wide transition-all duration-500"
          >
            Sign In with Shopify
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p className="mt-4 text-center text-sm text-stone-400">
            You&apos;ll be redirected to Shopify to sign in securely.
          </p>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-micro text-stone-400 bg-stone-50 uppercase tracking-wider">
                New to LOCRA?
              </span>
            </div>
          </div>

          {/* Create Account CTA */}
          <Button
            asChild
            variant="outline"
            size="xl"
            className="w-full h-14 rounded-sm border-stone-300 text-stone-700 hover:border-gold hover:text-gold transition-all duration-300"
          >
            <Link href="/travel-club">
              Join the Travel Club
              <Plane className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Right Panel - Benefits (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 items-center justify-center p-16 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-gold/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-gold/10 to-transparent rounded-full blur-2xl" />
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-lg"
        >
          {/* Eyebrow */}
          <p className="text-micro font-medium tracking-[0.3em] text-gold uppercase mb-6">
            Member Benefits
          </p>

          <h2 className="font-serif text-4xl text-white mb-12 italic leading-tight">
            Your passport to exclusive rewards and unforgettable journeys.
          </h2>

          {/* Benefits List */}
          <div className="space-y-8">
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white mb-1">{benefit.title}</h3>
                  <p className="text-stone-400 text-sm">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-sm text-stone-400">
              <span className="text-gold">✓</span> Secure sign-in powered by Shopify
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
