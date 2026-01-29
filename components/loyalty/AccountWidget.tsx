'use client';

// LOCRA Atlas Loyalty - Navigation Account Widget
// =====================================================
// Premium account dropdown for navigation

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoyalty } from '@/hooks/useLoyalty';
import { User, Map, Gift, LogOut, ChevronDown, Plane, Sparkles, Crown, Globe, Archive, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountWidgetProps {
  shopifyCustomerId?: string;
  variant?: 'light' | 'dark';
  className?: string;
}

const TIER_STYLES = {
  laureate: { bg: 'bg-gradient-to-br from-gold to-amber-500', icon: Crown },
  collector: { bg: 'bg-gradient-to-br from-amber-400 to-orange-500', icon: Archive },
  voyager: { bg: 'bg-gradient-to-br from-sky-400 to-blue-500', icon: Globe },
  initiate: { bg: 'bg-gradient-to-br from-stone-400 to-stone-500', icon: Sparkles },
};

export function AccountWidget({ shopifyCustomerId, variant = 'dark', className }: AccountWidgetProps) {
  const { status, loading } = useLoyalty({
    shopifyCustomerId,
    autoFetch: !!shopifyCustomerId,
  });
  const [isOpen, setIsOpen] = useState(false);

  // Not logged in state
  if (!shopifyCustomerId) {
    return (
      <Link
        href="/account/login"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-micro font-medium tracking-[0.15em] uppercase transition-all duration-300",
          variant === 'light' 
            ? "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm" 
            : "bg-stone-100 hover:bg-stone-200 text-stone-700",
          className
        )}
      >
        <User className="w-4 h-4" />
        Sign In
      </Link>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className={cn(
        "w-10 h-10 rounded-full animate-pulse",
        variant === 'light' ? "bg-white/20" : "bg-stone-200"
      )} />
    );
  }

  // Logged in state
  const tier = status?.tier;
  const tierId = tier?.id || 'initiate';
  const tierStyle = TIER_STYLES[tierId as keyof typeof TIER_STYLES] || TIER_STYLES.initiate;
  const milesBalance = status?.account?.availableMiles || 0;
  const stampCount = status?.account?.stampCount || 0;
  const TierIcon = tierStyle.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-3 px-2 py-1.5 rounded-full transition-all duration-300",
          variant === 'light' 
            ? "hover:bg-white/10 text-white" 
            : "hover:bg-stone-100 text-stone-900",
          className
        )}
      >
        {/* Tier Avatar */}
        <div className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg",
          tierStyle.bg
        )}>
          <TierIcon className="w-4 h-4" />
        </div>
        
        {/* Miles Badge - Desktop only */}
        <div className="hidden md:flex items-center gap-2">
          <div className="text-right">
            <p className="text-micro font-medium">{milesBalance.toLocaleString()} mi</p>
            <p className={cn(
              "text-[9px] uppercase tracking-wider",
              variant === 'light' ? "text-white/60" : "text-stone-400"
            )}>{tier?.displayName || 'Member'}</p>
          </div>
          <ChevronDown className={cn(
            "w-3.5 h-3.5 transition-transform duration-300",
            isOpen && "rotate-180",
            variant === 'light' ? "text-white/60" : "text-stone-400"
          )} />
        </div>
      </button>

      {/* Premium Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-luxury-xl border border-stone-100 overflow-hidden z-50"
            onMouseLeave={() => setIsOpen(false)}
          >
            {/* Header with gradient */}
            <div className="relative p-6 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 text-white overflow-hidden">
              {/* Background effects */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-gold/20 to-transparent rounded-full blur-2xl" />
              
              <div className="relative flex items-start gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg",
                  tierStyle.bg
                )}>
                  <TierIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-micro uppercase tracking-[0.2em] text-gold mb-1">
                    {tier?.displayName || 'Member'}
                  </p>
                  <p className="font-serif text-xl">
                    {status?.account?.firstName || 'Traveler'}
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="relative flex items-center gap-6 mt-5 pt-5 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-gold" />
                  <span className="font-mono">{milesBalance.toLocaleString()}</span>
                  <span className="text-micro text-stone-400">miles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-gold" />
                  <span className="font-mono">{stampCount}</span>
                  <span className="text-micro text-stone-400">stamps</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-3">
              <Link
                href="/passport"
                className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-stone-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  <Map className="w-5 h-5 text-stone-500 group-hover:text-gold transition-colors" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Your Passport</p>
                  <p className="text-sm text-stone-500">View stamps & progress</p>
                </div>
              </Link>
              
              <Link
                href="/passport?tab=rewards"
                className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-stone-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  <Gift className="w-5 h-5 text-stone-500 group-hover:text-gold transition-colors" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Redeem Rewards</p>
                  <p className="text-sm text-stone-500">{status?.availableRewards?.length || 0} available now</p>
                </div>
              </Link>
              
              <Link
                href="/account"
                className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-stone-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  <Settings className="w-5 h-5 text-stone-500 group-hover:text-gold transition-colors" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Account Settings</p>
                  <p className="text-sm text-stone-500">Manage your profile</p>
                </div>
              </Link>
            </div>

            {/* Sign Out */}
            <div className="p-3 border-t border-stone-100">
              <button
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left group"
                onClick={() => {
                  // Handle logout
                  setIsOpen(false);
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <LogOut className="w-5 h-5 text-stone-400 group-hover:text-red-500 transition-colors" />
                </div>
                <span className="font-medium text-stone-600 group-hover:text-red-600 transition-colors">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact version for mobile nav
export function AccountWidgetCompact({ shopifyCustomerId }: { shopifyCustomerId?: string }) {
  const { status } = useLoyalty({
    shopifyCustomerId,
    autoFetch: !!shopifyCustomerId,
  });

  if (!shopifyCustomerId) {
    return (
      <Link 
        href="/account/login" 
        className="flex items-center gap-3 py-4 border-b border-stone-100"
      >
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
          <User className="w-5 h-5 text-stone-400" />
        </div>
        <div>
          <p className="font-serif text-lg text-stone-900">Sign In</p>
          <p className="text-sm text-stone-500">Access your passport</p>
        </div>
      </Link>
    );
  }

  const tierId = status?.tier?.id || 'initiate';
  const tierStyle = TIER_STYLES[tierId as keyof typeof TIER_STYLES] || TIER_STYLES.initiate;
  const TierIcon = tierStyle.icon;

  return (
    <Link
      href="/passport"
      className="flex items-center justify-between py-4 border-b border-stone-100 group"
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg",
          tierStyle.bg
        )}>
          <TierIcon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-serif text-lg text-stone-900 group-hover:text-gold transition-colors">
            Your Passport
          </p>
          <p className="text-sm text-stone-500">
            {status?.account?.availableMiles?.toLocaleString() || 0} miles · {status?.stamps?.length || 0} stamps
          </p>
        </div>
      </div>
      <ChevronDown className="w-5 h-5 text-stone-300 -rotate-90 group-hover:text-gold transition-colors" />
    </Link>
  );
}
