'use client';

// LOCRA Atlas - Travel Club Passport Dashboard
// =====================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoyalty } from '@/hooks/useLoyalty';
import { useAuth } from '@/components/auth';
import {
  TierProgressBar,
  StampGrid,
  RewardsDrawer,
  MilesEarnedToast,
  TierUpgradeModal,
} from '@/components/loyalty';
import { Plane, Map, Gift, Compass, BookOpen, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PassportDashboard() {
  // Get customer from auth context
  const { customer, isAuthenticated, isLoading: authLoading, login } = useAuth();
  
  // Extract customer data from the authenticated customer
  const shopifyCustomerId = customer?.id;
  // Email is nested in emailAddress.emailAddress
  const customerEmail = customer?.emailAddress?.emailAddress;
  const customerFirstName = customer?.firstName ?? undefined;
  const customerLastName = customer?.lastName ?? undefined;
  
  const { status, loading, error, redeemReward, refetch, enrolling } = useLoyalty({
    shopifyCustomerId,
    email: customerEmail,
    firstName: customerFirstName,
    lastName: customerLastName,
    autoFetch: !!shopifyCustomerId,
    autoEnroll: true, // Auto-enroll new customers
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'stamps' | 'quests'>('overview');
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [showMilesToast, setShowMilesToast] = useState(false);
  const [showTierUpgrade, setShowTierUpgrade] = useState(false);
  const [toastMiles, setToastMiles] = useState(0);

  // Demo: Show toast on first load if there are recent miles
  useEffect(() => {
    if (status?.recentTransactions?.[0]?.milesAmount) {
      const recentMiles = status.recentTransactions[0].milesAmount;
      if (recentMiles > 0) {
        setToastMiles(recentMiles);
        setShowMilesToast(true);
        setTimeout(() => setShowMilesToast(false), 5000);
      }
    }
  }, [status?.recentTransactions]);

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-12 h-12 text-gold animate-spin" />
          <p className="text-stone-500 font-serif italic">Checking your passport...</p>
        </motion.div>
      </div>
    );
  }

  // Not authenticated - show sign in prompt
  if (!isAuthenticated || !customer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-6">
        <Map className="w-16 h-16 text-stone-300 mb-4" />
        <h2 className="text-2xl font-serif text-stone-800 mb-2">Join the Travel Club</h2>
        <p className="text-stone-500 text-center max-w-md mb-6">
          Sign in or create an account to start earning miles and collecting passport stamps from destinations around the world.
        </p>
        <button 
          onClick={() => login('/passport')}
          className="px-8 py-3 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-colors"
        >
          Sign In to Continue
        </button>
      </div>
    );
  }

  // Loyalty data loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Compass className="w-12 h-12 text-stone-400 animate-spin" />
          <p className="text-stone-500 font-serif italic">Preparing your passport...</p>
        </motion.div>
      </div>
    );
  }

  // No loyalty status yet (new customer)
  if (error || !status) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-6">
        <Plane className="w-16 h-16 text-gold mb-4" />
        <h2 className="text-2xl font-serif text-stone-800 mb-2">Welcome, {customer.firstName || 'Traveler'}!</h2>
        <p className="text-stone-500 text-center max-w-md mb-6">
          Your passport is being prepared. Start shopping to earn your first miles and collect stamps from destinations around the world.
        </p>
        <Link 
          href="/shop"
          className="px-8 py-3 bg-gold text-stone-900 rounded-full font-medium hover:bg-gold/90 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const { account, tier, nextTier, progressToNextTier, stamps, activeQuests, availableRewards, pendingRedemptions } = status;

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Compass },
    { id: 'stamps' as const, label: 'Stamps', icon: Map },
    { id: 'quests' as const, label: 'Quests', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-stone-800 via-stone-900 to-black py-12 px-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="text-amber-400/80 uppercase tracking-[0.25em] text-xs mb-2">
              Atlas Travel Club
            </p>
            <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">
              {account.firstName ? `Welcome back, ${account.firstName}` : 'Your Passport'}
            </h1>
            <p className="text-stone-400">
              {tier.displayName} Member · {account.stampCount} Destination{account.stampCount !== 1 ? 's' : ''} Explored
            </p>
          </motion.div>

          {/* Tier Progress */}
          <TierProgressBar
            currentTier={tier}
            nextTier={nextTier}
            lifetimeMiles={account.lifetimeMiles}
            stampCount={account.stampCount}
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center cursor-pointer"
              onClick={() => setRewardsOpen(true)}
            >
              <Gift className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-serif text-white">{account.availableMiles.toLocaleString()}</p>
              <p className="text-xs text-stone-400">Miles Available</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center cursor-pointer"
              onClick={() => setActiveTab('stamps')}
            >
              <Map className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-serif text-white">{stamps.length}</p>
              <p className="text-xs text-stone-400">Stamps Collected</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center cursor-pointer"
            >
              <Users className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <p className="text-sm font-mono text-white">{account.referralCode}</p>
              <p className="text-xs text-stone-400">Your Referral Code</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-stone-200 z-10">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-stone-800 text-stone-900'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Recent Activity */}
              <section>
                <h2 className="text-lg font-serif text-stone-800 mb-4">Recent Journey</h2>
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                  {status.recentTransactions.length > 0 ? (
                    <div className="divide-y divide-stone-100">
                      {status.recentTransactions.slice(0, 5).map((tx) => (
                        <div key={tx.id} className="p-4 flex justify-between items-center">
                          <div>
                            <p className="text-stone-800 font-medium">{tx.description}</p>
                            <p className="text-xs text-stone-400">
                              {new Date(tx.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <span className={`font-mono text-sm ${tx.milesAmount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {tx.milesAmount > 0 ? '+' : ''}{tx.milesAmount} mi
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Plane className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-500">Your journey begins with your first purchase</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Active Quests Preview */}
              {activeQuests.length > 0 && (
                <section>
                  <h2 className="text-lg font-serif text-stone-800 mb-4">Active Quests</h2>
                  <div className="grid gap-3">
                    {activeQuests.slice(0, 3).map((quest) => (
                      <div key={quest.questId} className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <Compass className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-stone-800">{quest.questId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2">
                            <div
                              className="bg-amber-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${Math.min(100, (quest.currentCount / 3) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-stone-400">{quest.currentCount}/3</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab('quests')}
                    className="mt-4 text-sm text-stone-500 hover:text-stone-700 underline underline-offset-2"
                  >
                    View all quests →
                  </button>
                </section>
              )}
            </motion.div>
          )}

          {activeTab === 'stamps' && (
            <motion.div
              key="stamps"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <StampGrid
                earnedStamps={stamps}
                allDestinations={[
                  {
                    id: 'santorini',
                    handle: 'santorini',
                    name: 'Santorini',
                    region: 'Cyclades',
                    stampEmoji: '🏛️',
                    stampColor: '#5B9BD5',
                    coordinates: '36.3932° N, 25.4615° E',
                    tagline: 'The Caldera\'s Silence',
                    active: true,
                  },
                  {
                    id: 'amalfi',
                    handle: 'amalfi',
                    name: 'Amalfi Coast',
                    region: 'Mediterranean',
                    stampEmoji: '🍋',
                    stampColor: '#FFD966',
                    coordinates: '40.6340° N, 14.6027° E',
                    tagline: 'Vertical Stone and Citrus',
                    active: true,
                  },
                  {
                    id: 'kyoto',
                    handle: 'kyoto',
                    name: 'Kyoto',
                    region: 'East Asia',
                    stampEmoji: '🎋',
                    stampColor: '#70AD47',
                    coordinates: '35.0116° N, 135.7681° E',
                    tagline: 'The Bamboo Path',
                    active: true,
                  },
                  {
                    id: 'marrakech',
                    handle: 'marrakech',
                    name: 'Marrakech',
                    region: 'North Africa',
                    stampEmoji: '🏜️',
                    stampColor: '#C65911',
                    coordinates: '31.6295° N, 7.9811° W',
                    tagline: 'Ochre Walls and Shadows',
                    active: true,
                  },
                ]}
              />
            </motion.div>
          )}

          {activeTab === 'quests' && (
            <motion.div
              key="quests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-serif text-stone-800 mb-4">Your Quests</h2>
              {activeQuests.length > 0 ? (
                <div className="grid gap-3">
                  {activeQuests.map((quest) => (
                    <div key={quest.questId} className="bg-white rounded-xl border border-stone-200 p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-stone-800">
                            {quest.questId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </h3>
                          <p className="text-sm text-stone-500 mt-1">
                            Progress: {quest.currentCount} / 3
                          </p>
                          <div className="w-full bg-stone-100 rounded-full h-2 mt-3">
                            <div
                              className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, (quest.currentCount / 3) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-amber-600">+100 mi</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
                  <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <h3 className="font-serif text-lg text-stone-700 mb-2">All quests completed!</h3>
                  <p className="text-stone-500">You&apos;ve completed all available quests. Check back for new adventures.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Rewards Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setRewardsOpen(true)}
        className="fixed bottom-6 right-6 bg-stone-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-20"
      >
        <Gift className="w-5 h-5" />
        <span className="font-medium">Rewards</span>
        {availableRewards.length > 0 && (
          <span className="bg-amber-500 text-xs px-2 py-0.5 rounded-full">
            {availableRewards.length}
          </span>
        )}
      </motion.button>

      {/* Rewards Drawer */}
      <RewardsDrawer
        isOpen={rewardsOpen}
        onClose={() => setRewardsOpen(false)}
        availableMiles={account.availableMiles}
        currentTier={tier.id}
        rewards={availableRewards}
        pendingRedemptions={pendingRedemptions}
        onRedeem={async (rewardId) => {
          const result = await redeemReward(rewardId);
          if (result.success) {
            await refetch();
          }
        }}
      />

      {/* Toast & Modals */}
      <AnimatePresence>
        {showMilesToast && (
          <MilesEarnedToast
            miles={toastMiles}
            message="Added to your passport"
            onClose={() => setShowMilesToast(false)}
          />
        )}
      </AnimatePresence>

      {showTierUpgrade && tier && (
        <TierUpgradeModal
          newTier={tier}
          onClose={() => setShowTierUpgrade(false)}
        />
      )}
    </div>
  );
}
