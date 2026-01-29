"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, Gift, Package, Clock, Lock, CreditCard, Send, Sparkles, CheckCircle, ArrowRight, Plane } from "lucide-react";
import type { Reward, Redemption, TierId } from "@/lib/loyalty/types";

interface RewardsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableMiles: number;
  currentTier: TierId;
  rewards: Reward[];
  pendingRedemptions: (Redemption & { reward: Reward })[];
  onRedeem: (rewardId: string) => Promise<void>;
}

const REWARD_ICONS: Record<string, React.FC<{ className?: string }>> = {
  package: Package,
  clock: Clock,
  mail: Send,
  "lock-open": Lock,
  "pen-tool": Sparkles,
  zap: Sparkles,
  "credit-card": CreditCard,
};

export function RewardsDrawer({
  isOpen,
  onClose,
  availableMiles,
  currentTier,
  rewards,
  pendingRedemptions,
  onRedeem,
}: RewardsDrawerProps) {
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [justRedeemed, setJustRedeemed] = useState<string | null>(null);

  const handleRedeem = async (rewardId: string) => {
    setRedeeming(rewardId);
    try {
      await onRedeem(rewardId);
      setJustRedeemed(rewardId);
      setTimeout(() => setJustRedeemed(null), 3000);
    } finally {
      setRedeeming(null);
    }
  };

  // Group rewards by affordability
  const affordableRewards = rewards.filter((r) => r.milesCost <= availableMiles);
  const lockedRewards = rewards.filter((r) => r.milesCost > availableMiles);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-luxury-xl z-50 overflow-hidden flex flex-col"
          >
            {/* Premium Header */}
            <div className="relative bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 p-8 overflow-hidden">
              {/* Background effects */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-radial from-gold/20 to-transparent rounded-full blur-3xl" />
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(196,160,82,0.15) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                  }}
                />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-gold-glow">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl text-white">Rewards</h2>
                      <p className="text-micro text-stone-400 uppercase tracking-wider">Catalog</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onClose}
                    className="text-stone-400 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>

                {/* Miles Balance */}
                <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <Plane className="w-6 h-6 text-gold" />
                  <div className="flex-1">
                    <p className="text-micro text-stone-400 uppercase tracking-wider">Available Balance</p>
                    <p className="text-3xl font-serif text-white">{availableMiles.toLocaleString()} <span className="text-lg text-stone-400">miles</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-luxury">
              <div className="p-6 space-y-8">
                {/* Pending Redemptions */}
                {pendingRedemptions.length > 0 && (
                  <div>
                    <h3 className="text-micro tracking-[0.25em] font-medium text-stone-400 uppercase mb-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Ready to Use
                    </h3>
                    <div className="space-y-3">
                      {pendingRedemptions.map((redemption) => (
                        <motion.div
                          key={redemption.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
                            <Gift className="w-6 h-6 text-white" aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-stone-900">{redemption.reward.name}</p>
                            <p className="text-sm text-stone-500">
                              Valid until {new Date(redemption.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-micro uppercase tracking-wider font-medium rounded-full">
                            Active
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Affordable Rewards */}
                {affordableRewards.length > 0 && (
                  <div>
                    <h3 className="text-micro tracking-[0.25em] font-medium text-stone-400 uppercase mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold" />
                      Available Now
                    </h3>
                    <div className="space-y-4">
                      {affordableRewards.map((reward, i) => (
                        <motion.div
                          key={reward.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <RewardCard
                            reward={reward}
                            affordable
                            onRedeem={() => handleRedeem(reward.id)}
                            isRedeeming={redeeming === reward.id}
                            justRedeemed={justRedeemed === reward.id}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Locked Rewards */}
                {lockedRewards.length > 0 && (
                  <div>
                    <h3 className="text-micro tracking-[0.25em] font-medium text-stone-400 uppercase mb-4 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Earn More to Unlock
                    </h3>
                    <div className="space-y-4">
                      {lockedRewards.map((reward, i) => (
                        <motion.div
                          key={reward.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <RewardCard
                            reward={reward}
                            affordable={false}
                            milesNeeded={reward.milesCost - availableMiles}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {rewards.length === 0 && (
                  <div className="text-center py-12">
                    <Gift className="w-14 h-14 text-stone-200 mx-auto mb-4" />
                    <h3 className="font-serif text-xl text-stone-900 mb-2">No Rewards Available</h3>
                    <p className="text-stone-500">Check back soon for new rewards!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-stone-100 bg-stone-50">
              <p className="text-micro text-stone-400 text-center uppercase tracking-wider">
                Rewards are valid for 90 days after redemption
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface RewardCardProps {
  reward: Reward;
  affordable: boolean;
  onRedeem?: () => void;
  isRedeeming?: boolean;
  justRedeemed?: boolean;
  milesNeeded?: number;
}

function RewardCard({ reward, affordable, onRedeem, isRedeeming, justRedeemed, milesNeeded }: RewardCardProps) {
  const IconComponent = REWARD_ICONS[reward.icon] || Gift;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border transition-all duration-300",
        affordable
          ? "bg-white border-stone-200 hover:border-gold/40 hover:shadow-luxury"
          : "bg-stone-50 border-stone-100"
      )}
    >
      {/* Success overlay */}
      <AnimatePresence>
        {justRedeemed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-green-500 flex items-center justify-center z-10"
          >
            <div className="text-center text-white">
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Redeemed!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("flex items-start gap-4 p-5", !affordable && "opacity-60")}>
        <div
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
            affordable 
              ? "bg-gradient-to-br from-gold/20 to-gold/5" 
              : "bg-stone-100"
          )}
        >
          <IconComponent
            className={cn("w-7 h-7", affordable ? "text-gold" : "text-stone-400")}
            aria-hidden="true"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-medium text-stone-900">{reward.name}</h4>
              <p className="text-sm text-stone-500 mt-1 line-clamp-2">{reward.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
            <div className="flex items-baseline gap-1.5">
              <span
                className={cn(
                  "text-xl font-serif",
                  affordable ? "text-gold" : "text-stone-400"
                )}
              >
                {reward.milesCost.toLocaleString()}
              </span>
              <span className="text-sm text-stone-400">miles</span>
            </div>

            {affordable ? (
              <Button
                size="sm"
                onClick={onRedeem}
                disabled={isRedeeming}
                className="h-9 px-5 bg-gradient-to-r from-gold to-amber-500 hover:from-gold-600 hover:to-amber-600 text-stone-950"
              >
                {isRedeeming ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full"
                    />
                    Redeeming
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Redeem
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            ) : (
              <div className="text-right">
                <p className="text-sm text-stone-500">
                  <span className="font-medium text-stone-700">{milesNeeded?.toLocaleString()}</span> more needed
                </p>
              </div>
            )}
          </div>

          {/* Tier Requirement */}
          {reward.minTierId !== "initiate" && (
            <div className="flex items-center gap-1.5 mt-3">
              <Lock className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
              <span className="text-micro text-stone-400 uppercase tracking-wider">
                {reward.minTierId} tier required
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
