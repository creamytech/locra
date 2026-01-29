"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Gift, Truck, Clock, Tag, Sparkles } from "lucide-react";
import type { Redemption, Reward } from "@/lib/loyalty/types";

interface SuitcasePerksProps {
  pendingRedemptions: (Redemption & { reward: Reward })[];
  tierPerks: {
    freeShipping: boolean;
    shippingThreshold: number | null;
    earlyAccess: boolean;
    earlyAccessHours: number;
  };
  className?: string;
}

export function SuitcasePerks({ pendingRedemptions, tierPerks, className }: SuitcasePerksProps) {
  const hasActivePerks = pendingRedemptions.length > 0 || tierPerks.freeShipping || tierPerks.earlyAccess;

  if (!hasActivePerks) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-[10px] tracking-[0.2em] font-medium text-stone-400 uppercase">
        Packed Perks
      </h3>

      <div className="space-y-2">
        {/* Redeemed Rewards */}
        {pendingRedemptions.map((redemption) => (
          <PerkBadge
            key={redemption.id}
            icon={getPerkIcon(redemption.reward.rewardType)}
            label={redemption.reward.name}
            value={redemption.shopifyDiscountCode}
            variant="redeemed"
          />
        ))}

        {/* Tier Perks */}
        {tierPerks.freeShipping && (
          <PerkBadge
            icon={<Truck className="w-4 h-4" />}
            label="Free Shipping"
            value="Always"
            variant="tier"
          />
        )}

        {!tierPerks.freeShipping && tierPerks.shippingThreshold && (
          <PerkBadge
            icon={<Truck className="w-4 h-4" />}
            label="Free Shipping"
            value={`Over $${(tierPerks.shippingThreshold / 100).toFixed(0)}`}
            variant="tier"
          />
        )}

        {tierPerks.earlyAccess && tierPerks.earlyAccessHours > 0 && (
          <PerkBadge
            icon={<Clock className="w-4 h-4" />}
            label="Early Portal Entry"
            value={`${tierPerks.earlyAccessHours}h ahead`}
            variant="tier"
          />
        )}
      </div>
    </div>
  );
}

interface PerkBadgeProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  variant: "redeemed" | "tier";
}

function PerkBadge({ icon, label, value, variant }: PerkBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg",
        variant === "redeemed"
          ? "bg-gold/5 border border-gold/20"
          : "bg-stone-50 border border-stone-100"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          variant === "redeemed" ? "bg-gold/10 text-gold" : "bg-stone-100 text-stone-500"
        )}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-stone-900">{label}</p>
        {value && <p className="text-xs text-stone-500">{value}</p>}
      </div>
      {variant === "redeemed" && (
        <span className="text-[10px] font-medium text-gold uppercase tracking-wide">Applied</span>
      )}
    </motion.div>
  );
}

function getPerkIcon(rewardType: string): React.ReactNode {
  switch (rewardType) {
    case "free_shipping":
      return <Truck className="w-4 h-4" />;
    case "early_access":
      return <Clock className="w-4 h-4" />;
    case "atlas_credit":
      return <Tag className="w-4 h-4" />;
    case "monogram_credit":
      return <Sparkles className="w-4 h-4" />;
    default:
      return <Gift className="w-4 h-4" />;
  }
}

// Compact version for cart header
export function SuitcasePerksCompact({
  count,
  onClick,
}: {
  count: number;
  onClick?: () => void;
}) {
  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-gold/5 border border-gold/20 rounded-full text-xs font-medium text-gold hover:bg-gold/10 transition-colors"
    >
      <Gift className="w-3.5 h-3.5" aria-hidden="true" />
      {count} perk{count !== 1 ? "s" : ""} packed
    </button>
  );
}

// Miles earned toast notification
export function MilesEarnedToast({
  miles,
  message,
  onClose,
}: {
  miles: number;
  message: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl border border-stone-100 p-4 flex items-center gap-4 z-50"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
        <span className="text-xl">✈️</span>
      </div>
      <div>
        <p className="font-serif text-lg text-stone-900">+{miles.toLocaleString()} Miles</p>
        <p className="text-sm text-stone-500">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 p-1 text-stone-400 hover:text-stone-600"
        aria-label="Close"
      >
        ×
      </button>
    </motion.div>
  );
}

// Tier upgrade celebration
export function TierUpgradeModal({
  newTier,
  onClose,
}: {
  newTier: { name: string; displayName: string; perks: string[] };
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center mb-6"
        >
          <span className="text-4xl">🎉</span>
        </motion.div>

        <h2 className="font-serif text-2xl text-stone-900">Welcome to {newTier.displayName}</h2>
        <p className="text-stone-500 mt-2">
          Your journey has earned you a new tier in the Atlas.
        </p>

        <div className="mt-6 p-4 bg-gold/5 rounded-lg border border-gold/20 text-left">
          <p className="text-[10px] tracking-[0.2em] font-medium text-gold uppercase mb-3">
            Your New Perks
          </p>
          <ul className="space-y-2">
            {newTier.perks.slice(0, 4).map((perk, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-stone-700">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gold text-white font-medium rounded-lg hover:bg-gold/90 transition-colors"
        >
          Continue Your Journey
        </button>
      </motion.div>
    </motion.div>
  );
}
