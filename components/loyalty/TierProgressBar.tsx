"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, Globe, Archive, Crown, Check } from "lucide-react";
import type { TierId, Tier } from "@/lib/loyalty/types";

interface TierProgressBarProps {
  currentTier: Tier;
  nextTier?: Tier;
  lifetimeMiles: number;
  stampCount: number;
  className?: string;
  variant?: "default" | "compact" | "card";
}

const TIER_CONFIG: Record<TierId, { 
  gradient: string; 
  bg: string; 
  text: string; 
  accent: string;
  glow: string;
  icon: React.ReactNode;
}> = {
  initiate: {
    gradient: "from-stone-400 to-stone-500",
    bg: "bg-stone-100",
    text: "text-stone-700",
    accent: "bg-stone-500",
    glow: "shadow-stone-500/20",
    icon: <Sparkles className="w-5 h-5" />,
  },
  voyager: {
    gradient: "from-sky-400 to-blue-500",
    bg: "bg-sky-50",
    text: "text-sky-700",
    accent: "bg-sky-500",
    glow: "shadow-sky-500/30",
    icon: <Globe className="w-5 h-5" />,
  },
  collector: {
    gradient: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    accent: "bg-amber-500",
    glow: "shadow-amber-500/30",
    icon: <Archive className="w-5 h-5" />,
  },
  laureate: {
    gradient: "from-gold to-amber-600",
    bg: "bg-gold/10",
    text: "text-gold",
    accent: "bg-gradient-to-r from-gold to-amber-500",
    glow: "shadow-gold/40",
    icon: <Crown className="w-5 h-5" />,
  },
};

export function TierProgressBar({
  currentTier,
  nextTier,
  lifetimeMiles,
  stampCount,
  className,
  variant = "default",
}: TierProgressBarProps) {
  const config = TIER_CONFIG[currentTier.id];

  // Calculate progress
  const milesProgress = nextTier
    ? Math.min(100, (lifetimeMiles / nextTier.milesThreshold) * 100)
    : 100;
  const stampsProgress = nextTier && nextTier.stampsThreshold > 0
    ? Math.min(100, (stampCount / nextTier.stampsThreshold) * 100)
    : 0;
  const overallProgress = Math.max(milesProgress, stampsProgress);

  const milesRemaining = nextTier ? nextTier.milesThreshold - lifetimeMiles : 0;
  const stampsRemaining = nextTier ? nextTier.stampsThreshold - stampCount : 0;

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
          `bg-gradient-to-br ${config.gradient}`,
          config.glow
        )}>
          <span className="text-white">{config.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("font-serif text-sm", config.text)}>{currentTier.displayName}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn("h-full rounded-full", config.accent)}
              />
            </div>
            <span className="text-micro text-stone-400">{Math.round(overallProgress)}%</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-xl p-6",
        "bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800",
        "border border-stone-700/50",
        className
      )}>
        {/* Background glow */}
        <div className={cn(
          "absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20",
          `bg-gradient-to-br ${config.gradient}`
        )} />

        <div className="relative">
          {/* Tier Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center shadow-xl",
                `bg-gradient-to-br ${config.gradient}`,
                config.glow
              )}>
                <span className="text-white">{config.icon}</span>
              </div>
              <div>
                <p className="text-micro tracking-[0.2em] text-stone-400 uppercase mb-1">
                  Current Status
                </p>
                <h3 className="font-serif text-2xl text-white">
                  {currentTier.displayName}
                </h3>
              </div>
            </div>

            {/* Multiplier Badge */}
            <div className={cn(
              "px-4 py-2 rounded-full text-sm font-medium",
              `bg-gradient-to-r ${config.gradient} text-white`
            )}>
              {currentTier.milesMultiplier}× Miles
            </div>
          </div>

          {/* Progress Section */}
          {nextTier && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-400">
                  Journey to <span className="text-white font-medium">{nextTier.displayName}</span>
                </span>
                <span className="font-mono text-white">{Math.round(overallProgress)}%</span>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="relative h-3 bg-stone-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full",
                    `bg-gradient-to-r ${config.gradient}`
                  )}
                />
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-shimmer animate-shimmer" />
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>
                  {milesRemaining > 0 
                    ? `${milesRemaining.toLocaleString()} miles remaining`
                    : <span className="text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> Miles complete</span>
                  }
                </span>
                {nextTier.stampsThreshold > 0 && (
                  <span>
                    {stampsRemaining > 0 
                      ? `${stampsRemaining} stamps needed`
                      : <span className="text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> Stamps complete</span>
                    }
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Perks */}
          {currentTier.perks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-stone-700/50">
              <p className="text-micro tracking-[0.2em] text-stone-400 uppercase mb-3">
                Active Benefits
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentTier.perks.slice(0, 4).map((perk, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-stone-300">
                    <div className={cn("w-1.5 h-1.5 rounded-full", config.accent)} />
                    {perk}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("space-y-5", className)}>
      {/* Tier Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-luxury",
            `bg-gradient-to-br ${config.gradient}`,
            config.glow
          )}>
            <span className="text-white">{config.icon}</span>
          </div>
          <div>
            <p className="text-micro tracking-[0.2em] font-medium text-stone-400 uppercase">
              Current Tier
            </p>
            <h3 className={cn("font-serif text-2xl", config.text)}>
              {currentTier.displayName}
            </h3>
          </div>
        </div>

        {/* Multiplier Badge */}
        <div className={cn(
          "px-4 py-2 rounded-full text-sm font-semibold shadow-sm",
          `bg-gradient-to-r ${config.gradient} text-white`
        )}>
          {currentTier.milesMultiplier}× Miles
        </div>
      </div>

      {/* Progress Bar */}
      {nextTier && (
        <div className="space-y-3 p-5 bg-stone-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-500">
              Progress to <span className="font-medium text-stone-700">{nextTier.displayName}</span>
            </span>
            <span className="font-mono font-medium text-stone-900">{Math.round(overallProgress)}%</span>
          </div>

          <div className="relative h-2.5 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn("absolute inset-y-0 left-0 rounded-full", config.accent)}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>
              {milesRemaining > 0 ? (
                <>{milesRemaining.toLocaleString()} miles to go</>
              ) : (
                <span className="text-green-600">✓ Miles complete</span>
              )}
            </span>
            {nextTier.stampsThreshold > 0 && (
              <span>
                {stampsRemaining > 0 ? (
                  <>or {stampsRemaining} more stamps</>
                ) : (
                  <span className="text-green-600">✓ Stamps complete</span>
                )}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Perks Preview */}
      {currentTier.perks.length > 0 && (
        <div className="pt-4 border-t border-stone-100">
          <p className="text-micro tracking-[0.2em] font-medium text-stone-400 uppercase mb-3">
            Your Benefits
          </p>
          <ul className="space-y-2">
            {currentTier.perks.slice(0, 3).map((perk, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-stone-600">
                <div className={cn("w-2 h-2 rounded-full", config.accent)} />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Tier badge for inline use
export function TierBadge({ tier, size = "md" }: { tier: Tier; size?: "sm" | "md" | "lg" }) {
  const config = TIER_CONFIG[tier.id];
  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 font-medium rounded-full",
      `bg-gradient-to-r ${config.gradient} text-white`,
      sizes[size]
    )}>
      <span className="opacity-80">{config.icon}</span>
      {tier.displayName}
    </span>
  );
}
