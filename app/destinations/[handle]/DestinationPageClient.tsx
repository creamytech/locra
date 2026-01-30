"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PieceCard } from "@/components/product/ArtifactCard";
import { ArrowRight, MapPin, Sparkles, ShoppingBag } from "lucide-react";
import type { Product, Collection } from "@/lib/shopify/types";
import type { Destination } from "@/lib/data/atlas";
import { DESTINATIONS } from "@/lib/data/atlas";
import { cn } from "@/lib/utils";

interface DestinationPageClientProps {
  destination: Destination;
  collection: Collection | null;
  handle: string;
}

export function DestinationPageClient({ destination, collection, handle }: DestinationPageClientProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  
  const dest = destination;
  const name = dest.name;
  const products = collection?.products || [];
  
  // Get unique product types for filtering
  const productTypes = [...new Set(products.map(p => p.productType).filter(Boolean))];
  
  // Filter products
  const filteredProducts = selectedFilter === "all" 
    ? products 
    : products.filter(p => p.productType === selectedFilter);

  // Get next destination for navigation
  const currentIndex = DESTINATIONS.findIndex(d => d.handle === handle);
  const nextDest = DESTINATIONS[(currentIndex + 1) % DESTINATIONS.length];

  return (
    <div className="flex flex-col bg-white">
      {/* 1. IMMERSIVE HERO */}
      <section className="relative h-[85vh] min-h-[600px] flex items-end overflow-hidden">
        {/* Hero Image with Parallax-like effect */}
        <div className="absolute inset-0">
          <Image
            src={dest.heroImageUrl}
            alt={name}
            fill
            className="object-cover scale-105"
            priority
          />
          {/* Gradient overlay - stronger at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-transparent" />
          {/* Color accent overlay */}
          <div 
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{ backgroundColor: dest.colorPalette.primary }}
          />
        </div>
        
        {/* Hero Content */}
        <div className="container-wide relative z-10 pb-16 md:pb-24">
          <div className="max-w-3xl">
            {/* Location Badge */}
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-4 h-4 text-gold" />
              <span className="text-[10px] tracking-[0.3em] font-medium text-white/70 uppercase">
                {dest.coordinates}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-4 text-white leading-[0.9] italic">
              {name}
            </h1>
            
            {/* Tagline */}
            <p className="text-xl md:text-2xl font-serif italic text-white/80 mb-8">
              {dest.tagline}
            </p>
            
            {/* Product Count */}
            <div className="flex items-center gap-4">
              <Badge 
                className="px-4 py-2 text-xs uppercase tracking-[0.2em] border-none"
                style={{ backgroundColor: dest.colorPalette.primary }}
              >
                {products.length} Pieces Available
              </Badge>
              <span className="text-white/50 text-sm">{dest.region}</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[9px] tracking-[0.3em] uppercase">Discover the Collection</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* 2. COLLECTION STORY - Clothing Focused */}
      <section className="py-20 md:py-32 bg-[#F9F8F6]">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Story Text */}
            <div className="order-2 lg:order-1">
              <Sparkles className="w-5 h-5 text-gold mb-6" />
              <h2 className="text-[10px] tracking-[0.4em] font-bold text-stone-400 uppercase mb-6">
                The Collection
              </h2>
              <p className="font-serif text-2xl md:text-3xl text-stone-800 leading-relaxed mb-8">
                &ldquo;{dest.story}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-px bg-stone-200" />
                <span className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">
                  {dest.poeticDescription}
                </span>
              </div>
            </div>
            
            {/* Featured Product Preview */}
            <div className="order-1 lg:order-2">
              {products[0] && (
                <div 
                  className="relative aspect-[3/4] overflow-hidden"
                  style={{ borderRadius: "50% 50% 16px 16px / 30% 30% 0 0" }}
                >
                  <Image
                    src={products[0].featuredImage?.url || dest.thumbnailUrl}
                    alt={products[0].title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-white/60 mb-1">Featured</p>
                    <p className="font-serif text-lg">{products[0].title}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT GRID - Clean & Product Focused */}
      <section className="py-20 md:py-32">
        <div className="container-wide">
          {/* Section Header with Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-[10px] tracking-[0.2em] font-bold text-stone-400 uppercase mb-3">
                Shop the Collection
              </p>
              <h3 className="font-serif text-4xl md:text-5xl italic">The {name} Capsule</h3>
            </div>
            
            {/* Filter Pills */}
            {productTypes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedFilter("all")}
                  className={cn(
                    "px-4 py-2 text-[10px] tracking-[0.15em] uppercase transition-all rounded-full",
                    selectedFilter === "all" 
                      ? "bg-stone-900 text-white" 
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  )}
                >
                  All Pieces
                </button>
                {productTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedFilter(type)}
                    className={cn(
                      "px-4 py-2 text-[10px] tracking-[0.15em] uppercase transition-all rounded-full",
                      selectedFilter === type 
                        ? "bg-stone-900 text-white" 
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
              {filteredProducts.map((product) => (
                <PieceCard key={product.id} product={product} destination={name} />
              ))}
            </div>
          ) : (
            <div className="bg-stone-50 border border-dashed border-stone-200 rounded-2xl p-16 md:p-24 text-center">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-6" />
              <p className="font-serif text-2xl text-stone-400 italic mb-4">
                The {name} vault is being restored
              </p>
              <p className="text-stone-400 text-sm max-w-md mx-auto">
                New pieces from our {name} expedition will be arriving soon. Join the waitlist to be notified.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. COLOR STORY / MOODBOARD */}
      <section 
        className="py-20 md:py-32 text-white relative overflow-hidden"
        style={{ backgroundColor: dest.colorPalette.primary }}
      >
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        
        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-[10px] tracking-[0.3em] font-bold uppercase mb-6 opacity-60">
                The Color Story
              </h3>
              <p className="font-serif text-3xl md:text-4xl italic leading-relaxed mb-8">
                Every piece in the {name} collection draws from the natural palette of its origin.
              </p>
              
              {/* Color Swatches */}
              <div className="flex gap-4">
                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full shadow-lg mb-2"
                    style={{ backgroundColor: dest.colorPalette.secondary }}
                  />
                  <span className="text-[9px] tracking-wider uppercase opacity-60">Primary</span>
                </div>
                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full shadow-lg mb-2"
                    style={{ backgroundColor: dest.colorPalette.accent }}
                  />
                  <span className="text-[9px] tracking-wider uppercase opacity-60">Accent</span>
                </div>
                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full shadow-lg mb-2 border border-white/20"
                    style={{ backgroundColor: dest.colorPalette.primary }}
                  />
                  <span className="text-[9px] tracking-wider uppercase opacity-60">Deep</span>
                </div>
              </div>
            </div>
            
            {/* Image Collage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                <Image 
                  src={dest.heroImageUrl} 
                  alt="Moodboard 1" 
                  fill 
                  className="object-cover opacity-80"
                />
              </div>
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden mt-8">
                <Image 
                  src={dest.thumbnailUrl} 
                  alt="Moodboard 2" 
                  fill 
                  className="object-cover opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRAVEL CLUB CTA */}
      <section className="py-20 md:py-32 bg-[#F9F8F6]">
        <div className="container-narrow">
          <div className="bg-stone-900 rounded-2xl p-10 md:p-16 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
            <Badge variant="gold" className="mb-6 px-4 py-1">
              Early Access
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl mb-4 italic">Join the {name} Waitlist</h2>
            <p className="text-stone-400 max-w-lg mx-auto mb-10 font-light leading-relaxed">
              Travel Club members receive first access to limited drops and exclusive pieces from the {name} collection.
            </p>
            <div className="flex flex-col sm:flex-row w-full max-w-md mx-auto gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-stone-800 border-none text-white px-5 py-4 outline-none focus:ring-1 focus:ring-gold rounded-lg"
              />
              <Button variant="gold" className="px-6 py-4 h-auto rounded-lg">
                Request Entry
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEXT DESTINATION */}
      <section className="py-20 md:py-32 border-t border-stone-100 flex justify-center">
        <Link 
          href={`/destinations/${nextDest.handle}`}
          className="group text-center"
        >
          <span className="text-[10px] tracking-[0.4em] font-bold text-stone-400 uppercase mb-4 block">
            Next Expedition
          </span>
          <span className="font-serif text-4xl md:text-6xl group-hover:text-gold transition-colors duration-500 italic">
            {nextDest.name}
          </span>
          <ArrowRight className="w-8 h-8 mx-auto mt-6 text-stone-300 group-hover:text-gold group-hover:translate-x-4 transition-all" />
        </Link>
      </section>
    </div>
  );
}
