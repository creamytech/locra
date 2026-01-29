"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlipWords } from "@/components/ui/flip-words";
import { SparklesCore } from "@/components/ui/sparkles";
import { TravelClubSignup } from "@/components/portal/TravelClubSignup";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Plane, Gift, Map, Crown, Target, Users, ArrowRight, Check, 
  Sparkles, Globe, Compass, Award, ChevronDown 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Animation variants for better performance and sequencing
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const tiers = [
  {
    name: "Initiate",
    miles: "0",
    perks: ["1 mile per $1 spent", "Access to basic rewards", "Birthday bonus miles"],
    gradient: "from-stone-400 to-stone-500",
    icon: Sparkles,
  },
  {
    name: "Voyager",
    miles: "1,000",
    perks: ["1.25x miles earning", "Early access (24h)", "Free shipping over $150", "Exclusive quests"],
    gradient: "from-sky-400 to-blue-500",
    icon: Globe,
  },
  {
    name: "Collector",
    miles: "5,000",
    perks: ["1.5x miles earning", "Early access (48h)", "Free shipping over $100", "Priority support"],
    gradient: "from-amber-400 to-orange-500",
    icon: Award,
  },
  {
    name: "Laureate",
    miles: "15,000",
    perks: ["2x miles earning", "72h early access", "Always free shipping", "VIP experiences", "Exclusive drops"],
    gradient: "from-gold to-amber-500",
    icon: Crown,
    isTop: true,
  },
];

const benefits = [
  { icon: Plane, title: "Earn Miles", description: "Earn 1 mile for every $1 spent. Higher tiers earn up to 2x.", stat: "1:1", statLabel: "Base Rate" },
  { icon: Map, title: "Collect Stamps", description: "Each destination adds a unique stamp to your passport.", stat: "12+", statLabel: "Destinations" },
  { icon: Gift, title: "Redeem Rewards", description: "Use miles for credits, shipping, early access, and more.", stat: "∞", statLabel: "Possibilities" },
  { icon: Target, title: "Complete Quests", description: "Earn bonus miles by completing special challenges.", stat: "10+", statLabel: "Active Quests" },
  { icon: Users, title: "Refer Friends", description: "Share your code and earn 1,000 miles per referral.", stat: "1K", statLabel: "Miles Per Referral" },
  { icon: Crown, title: "Tier Upgrades", description: "Progress through tiers for better multipliers.", stat: "4", statLabel: "Traveler Ranks" },
];

const rewards = [
  { name: "$10 Atlas Credit", miles: 1000, icon: "💳" },
  { name: "$25 Atlas Credit", miles: 2500, icon: "💰" },
  { name: "Free Shipping", miles: 500, icon: "📦" },
  { name: "Early Access Pass", miles: 750, icon: "🎫" },
  { name: "$50 Atlas Credit", miles: 5000, icon: "💎" },
  { name: "Monogram Credit", miles: 3000, icon: "✨" },
];

const heroWords = ["Destination", "Journey", "Adventure", "Experience"];

export default function TravelClubClient() {
  return (
    <div className="flex flex-col bg-background">
      {/* ========================================
          HERO SECTION - With Sparkles & FlipWords
          ======================================== */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-stone-950">
        {/* Sparkles Background */}
        <div className="absolute inset-0">
          <SparklesCore
            id="travel-club-hero-sparkles"
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={50}
            className="w-full h-full"
            particleColor="#C4A052"
          />
        </div>
        
        {/* Static gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/30" />
        </div>
        
        <div className="container-wide relative z-10 text-center text-white py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp}>
              <Badge variant="gold" className="px-5 py-1.5">
                <Compass className="w-3.5 h-3.5 mr-2" />
                Atlas Loyalty Program
              </Badge>
            </motion.div>
            
            {/* Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1]"
            >
              Every Purchase
              <br />
              <span className="italic text-champagne">is a Destination</span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-stone-300 font-light max-w-2xl mx-auto leading-relaxed"
            >
              Join the Atlas Travel Club and transform every purchase into passport stamps, 
              miles, and exclusive rewards from destinations around the world.
            </motion.p>
            
            {/* Stats */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-3 gap-8 max-w-xl mx-auto pt-6"
            >
              {[
                { value: "1:1", label: "Miles per Dollar" },
                { value: "4", label: "Traveler Tiers" },
                { value: "∞", label: "Destinations" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl md:text-5xl font-serif text-gold">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mt-2">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
            >
              <Button asChild size="xl" variant="champagne" className="min-w-[200px] h-14">
                <Link href="/passport" className="flex items-center gap-2">
                  View Your Passport
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="xl" 
                className="min-w-[200px] h-14 border-white/30 text-white hover:bg-white/10"
              >
                <Link href="#how-it-works">How It Works</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] text-stone-500 uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 text-gold" />
        </div>
      </section>

      {/* ========================================
          HOW IT WORKS
          ======================================== */}
      <section id="how-it-works" className="py-24 md:py-32 bg-stone-50">
        <div className="container-wide">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-[10px] tracking-[0.4em] font-medium text-gold uppercase mb-4 block">
              The Journey
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
              Your Path to <span className="italic">Laureate</span>
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto">
              Discover how to maximize your journey through the Atlas Travel Club
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {benefits.map((benefit) => (
              <motion.div key={benefit.title} variants={fadeInUp}>
                <Card className="h-full group hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                        <benefit.icon className="w-6 h-6 text-gold" />
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-serif text-gold">{benefit.stat}</p>
                        <p className="text-[10px] text-stone-400 uppercase">{benefit.statLabel}</p>
                      </div>
                    </div>
                    <CardTitle className="mt-4 group-hover:text-gold transition-colors">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-stone-500">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================================
          TIER PROGRESSION
          ======================================== */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container-wide">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-[10px] tracking-[0.4em] font-medium text-gold uppercase mb-4 block">
              Traveler Ranks
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
              Rise Through the <span className="italic">Atlas</span>
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto">
              Progress through tiers by accumulating lifetime miles. Each tier unlocks better earning rates.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {tiers.map((tier) => {
              const TierIcon = tier.icon;
              
              return (
                <motion.div key={tier.name} variants={fadeInUp}>
                  <Card className={cn(
                    "h-full relative group transition-all duration-300",
                    tier.isTop 
                      ? "bg-stone-900 border-gold/30 shadow-lg" 
                      : "hover:shadow-lg"
                  )}>
                    {tier.isTop && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-stone-950 text-[10px] font-bold uppercase tracking-wider rounded-full">
                        ✦ Top Tier ✦
                      </div>
                    )}
                    
                    <CardHeader className="pt-8">
                      <div className={cn(
                        "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4",
                        tier.gradient
                      )}>
                        <TierIcon className="w-7 h-7" />
                      </div>
                      <CardTitle className={tier.isTop ? "text-white" : ""}>
                        {tier.name}
                      </CardTitle>
                      <CardDescription className={tier.isTop ? "text-stone-400" : ""}>
                        {tier.miles}+ lifetime miles
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <ul className="space-y-2.5">
                        {tier.perks.map((perk) => (
                          <li key={perk} className={cn(
                            "flex items-start gap-2 text-sm",
                            tier.isTop ? "text-stone-300" : "text-stone-600"
                          )}>
                            <Check className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ========================================
          REWARDS CATALOG
          ======================================== */}
      <section className="py-24 md:py-32 bg-stone-50">
        <div className="container-wide">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-[10px] tracking-[0.4em] font-medium text-gold uppercase mb-4 block">
              Rewards Catalog
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
              Redeem Your <span className="italic">Miles</span>
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto">
              Convert your earned miles into credits, shipping perks, early access, and more.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {rewards.map((reward) => (
              <motion.div 
                key={reward.name} 
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow cursor-default">
                  <CardContent className="pt-6">
                    <span className="text-4xl block mb-4">{reward.icon}</span>
                    <p className="font-medium text-stone-900 text-sm mb-2">{reward.name}</p>
                    <p className="text-lg font-serif text-gold">{reward.miles.toLocaleString()}</p>
                    <p className="text-[10px] text-stone-400 uppercase">miles</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button asChild variant="outline" size="lg">
              <Link href="/passport" className="flex items-center gap-2">
                View All Rewards
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          FINAL CTA
          ======================================== */}
      <section className="py-32 md:py-40 relative overflow-hidden bg-stone-950">
        {/* Simple gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/15 rounded-full blur-[120px]" />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(196,160,82,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        
        <div className="container-narrow relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center">
              <Compass className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight text-white">
              Begin Your
              <br />
              <span className="italic text-champagne">Journey</span>
            </h2>
            
            <p className="text-lg text-stone-400 max-w-lg mx-auto mb-12 font-light">
              Join the Atlas Travel Club today. Start earning miles with your first purchase.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="xl" variant="champagne" className="min-w-[200px] h-14">
                <Link href="/products" className="flex items-center gap-2">
                  Shop & Start Earning
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="xl" 
                className="min-w-[180px] h-14 border-white/30 text-white hover:bg-white/10"
              >
                <Link href="/passport">View Passport</Link>
              </Button>
            </div>
            
            <p className="text-[10px] text-stone-500 mt-10 uppercase tracking-widest">
              Membership is automatic · Miles never expire when active
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          EMAIL SIGNUP
          ======================================== */}
      <section className="py-20 bg-stone-50">
        <div className="container-narrow">
          <TravelClubSignup />
        </div>
      </section>
    </div>
  );
}
