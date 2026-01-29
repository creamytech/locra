'use client';

// LOCRA Atlas Loyalty - Cart Integration
// =====================================================

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartLoyaltyBannerProps {
  cartTotal: number; // in cents
  isLoggedIn: boolean;
  milesBalance?: number;
  pendingMiles?: number; // Miles to be earned from this cart
  className?: string;
}

export function CartLoyaltyBanner({
  cartTotal,
  isLoggedIn,
  milesBalance = 0,
  className,
}: CartLoyaltyBannerProps) {
  // Calculate miles to be earned (1 mile per $1)
  const milesToEarn = Math.floor(cartTotal / 100);

  if (!isLoggedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "p-4 bg-gradient-to-r from-stone-800 to-stone-900 rounded-lg",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
            <Gift className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Join the Travel Club</p>
            <p className="text-xs text-stone-400 mt-0.5">
              Sign in to earn <span className="text-gold font-medium">{milesToEarn} miles</span> on this purchase
            </p>
          </div>
          <Link
            href="/account/login"
            className="text-[10px] font-medium tracking-wider uppercase text-gold hover:text-gold/80 transition-colors flex items-center gap-1"
          >
            Sign In
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </motion.div>
    );
  }

  // Logged in - show miles to be earned
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-900">
              Earning <span className="text-gold font-bold">+{milesToEarn}</span> miles
            </p>
            <p className="text-xs text-stone-500">
              Balance after: {(milesBalance + milesToEarn).toLocaleString()} mi
            </p>
          </div>
        </div>
        <Link
          href="/passport"
          className="text-[10px] font-medium tracking-wider uppercase text-stone-500 hover:text-stone-700 transition-colors flex items-center gap-1"
        >
          Passport
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}

// Compact perks badge for cart header
export function CartPerksBadge({
  pendingPerksCount,
  onClick,
}: {
  pendingPerksCount: number;
  onClick?: () => void;
}) {
  if (pendingPerksCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-xs font-medium text-gold hover:bg-gold/20 transition-colors"
    >
      <Gift className="w-3.5 h-3.5" />
      {pendingPerksCount} perk{pendingPerksCount !== 1 ? 's' : ''} ready
    </button>
  );
}
