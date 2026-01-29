'use client';

// LOCRA Atlas Loyalty - Miles Earned Celebration
// =====================================================
// Premium celebration component for order confirmation

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plane, Gift, Map, ChevronRight, Sparkles, Trophy, Crown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SparklesCore } from '@/components/ui/sparkles';
import { cn } from '@/lib/utils';

interface MilesEarnedCelebrationProps {
  milesEarned: number;
  newStamps?: { name: string; emoji: string; color: string }[];
  questsCompleted?: { name: string; milesReward: number }[];
  tierUpgrade?: string;
  currentTier: string;
  totalMiles: number;
  className?: string;
}

export function MilesEarnedCelebration({
  milesEarned,
  newStamps = [],
  questsCompleted = [],
  tierUpgrade,
  currentTier,
  totalMiles,
  className,
}: MilesEarnedCelebrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950",
        className
      )}
    >
      {/* Sparkles Background */}
      <div className="absolute inset-0">
        <SparklesCore
          id="miles-celebration-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={80}
          className="w-full h-full"
          particleColor="#C4A052"
        />
      </div>
      
      {/* Background effects */}
      <div className="absolute inset-0">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-radial from-gold/20 to-transparent rounded-full blur-3xl" 
        />
      </div>

      <div className="relative p-8 md:p-10">
        {/* Celebration Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: 'spring', damping: 12 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-gold-glow"
          >
            <Plane className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-micro uppercase tracking-[0.4em] text-gold mb-3"
          >
            Atlas Travel Club
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="font-serif text-display text-white"
          >
            +{milesEarned.toLocaleString()}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-body-lg text-stone-400 mt-2"
          >
            Miles added to your passport
          </motion.p>
        </div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 text-center border border-white/10">
            <Gift className="w-6 h-6 text-gold mx-auto mb-3" />
            <p className="text-2xl font-serif text-white">{totalMiles.toLocaleString()}</p>
            <p className="text-micro uppercase tracking-wider text-stone-400 mt-1">Total Miles</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 text-center border border-white/10">
            <Crown className="w-6 h-6 text-gold mx-auto mb-3" />
            <p className="text-2xl font-serif text-white">{currentTier}</p>
            <p className="text-micro uppercase tracking-wider text-stone-400 mt-1">Your Tier</p>
          </div>
        </motion.div>

        {/* New Stamps */}
        {newStamps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-5 mb-4 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-gold" />
              <p className="font-medium text-white">New Passport Stamps!</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {newStamps.map((stamp) => (
                <motion.div
                  key={stamp.name}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.1, type: 'spring', damping: 10 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border"
                  style={{ 
                    backgroundColor: `${stamp.color}15`,
                    borderColor: `${stamp.color}40`,
                  }}
                >
                  <span className="text-xl">{stamp.emoji}</span>
                  <span className="text-sm text-white">{stamp.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quests Completed */}
        {questsCompleted.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-5 mb-4 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-gold" />
              <p className="font-medium text-white">Quests Completed!</p>
            </div>
            <ul className="space-y-2">
              {questsCompleted.map((quest) => (
                <li key={quest.name} className="flex items-center justify-between text-stone-300">
                  <span className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400" />
                    {quest.name}
                  </span>
                  <span className="text-sm font-mono text-gold">+{quest.milesReward}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Tier Upgrade */}
        {tierUpgrade && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="relative overflow-hidden rounded-xl p-5 mb-4 border-2 border-gold/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold/20 via-amber-500/20 to-gold/20" />
            <div className="relative flex items-center gap-4">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: 3, duration: 0.5 }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-gold-glow"
              >
                <Crown className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <p className="font-serif text-xl text-white">Welcome to {tierUpgrade}!</p>
                <p className="text-sm text-stone-300">New perks and rewards await you</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Button
            asChild
            size="xl"
            className="w-full h-14 bg-gradient-to-r from-gold to-amber-500 hover:from-gold-600 hover:to-amber-600 text-stone-950"
          >
            <Link href="/passport" className="flex items-center justify-center gap-2">
              View Your Passport
              <ChevronRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Compact inline version for order confirmation page
export function MilesEarnedInline({
  milesEarned,
  totalMiles,
  newStamps = 0,
}: {
  milesEarned: number;
  totalMiles: number;
  newStamps?: number;
}) {
  return (
    <Link
      href="/passport"
      className="group flex items-center gap-4 p-5 bg-gradient-to-r from-gold/5 via-amber-50/50 to-gold/5 rounded-xl border border-gold/20 hover:border-gold/40 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Plane className="w-6 h-6 text-gold" />
      </div>
      <div className="flex-1">
        <p className="font-serif text-lg text-stone-900">
          +{milesEarned.toLocaleString()} Miles Earned
        </p>
        <p className="text-sm text-stone-500">
          Total: {totalMiles.toLocaleString()} miles
          {newStamps > 0 && ` · ${newStamps} new stamp${newStamps > 1 ? 's' : ''}`}
        </p>
      </div>
      <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
