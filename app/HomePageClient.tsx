"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useId } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FlipWords } from "@/components/ui/flip-words";
import { HeroVideo } from "@/components/portal/HeroVideo";
import { TravelClubBanner } from "@/components/loyalty";
import { ProductExpandableCards } from "@/components/product/ProductExpandableCards";
import { DestinationCard } from "@/components/destination/DestinationCard";
import { DESTINATIONS } from "@/lib/data/atlas";
import { ArrowRight, Star, Heart, MapPin } from "lucide-react";
import type { Product } from "@/lib/shopify/types";

interface HomePageClientProps {
  featuredProducts: Product[];
}

export function HomePageClient({ featuredProducts }: HomePageClientProps) {
  const heroWords = ["Collection", "Wardrobe", "Style", "Capsule"];
  const pathname = usePathname();
  
  // Track if component has mounted to ensure animations run
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use a unique ID per pathname visit to force animation replay
  const animationKey = `home-${pathname}-${isMounted ? 'ready' : 'init'}`;

  return (
    <div className="flex flex-col" key={animationKey}>
      {/* ================================================
          1. CINEMATIC PORTAL HERO
          ================================================ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20">
        {/* Video Background */}
        <div className="absolute inset-0">
          <HeroVideo 
            src="https://5kynenqtmmcueqop.public.blob.vercel-storage.com/LocraHero.mp4" 
            className="w-full h-full"
          />
          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-900/40 to-stone-950/80" />
          {/* Vignette effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
        </div>

        {/* Content */}
        <div className="container-narrow relative z-10 text-center py-24 md:py-32">
          {/* Eyebrow */}
          <div 
            className="inline-flex items-center gap-4 mb-8 opacity-0 animate-[fade-in_0.8s_ease-out_0.2s_forwards]"
          >
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-gold/60" />
            <p className="text-micro font-medium tracking-[0.4em] text-gold/80 uppercase">
              Destination-Inspired Apparel
            </p>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          {/* Headline with Flip Words */}
          <h1 
            className="text-display-lg md:text-display-xl font-serif font-light text-white mb-8 opacity-0 animate-[slide-up_0.8s_ease-out_0.4s_forwards]"
          >
            Wear Your Next <br className="hidden sm:block" />
            <span className="inline-block opacity-0 animate-[fade-in_0.6s_ease-out_0.9s_forwards]">
              <FlipWords 
                words={heroWords} 
                duration={3500}
                className="italic text-champagne"
              />
            </span>
          </h1>

          {/* Subheadline */}
          <p 
            className="text-body-lg md:text-headline text-white/75 max-w-2xl mx-auto mb-14 font-serif italic leading-relaxed opacity-0 animate-[fade-in_0.8s_ease-out_0.7s_forwards]"
          >
            Premium apparel inspired by the world&apos;s most iconic destinations. 
            Each piece tells a story you can wear.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-5 opacity-0 animate-[fade-in_0.8s_ease-out_1s_forwards]"
          >
            <Button 
              asChild 
              size="xl" 
              className="min-w-[200px] h-14 rounded-none bg-champagne text-stone-900 hover:bg-gold hover:text-white transition-all duration-500 font-medium tracking-wide"
            >
              <Link href="/shop">Shop the Collection</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="xl" 
              className="min-w-[200px] h-14 rounded-none border-white/30 text-white/90 backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-500"
            >
              <Link href="#destinations">Explore Destinations</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div 
            className="mt-16 flex items-center justify-center gap-6 opacity-0 animate-[fade-in_0.8s_ease-out_1.2s_forwards]"
          >
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-caption text-white/50">Trusted by Travelers Worldwide</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 animate-[fade-in_0.8s_ease-out_1.4s_forwards]"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-pulse" />
          <span className="text-micro text-white/40 tracking-[0.3em] uppercase">Scroll</span>
        </div>
      </section>

      {/* ================================================
          2. THE ATLAS GATEWAY GRID - WOBBLE CARDS
          ================================================ */}
      <section id="destinations" className="section-spacing bg-background">
        <div className="container-wide">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <p className="label-gold mb-4">Shop by Destination</p>
              <h2 className="font-serif text-display mb-6 leading-tight">
                Browse <br />
                <span className="italic">Collections</span>
              </h2>
              <p className="text-editorial max-w-lg">
                Each collection is inspired by a unique destination. Discover apparel that captures the spirit and atmosphere of these iconic places.
              </p>
            </div>
            <Link 
              href="/atlas" 
              className="group flex items-center gap-3 text-caption text-stone-500 hover:text-gold transition-colors duration-400"
            >
              View Full Atlas 
              <ArrowRight className="w-4 h-4 transition-transform duration-400 group-hover:translate-x-2" aria-hidden="true" />
            </Link>
          </div>

          {/* Destinations Grid with Portal Arch Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {DESTINATIONS.map((dest) => (
              <DestinationCard
                key={dest.handle}
                handle={dest.handle}
                name={dest.name}
                region={dest.region}
                coordinates={dest.coordinates.split(',')[0]}
                imageUrl={dest.thumbnailUrl}
                tagline={dest.tagline}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          3. FEATURED ARTIFACTS - EXPANDABLE QUICK VIEW
          ================================================ */}
      <section className="section-spacing bg-white">
        <div className="container-wide">
          {/* Section Header */}
          <div className="text-center mb-24">
            <p className="label-editorial mb-4">Latest Additions</p>
            <h2 className="font-serif text-display mb-8">
              Featured Pieces
            </h2>
            <div className="flex items-center justify-center gap-4">
              <span className="w-16 h-px bg-stone-200" />
              <span className="text-gold text-lg">◆</span>
              <span className="w-16 h-px bg-stone-200" />
            </div>
          </div>

          {/* Product Expandable Cards */}
          <ProductExpandableCards products={featuredProducts} />

          {/* CTA */}
          <div className="mt-28 text-center">
            <Button 
              asChild 
              variant="outline" 
              size="xl" 
              className="min-w-[280px] h-14 rounded-none border-stone-300 text-stone-700 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-500"
            >
              <Link href="/pieces">Explore the Full Collection</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================
          4. JOURNAL PREVIEW - Moved here for better flow
          ================================================ */}
      <section className="section-spacing bg-background">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image */}
            <div className="relative group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200"
                  alt="The Journal"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.15)_100%)]" />
              </div>
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-stone-200 -z-10" />
            </div>
            
            {/* Content */}
            <div className="lg:pl-8 space-y-8">
              <Badge variant="outline" className="border-gold/40 text-gold px-4 py-1.5 text-micro">
                The Journal
              </Badge>
              
              <h2 className="font-serif text-display">
                Moments <br />
                <span className="italic">Between Places</span>
              </h2>
              
              <p className="text-editorial text-lg max-w-md">
                The Locra Journal is where we document the stories that don&apos;t fit on a label. Read about the morning light in Kyoto or the coastal secrets of Amalfi.
              </p>
              
              <Button 
                asChild 
                variant="link" 
                className="p-0 h-auto text-gold hover:text-gold/80 uppercase tracking-[0.2em] text-caption font-bold group"
              >
                <Link href="/journal" className="inline-flex items-center gap-3">
                  Read the Journal 
                  <ArrowRight className="w-4 h-4 transition-transform duration-400 group-hover:translate-x-2" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          5. TRAVEL CLUB MEMBERSHIP - Enhanced with context
          ================================================ */}
      <section className="relative">
        <TravelClubBanner variant="hero" />
      </section>

      {/* Final Divider */}
      <div className="container-wide">
        <Separator className="bg-stone-200" />
      </div>
    </div>
  );
}
