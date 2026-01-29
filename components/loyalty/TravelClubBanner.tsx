'use client';

// LOCRA Atlas - Travel Club Promotional Banner
// =====================================================
// Premium variants for homepage and product pages

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plane, Gift, Map, ArrowRight, Sparkles, Star, Crown, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SparklesCore } from '@/components/ui/sparkles';
import { cn } from '@/lib/utils';

interface TravelClubBannerProps {
  variant?: 'hero' | 'inline' | 'card' | 'minimal';
  className?: string;
}

export function TravelClubBanner({ variant = 'inline', className }: TravelClubBannerProps) {
  if (variant === 'hero') {
    return (
      <section className={cn("relative py-32 md:py-40 overflow-hidden", className)}>
        {/* Cinematic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950" />
        
        {/* Sparkles Background */}
        <div className="absolute inset-0">
          <SparklesCore
            id="travel-club-sparkles"
            background="transparent"
            minSize={0.4}
            maxSize={1.2}
            particleDensity={40}
            className="w-full h-full"
            particleColor="#C4A052"
          />
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gold ambient glow */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-gold/15 via-gold/5 to-transparent rounded-full blur-3xl"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="container-wide relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className="w-8 h-px bg-gold/40" />
              <p className="text-micro tracking-[0.4em] uppercase text-gold">
                Atlas Travel Club
              </p>
              <span className="w-8 h-px bg-gold/40" />
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-display md:text-display-lg text-white mb-8 leading-tight"
            >
              Every Purchase is{' '}
              <br className="hidden sm:block" />
              <span className="italic text-champagne">a Destination</span>
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-body-lg text-stone-400 max-w-2xl mx-auto mb-14 leading-relaxed"
            >
              Earn miles with every artifact. Collect passport stamps from destinations around the world. 
              Unlock exclusive rewards and experiences reserved for travelers.
            </motion.p>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
              {[
                { icon: Plane, title: 'Earn Miles', desc: '1 mile for every $1 spent', highlight: 'Up to 2× with tier bonuses' },
                { icon: Map, title: 'Collect Stamps', desc: 'Build your passport', highlight: 'Unlock tiers with stamps' },
                { icon: Crown, title: 'Unlock Rewards', desc: 'Credits, early access & more', highlight: 'Exclusive member perks' },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-gold/30 transition-all duration-500"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                      <feature.icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="font-serif text-xl text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-stone-400 mb-3">{feature.desc}</p>
                    <p className="text-micro text-gold/70 uppercase tracking-wider">{feature.highlight}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Button
                asChild
                size="xl"
                className="min-w-[220px] h-14 bg-gradient-to-r from-gold to-amber-500 hover:from-gold-600 hover:to-amber-600 text-stone-950 rounded-sm shadow-gold-glow"
              >
                <Link href="/travel-club" className="flex items-center gap-3">
                  Join the Travel Club
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Link
                href="/passport"
                className="text-sm text-stone-500 hover:text-white transition-colors duration-300 flex items-center gap-2"
              >
                Already a member? 
                <span className="text-gold underline underline-offset-4">View Passport</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-stone-700/50",
          "bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800",
          className
        )}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-radial from-gold/15 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        
        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Compass className="w-7 h-7 text-gold" />
            </div>
            <div>
              <p className="text-micro tracking-[0.25em] uppercase text-gold/80 mb-1">Atlas Travel Club</p>
              <h3 className="font-serif text-2xl text-white">Start Your Journey</h3>
            </div>
          </div>
          
          {/* Benefits */}
          <ul className="space-y-4 mb-8">
            {[
              { icon: Star, text: 'Earn 1 mile for every $1 spent' },
              { icon: Map, text: 'Collect passport stamps from each destination' },
              { icon: Gift, text: 'Redeem for credits, early access & exclusive perks' },
            ].map((benefit, i) => (
              <li key={i} className="flex items-center gap-3 text-stone-300">
                <benefit.icon className="w-4 h-4 text-gold shrink-0" />
                <span className="text-sm">{benefit.text}</span>
              </li>
            ))}
          </ul>

          <Button
            asChild
            className="w-full h-12 bg-gradient-to-r from-gold to-amber-500 hover:from-gold-600 hover:to-amber-600 text-stone-950 rounded-sm"
          >
            <Link href="/travel-club" className="flex items-center justify-center gap-2">
              Learn More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  if (variant === 'minimal') {
    return (
      <Link 
        href="/travel-club"
        className={cn(
          "group flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
          "hover:bg-gold/5",
          className
        )}
      >
        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Sparkles className="w-4 h-4 text-gold" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-stone-700 group-hover:text-gold transition-colors">Join Atlas Travel Club</p>
          <p className="text-xs text-stone-400">Earn miles on every purchase</p>
        </div>
        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-gold group-hover:translate-x-1 transition-all" />
      </Link>
    );
  }

  // Default: inline banner
  return (
    <div className={cn(
      "flex items-center justify-between p-5 rounded-xl",
      "bg-gradient-to-r from-stone-900 via-stone-900 to-stone-800",
      "border border-stone-700/50",
      className
    )}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
          <Plane className="w-6 h-6 text-gold" />
        </div>
        <div>
          <p className="font-medium text-white">Join the Atlas Travel Club</p>
          <p className="text-sm text-stone-400">Earn miles and unlock exclusive rewards</p>
        </div>
      </div>
      <Button asChild variant="champagne" size="sm">
        <Link href="/travel-club" className="flex items-center gap-2">
          Explore
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Button>
    </div>
  );
}

// Product page banner showing miles to be earned
export function ProductMilesBanner({
  price,
  destinationName,
  className,
}: {
  price: number; // in cents
  destinationName?: string;
  className?: string;
}) {
  const milesToEarn = Math.floor(price / 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl",
        "bg-gradient-to-r from-gold/5 via-amber-50/50 to-gold/5",
        "border border-gold/20",
        className
      )}
    >
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center shrink-0">
        <Plane className="w-5 h-5 text-gold" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-stone-700">
          Earn <span className="font-semibold text-gold">{milesToEarn} miles</span> with this purchase
        </p>
        {destinationName && (
          <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
            <Map className="w-3 h-3" />
            + {destinationName} passport stamp
          </p>
        )}
      </div>
      <Link
        href="/travel-club"
        className="text-micro text-gold hover:text-gold-600 uppercase tracking-wider font-medium shrink-0"
      >
        Learn more
      </Link>
    </motion.div>
  );
}

// Cart drawer loyalty prompt
export function CartLoyaltyBanner({
  cartTotal,
  isLoggedIn = false,
  className,
}: {
  cartTotal: number; // in cents
  isLoggedIn?: boolean;
  className?: string;
}) {
  const milesToEarn = Math.floor(cartTotal / 100);

  if (isLoggedIn) {
    return (
      <div className={cn(
        "p-4 rounded-xl bg-gradient-to-r from-gold/10 to-amber-50/50 border border-gold/20",
        className
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-800">
              You&apos;ll earn <span className="text-gold">{milesToEarn} miles</span>
            </p>
            <p className="text-xs text-stone-500">on this order</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 rounded-xl bg-stone-50 border border-stone-100",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
          <Gift className="w-5 h-5 text-gold" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-stone-800 mb-1">
            Join Travel Club & earn {milesToEarn} miles
          </p>
          <p className="text-xs text-stone-500 mb-3">
            Plus unlock exclusive rewards, early access, and more.
          </p>
          <Link
            href="/travel-club"
            className="text-micro text-gold hover:text-gold-600 uppercase tracking-wider font-medium"
          >
            Learn More →
          </Link>
        </div>
      </div>
    </div>
  );
}
