'use client';

/**
 * NavAccountWidget - Navigation Account Button/Dropdown
 * =====================================================
 * Uses the AuthProvider to show login button or user dropdown
 */

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/auth';
import { 
  User, 
  Map, 
  Gift, 
  LogOut, 
  ChevronDown, 
  Settings,
  Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavAccountWidgetProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export function NavAccountWidget({ variant = 'dark', className }: NavAccountWidgetProps) {
  const { customer, isAuthenticated, isLoading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        variant === 'light' ? "bg-white/10" : "bg-stone-100"
      )}>
        <Loader2 className={cn(
          "w-4 h-4 animate-spin",
          variant === 'light' ? "text-white/60" : "text-stone-400"
        )} />
      </div>
    );
  }

  // Not logged in state
  if (!isAuthenticated) {
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

  // Logged in state
  const displayName = customer?.firstName || 'Traveler';
  const email = customer?.emailAddress?.emailAddress || '';

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
        {/* Avatar */}
        <div className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-gold to-amber-500"
        )}>
          <span className="text-sm font-medium">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* Name - Desktop only */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-micro font-medium">{displayName}</span>
          <ChevronDown className={cn(
            "w-3.5 h-3.5 transition-transform duration-300",
            isOpen && "rotate-180",
            variant === 'light' ? "text-white/60" : "text-stone-400"
          )} />
        </div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-3 w-72 bg-white rounded-xl shadow-luxury-xl border border-stone-100 overflow-hidden z-50"
            onMouseLeave={() => setIsOpen(false)}
          >
            {/* Header */}
            <div className="p-5 border-b border-stone-100">
              <p className="font-serif text-lg text-stone-900">{displayName}</p>
              <p className="text-sm text-stone-400 truncate">{email}</p>
            </div>

            {/* Quick Links */}
            <div className="p-2">
              <Link
                href="/passport"
                className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Map className="w-5 h-5 text-stone-400 group-hover:text-gold transition-colors" />
                <span className="font-medium text-stone-700 group-hover:text-stone-900 transition-colors">
                  My Passport
                </span>
              </Link>
              
              <Link
                href="/passport?tab=rewards"
                className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Gift className="w-5 h-5 text-stone-400 group-hover:text-gold transition-colors" />
                <span className="font-medium text-stone-700 group-hover:text-stone-900 transition-colors">
                  Rewards
                </span>
              </Link>
              
              <Link
                href="/account"
                className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-5 h-5 text-stone-400 group-hover:text-gold transition-colors" />
                <span className="font-medium text-stone-700 group-hover:text-stone-900 transition-colors">
                  Account Settings
                </span>
              </Link>
            </div>

            {/* Sign Out */}
            <div className="p-2 border-t border-stone-100">
              <button
                className="w-full group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  logout('/');
                }}
              >
                <LogOut className="w-5 h-5 text-stone-400 group-hover:text-red-500 transition-colors" />
                <span className="font-medium text-stone-600 group-hover:text-red-600 transition-colors">
                  Sign Out
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
