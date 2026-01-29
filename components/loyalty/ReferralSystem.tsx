'use client';

// LOCRA Atlas Loyalty - Referral System Components
// =====================================================
// Premium sharing and referral components

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Share2, Gift, Users, ChevronRight, X, Mail, Plane, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// =====================================================
// REFERRAL SHARE CARD - Premium version
// =====================================================
interface ReferralShareCardProps {
  referralCode: string;
  referralUrl?: string;
  successfulReferrals?: number;
  pendingReferrals?: number;
  className?: string;
}

export function ReferralShareCard({
  referralCode,
  referralUrl,
  successfulReferrals = 0,
  pendingReferrals = 0,
  className,
}: ReferralShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const fullUrl = referralUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/ref/${referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareVia = (platform: 'twitter' | 'facebook' | 'email' | 'whatsapp') => {
    const message = "Join me on LOCRA Travel Club! Use my referral code to get 500 bonus miles on your first purchase.";
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(fullUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      email: `mailto:?subject=${encodeURIComponent('Join LOCRA Travel Club')}&body=${encodeURIComponent(`${message}\n\n${fullUrl}`)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${message} ${fullUrl}`)}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl",
      "bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950",
      className
    )}>
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-gold/15 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-3xl translate-y-1/2" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(196,160,82,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      
      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-gold-glow">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-micro uppercase tracking-[0.25em] text-gold mb-1">Send A Postcard</p>
            <h3 className="font-serif text-2xl text-white">Invite Friends</h3>
            <p className="text-sm text-stone-400 mt-1">Share your code, earn 1,000 miles each</p>
          </div>
        </div>

        {/* Referral Code Display */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 mb-6 border border-white/10">
          <p className="text-micro uppercase tracking-[0.25em] text-stone-400 mb-3">Your Referral Code</p>
          <div className="flex items-center gap-4">
            <code className="flex-1 font-mono text-3xl tracking-[0.15em] text-gold">{referralCode}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="w-12 h-12 text-white hover:bg-white/10 rounded-xl"
            >
              {copied ? <Check className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 text-center border border-white/10">
            <p className="text-3xl font-serif text-gold">{successfulReferrals}</p>
            <p className="text-micro text-stone-400 uppercase tracking-wider mt-1">Successful</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 text-center border border-white/10">
            <p className="text-3xl font-serif text-amber-400">{pendingReferrals}</p>
            <p className="text-micro text-stone-400 uppercase tracking-wider mt-1">Pending</p>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="relative flex gap-3">
          <Button
            onClick={copyToClipboard}
            size="lg"
            className="flex-1 h-12 bg-gradient-to-r from-gold to-amber-500 hover:from-gold-600 hover:to-amber-600 text-stone-950"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                Copy Link
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-12 h-12 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
            onClick={() => setShowShareMenu(!showShareMenu)}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Share Menu Dropdown */}
        <AnimatePresence>
          {showShareMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-28 right-8 bg-white rounded-xl shadow-luxury-xl p-2 min-w-[180px] border border-stone-100"
            >
              {['twitter', 'facebook', 'whatsapp', 'email'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => shareVia(platform as 'twitter' | 'facebook' | 'email' | 'whatsapp')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                >
                  {platform === 'email' && <Mail className="w-4 h-4 text-stone-400" />}
                  {platform === 'twitter' && 'Share on X'}
                  {platform === 'facebook' && 'Share on Facebook'}
                  {platform === 'whatsapp' && 'Share on WhatsApp'}
                  {platform === 'email' && 'Send via Email'}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reward Info */}
        <div className="mt-6 p-5 bg-gold/10 rounded-xl border border-gold/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="font-medium text-white">How it works</p>
              <p className="text-sm text-stone-400 mt-1">
                When a friend signs up with your code and makes their first purchase, you both earn bonus miles!
              </p>
              <div className="mt-3 flex items-center gap-6">
                <div>
                  <span className="text-lg font-serif text-gold">1,000</span>
                  <span className="text-micro text-stone-400 ml-1.5 uppercase">You get</span>
                </div>
                <div>
                  <span className="text-lg font-serif text-gold">500</span>
                  <span className="text-micro text-stone-400 ml-1.5 uppercase">They get</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// REFERRAL CLAIM FORM
// =====================================================
interface ReferralClaimFormProps {
  onClaim?: (code: string) => Promise<{ success: boolean; error?: string }>;
  className?: string;
}

export function ReferralClaimForm({ onClaim, className }: ReferralClaimFormProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !onClaim) return;

    setStatus('loading');
    setError(null);

    try {
      const result = await onClaim(code.trim().toUpperCase());
      if (result.success) {
        setStatus('success');
        setCode('');
      } else {
        setStatus('error');
        setError(result.error || 'Invalid referral code');
      }
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center",
          className
        )}
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Check className="w-7 h-7 text-white" />
        </div>
        <p className="font-serif text-xl text-green-800">Referral Applied!</p>
        <p className="text-sm text-green-600 mt-2">
          You&apos;ll receive <span className="font-semibold">500 bonus miles</span> after your first purchase.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div>
        <label htmlFor="referral-code" className="block text-sm font-medium text-stone-700 mb-2">
          Have a referral code?
        </label>
        <div className="flex gap-3">
          <Input
            id="referral-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="flex-1 font-mono uppercase tracking-widest text-lg h-12 border-stone-200 focus:border-gold focus:ring-gold"
            disabled={status === 'loading'}
          />
          <Button 
            type="submit" 
            disabled={status === 'loading' || !code.trim()}
            className="h-12 px-6 bg-gradient-to-r from-gold to-amber-500 hover:from-gold-600 hover:to-amber-600 text-stone-950"
          >
            {status === 'loading' ? 'Applying...' : 'Apply'}
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-2 flex items-center gap-1.5">
            <X className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

// =====================================================
// REFERRAL BANNER (for new visitors)
// =====================================================
interface ReferralBannerProps {
  referrerName?: string;
  bonusMiles?: number;
  onDismiss?: () => void;
  className?: string;
}

export function ReferralBanner({
  referrerName = 'a friend',
  bonusMiles = 500,
  onDismiss,
  className,
}: ReferralBannerProps) {
  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "bg-gradient-to-r from-gold/10 via-amber-50 to-gold/10 border-b border-gold/20",
        className
      )}
    >
      <div className="container-wide py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="font-medium text-stone-800">
              Welcome! You&apos;ve been referred by {referrerName}
            </p>
            <p className="text-sm text-stone-600">
              Get <span className="font-bold text-gold">{bonusMiles} bonus miles</span> on your first purchase!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="champagne" size="sm">
            <Link href="/products" className="flex items-center gap-2">
              Shop Now <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// =====================================================
// COMPACT REFERRAL WIDGET (for passport page sidebar)
// =====================================================
export function ReferralWidgetCompact({
  referralCode,
  onClick,
}: {
  referralCode: string;
  onClick?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-5 bg-gradient-to-r from-stone-900 via-stone-900 to-stone-800 rounded-xl text-left group hover:from-stone-800 hover:to-stone-700 transition-all duration-300 border border-stone-700/50"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
        <Plane className="w-6 h-6 text-gold" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white">Invite Friends</p>
        <p className="text-sm text-stone-400">Earn 1,000 miles per referral</p>
      </div>
      <div className="flex items-center gap-2">
        <code className="px-3 py-1.5 bg-white/5 rounded-lg text-sm font-mono text-gold border border-white/10">
          {referralCode}
        </code>
        <button
          onClick={handleCopy}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
        </button>
      </div>
    </button>
  );
}
