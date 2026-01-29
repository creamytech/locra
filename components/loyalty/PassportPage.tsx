"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TierProgressBar } from "./TierProgressBar";
import { StampGrid, StampRowCompact } from "./StampGrid";
import { RewardsDrawer } from "./RewardsDrawer";
import { Button } from "@/components/ui/button";
import { Gift, ChevronRight, Clock, CheckCircle, Copy, Share2, Plane, Target, Trophy, Sparkles } from "lucide-react";
import type { MemberStatus, Quest, QuestProgress } from "@/lib/loyalty/types";

interface PassportPageProps {
  status: MemberStatus;
  allDestinations: { id: string; handle: string; name: string; region: string; stampEmoji: string; stampColor: string; coordinates: string; tagline: string; active: boolean }[];
  onRedeemReward: (rewardId: string) => Promise<void>;
}

export function PassportPage({ status, allDestinations, onRedeemReward }: PassportPageProps) {
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "stamps" | "quests">("overview");
  const [copied, setCopied] = useState(false);

  const copyReferralLink = async () => {
    const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/ref/${status.account.referralCode}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Cinematic Hero Header */}
      <div className="relative bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-gold/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-gradient-radial from-amber-500/5 to-transparent rounded-full blur-3xl" />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(196,160,82,0.15) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="container-wide relative py-16 md:py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            {/* Left: Member Info */}
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-gold-glow"
              >
                <span className="text-3xl lg:text-4xl font-serif text-white">
                  {status.account.firstName?.[0] || status.account.email[0].toUpperCase()}
                </span>
              </motion.div>

              <div>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-micro tracking-[0.3em] font-medium text-gold/80 uppercase mb-1"
                >
                  Atlas Passport
                </motion.p>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-serif text-2xl lg:text-3xl text-white"
                >
                  {status.account.firstName
                    ? `${status.account.firstName} ${status.account.lastName || ""}`
                    : "Welcome, Traveler"}
                </motion.h1>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 mt-3"
                >
                  <StampRowCompact earnedStamps={status.stamps} maxVisible={5} />
                  <span className="text-micro text-stone-500">{status.stamps.length} stamps</span>
                </motion.div>
              </div>
            </div>

            {/* Right: Stats + CTA */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              {/* Miles Balance */}
              <div className="flex items-center gap-6 p-5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div>
                  <p className="text-micro text-stone-400 uppercase tracking-wider mb-1">Available Miles</p>
                  <p className="text-4xl font-serif text-white">
                    {status.account.availableMiles.toLocaleString()}
                  </p>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <p className="text-micro text-stone-400 uppercase tracking-wider mb-1">Lifetime</p>
                  <p className="text-2xl font-serif text-stone-300">
                    {status.account.lifetimeMiles.toLocaleString()}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setIsRewardsOpen(true)}
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-gold to-amber-500 hover:from-gold-600 hover:to-amber-600 text-stone-950 shadow-gold-glow"
              >
                <Gift className="w-5 h-5 mr-2" aria-hidden="true" />
                Redeem Rewards
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-stone-100 sticky top-20 z-40">
        <div className="container-wide">
          <nav className="flex gap-1" aria-label="Passport sections">
            {[
              { id: "overview", label: "Overview", icon: Plane },
              { id: "stamps", label: "Passport Stamps", icon: Target },
              { id: "quests", label: "Quests", icon: Trophy },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "px-5 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-all duration-300",
                  activeTab === tab.id
                    ? "border-gold text-gold"
                    : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-200"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide py-12">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Tier Progress - Full Width Card */}
              <div className="lg:col-span-2">
                <TierProgressBar
                  variant="card"
                  currentTier={status.tier}
                  nextTier={status.nextTier}
                  lifetimeMiles={status.account.lifetimeMiles}
                  stampCount={status.account.stampCount}
                />
              </div>

              {/* Referral Card */}
              <div className="relative overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 via-gold/10 to-amber-50/50 p-6">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-gold/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-stone-900">Send a Postcard</h3>
                      <p className="text-micro text-stone-500">Earn 1,000 miles per referral</p>
                    </div>
                  </div>

                  <div className="mt-5 p-4 bg-white rounded-lg border border-gold/20 shadow-luxury-sm">
                    <p className="text-micro text-stone-400 uppercase tracking-wider mb-1">Your Referral Code</p>
                    <p className="font-mono text-xl text-stone-900 tracking-wider">
                      {status.account.referralCode}
                    </p>
                  </div>

                  <Button 
                    onClick={copyReferralLink}
                    variant="outline" 
                    className="w-full mt-4 border-gold/50 text-gold hover:bg-gold hover:text-white transition-all duration-300"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Referral Link
                      </>
                    )}
                  </Button>

                  <p className="text-micro text-stone-500 mt-4 text-center">
                    Earn 1,000 miles for each successful referral
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-stone-100 shadow-luxury-sm">
                <h3 className="text-micro tracking-[0.2em] font-medium text-stone-400 uppercase mb-6 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Activity
                </h3>
                
                {status.recentTransactions.length > 0 ? (
                  <div className="space-y-1">
                    {status.recentTransactions.slice(0, 5).map((tx, i) => (
                      <motion.div 
                        key={tx.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              tx.milesAmount > 0 
                                ? "bg-gradient-to-br from-green-100 to-green-50" 
                                : "bg-stone-100"
                            )}
                          >
                            <span className={cn(
                              "text-lg",
                              tx.milesAmount > 0 ? "text-green-600" : "text-stone-400"
                            )}>
                              {tx.milesAmount > 0 ? "+" : "−"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-stone-900">{tx.description}</p>
                            <p className="text-micro text-stone-400">
                              {new Date(tx.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "font-mono font-medium text-lg",
                            tx.milesAmount > 0 ? "text-green-600" : "text-stone-500"
                          )}
                        >
                          {tx.milesAmount > 0 ? "+" : ""}
                          {tx.milesAmount.toLocaleString()}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Sparkles className="w-10 h-10 text-stone-200 mx-auto mb-3" />
                    <p className="text-stone-500">No activity yet. Start your journey!</p>
                  </div>
                )}
              </div>

              {/* Active Quests Preview */}
              <div className="bg-white rounded-xl p-6 border border-stone-100 shadow-luxury-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-micro tracking-[0.2em] font-medium text-stone-400 uppercase flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Active Quests
                  </h3>
                  <button
                    onClick={() => setActiveTab("quests")}
                    className="text-micro text-gold hover:text-gold-600 flex items-center gap-1 uppercase tracking-wider"
                  >
                    View All <ChevronRight className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {status.activeQuests.slice(0, 3).map((qp) => (
                    <QuestProgressCard key={qp.id} progress={qp} />
                  ))}
                  {status.activeQuests.length === 0 && (
                    <div className="text-center py-6">
                      <Trophy className="w-8 h-8 text-stone-200 mx-auto mb-2" />
                      <p className="text-sm text-stone-500">
                        All quests completed!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "stamps" && (
            <motion.div
              key="stamps"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StampGrid 
                variant="passport"
                earnedStamps={status.stamps} 
                allDestinations={allDestinations} 
              />
            </motion.div>
          )}

          {activeTab === "quests" && (
            <motion.div
              key="quests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="font-serif text-display mb-4">Your Quests</h2>
                <p className="text-editorial max-w-lg mx-auto">
                  Complete quests to earn bonus miles and unlock exclusive rewards
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {status.activeQuests.map((qp, i) => (
                  <motion.div
                    key={qp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <QuestCard progress={qp} />
                  </motion.div>
                ))}
              </div>

              {status.activeQuests.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-stone-100">
                  <Trophy className="w-14 h-14 text-gold mx-auto mb-4" />
                  <h3 className="font-serif text-xl text-stone-900 mb-2">All Quests Complete!</h3>
                  <p className="text-stone-500">Check back soon for new adventures.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rewards Drawer */}
      <RewardsDrawer
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
        availableMiles={status.account.availableMiles}
        currentTier={status.account.currentTierId}
        rewards={status.availableRewards}
        pendingRedemptions={status.pendingRedemptions}
        onRedeem={onRedeemReward}
      />
    </div>
  );
}

function QuestProgressCard({ progress }: { progress: QuestProgress & { quest: Quest } }) {
  const percent = Math.min(100, (progress.currentCount / progress.quest.requirementCount) * 100);

  return (
    <div className="group p-4 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-stone-900 group-hover:text-gold transition-colors">
          {progress.quest.name}
        </p>
        <span className="text-sm font-mono text-gold">+{progress.quest.milesReward}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            className="h-full bg-gradient-to-r from-gold to-amber-500 rounded-full"
          />
        </div>
        <span className="text-micro text-stone-500 font-mono">
          {progress.currentCount}/{progress.quest.requirementCount}
        </span>
      </div>
    </div>
  );
}

function QuestCard({ progress }: { progress: QuestProgress & { quest: Quest } }) {
  const percent = Math.min(100, (progress.currentCount / progress.quest.requirementCount) * 100);
  const isComplete = progress.completed;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-6 transition-all duration-300",
        isComplete
          ? "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
          : "bg-white border border-stone-100 shadow-luxury-sm hover:shadow-luxury"
      )}
    >
      {/* Decorative background */}
      {isComplete && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-green-200/30 to-transparent rounded-full blur-2xl" />
      )}

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {isComplete ? (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
                <CheckCircle className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                <Target className="w-6 h-6 text-gold" aria-hidden="true" />
              </div>
            )}
            <div>
              <h4 className="font-medium text-stone-900">{progress.quest.name}</h4>
              <p className="text-sm text-stone-500 mt-0.5">{progress.quest.description}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-serif text-gold">+{progress.quest.milesReward}</span>
            <p className="text-micro text-stone-400 uppercase">miles</p>
          </div>
        </div>

        {!isComplete && (
          <div className="mt-5 pt-5 border-t border-stone-100">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-stone-500">Progress</span>
              <span className="font-mono font-medium text-stone-700">
                {progress.currentCount} / {progress.quest.requirementCount}
              </span>
            </div>
            <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-gold to-amber-500 rounded-full"
              />
            </div>
          </div>
        )}

        {isComplete && progress.completedAt && (
          <div className="mt-4 pt-4 border-t border-green-200/50">
            <p className="text-sm text-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" aria-hidden="true" />
              Completed {new Date(progress.completedAt).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric' 
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
