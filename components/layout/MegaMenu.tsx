"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DESTINATIONS, Destination } from "@/lib/data/atlas";
import { cn, formatPrice } from "@/lib/utils";
import { ArrowRight, Plane } from "lucide-react";
import type { Product } from "@/lib/shopify/types";

// Group destinations by region for the Atlas chapter structure
const REGION_GROUPS = {
  "Mediterranean": ["Cyclades", "Mediterranean"],
  "Asia & Beyond": ["East Asia", "North Africa"],
  "Nordic & Highland": ["Highlands", "Nordics"],
};

// Fallback static artifacts for each destination (used when no Shopify product)
const FALLBACK_ARTIFACTS: Record<string, {
  name: string;
  subtitle: string;
  price: string;
  imageUrl: string;
  handle: string;
}> = {
  "santorini": {
    name: "Caldera Linen Crewneck",
    subtitle: "Hand-stitched gold embroidery",
    price: "$185",
    imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=400",
    handle: "santorini-linen-crewneck",
  },
  "amalfi": {
    name: "Positano Cotton Tote",
    subtitle: "Lemon grove print · Italian canvas",
    price: "$145",
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=400",
    handle: "amalfi-citrus-tote",
  },
  "kyoto": {
    name: "Bamboo Path Shirt",
    subtitle: "Indigo dye · Wabi-sabi weave",
    price: "$220",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400",
    handle: "kyoto-indigo-shirt",
  },
  "marrakech": {
    name: "Medina Silk Scarf",
    subtitle: "Majorelle blue · Geometric print",
    price: "$165",
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=400",
    handle: "medina-dye-scarf",
  },
};

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  featuredProducts?: Record<string, Product | null>;
}

export function MegaMenu({ isOpen, onClose, onMouseEnter, onMouseLeave, featuredProducts }: MegaMenuProps) {
  const [hoveredDestination, setHoveredDestination] = useState<Destination>(
    DESTINATIONS[0]
  );

  // Get all destinations for the flight-board style list
  const allDestinations = DESTINATIONS;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 right-0 top-full bg-white border-b border-stone-200 shadow-xl overflow-hidden z-[100]"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave || onClose}
        >
          <div className="container-wide py-10">
            <div className="grid grid-cols-12 gap-8">
                  
                  {/* Column 1: Atlas Regions - Chapter Style */}
                  <div className="col-span-2 border-r border-stone-100 pr-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Plane className="w-3 h-3 text-gold" aria-hidden="true" />
                      <p className="text-[10px] tracking-[0.25em] font-bold text-gold uppercase">
                        Atlas Regions
                      </p>
                    </div>
                    
                    <nav className="space-y-6">
                      {Object.entries(REGION_GROUPS).map(([groupName, regions]) => (
                        <div key={groupName}>
                          <p className="text-[9px] tracking-[0.2em] font-medium text-stone-300 uppercase mb-3">
                            {groupName}
                          </p>
                          <ul className="space-y-2">
                            {regions.map((region) => {
                              const destInRegion = DESTINATIONS.find(d => d.region === region);
                              if (!destInRegion) return null;
                              return (
                                <li key={region}>
                                  <button
                                    onMouseEnter={() => setHoveredDestination(destInRegion)}
                                    className={cn(
                                      "text-sm font-serif transition-all text-left w-full py-1 pl-3 border-l-2",
                                      hoveredDestination?.region === region
                                        ? "text-gold border-gold translate-x-1"
                                        : "text-stone-600 border-transparent hover:text-stone-900 hover:border-stone-300"
                                    )}
                                  >
                                    {region}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </nav>
                  </div>

                  {/* Column 2: Destination Flight Board */}
                  <div className="col-span-5">
                    <p className="text-[10px] tracking-[0.2em] font-medium text-stone-400 uppercase mb-6">
                      Select Destination
                    </p>
                    
                    <div className="space-y-1">
                      {allDestinations.map((dest) => (
                        <Link
                          key={dest.handle}
                          href={`/destinations/${dest.handle}`}
                          onMouseEnter={() => setHoveredDestination(dest)}
                          onClick={onClose}
                          className={cn(
                            "group flex items-center gap-4 p-3 rounded-lg transition-all duration-300",
                            hoveredDestination?.handle === dest.handle
                              ? "bg-stone-50"
                              : "hover:bg-stone-50/50"
                          )}
                        >
                          {/* Portal Thumbnail */}
                          <div 
                            className="w-12 h-14 relative overflow-hidden flex-shrink-0 transition-transform duration-500 group-hover:scale-105" 
                            style={{ borderRadius: "24px 24px 0 0" }}
                          >
                            <Image
                              src={dest.thumbnailUrl}
                              alt={dest.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          {/* Destination Info - Flight Board Style */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-3">
                              <span className={cn(
                                "text-base font-serif transition-colors duration-300",
                                hoveredDestination?.handle === dest.handle
                                  ? "text-gold"
                                  : "text-stone-900 group-hover:text-gold"
                              )}>
                                {dest.name}
                              </span>
                              <span className="text-[9px] font-mono text-stone-400 tracking-tight">
                                {dest.coordinates.split(",")[0]}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 font-light italic mt-0.5 truncate">
                              {dest.poeticDescription}
                            </p>
                          </div>
                          
                          {/* Arrow indicator */}
                          <ArrowRight 
                            className={cn(
                              "w-4 h-4 transition-all duration-300",
                              hoveredDestination?.handle === dest.handle
                                ? "text-gold opacity-100 translate-x-0"
                                : "text-stone-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                            )}
                            aria-hidden="true"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Destination Spirit + Featured Artifact */}
                  <div className="col-span-5 pl-8 border-l border-stone-100">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={hoveredDestination.handle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        {/* Hero Image with Cross-Dissolve */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm">
                          <motion.div
                            key={hoveredDestination.heroImageUrl}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                          >
                            <Image
                              src={hoveredDestination.heroImageUrl}
                              alt={hoveredDestination.name}
                              fill
                              className="object-cover"
                            />
                          </motion.div>
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />
                          
                          {/* Tagline overlay */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white/80 font-serif italic text-sm drop-shadow-md">
                              "{hoveredDestination.tagline}"
                            </p>
                          </div>
                        </div>
                        
                        {/* Destination Info */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[9px] tracking-[0.2em] font-medium text-stone-400 uppercase mb-1">
                                Destination Spirit
                              </p>
                              <h4 className="font-serif text-xl text-stone-900">
                                {hoveredDestination.name}
                              </h4>
                            </div>
                            <span className="text-[10px] font-mono text-stone-400 tracking-tight">
                              {hoveredDestination.coordinates}
                            </span>
                          </div>
                          
                          <p className="text-sm text-stone-600 leading-relaxed font-light line-clamp-2">
                            {hoveredDestination.story}
                          </p>
                        </div>
                        
                        {/* Featured Artifact Preview */}
                        {(() => {
                          const destHandle = hoveredDestination.handle;
                          const shopifyProduct = featuredProducts?.[destHandle];
                          const fallback = FALLBACK_ARTIFACTS[destHandle];
                          
                          // Use Shopify product if available, otherwise fallback
                          const artifact = shopifyProduct ? {
                            name: shopifyProduct.title,
                            subtitle: shopifyProduct.productType || "Artifact",
                            price: formatPrice(
                              shopifyProduct.priceRange.minVariantPrice.amount,
                              shopifyProduct.priceRange.minVariantPrice.currencyCode
                            ),
                            imageUrl: shopifyProduct.featuredImage?.url || fallback?.imageUrl || "",
                            handle: shopifyProduct.handle,
                          } : fallback;
                          
                          if (!artifact) return null;
                          
                          return (
                            <div className="pt-4 border-t border-stone-100">
                              <p className="text-[9px] tracking-[0.2em] font-medium text-stone-400 uppercase mb-3">
                                Featured from {hoveredDestination.name}
                              </p>
                              <Link
                                href={`/products/${artifact.handle}`}
                                onClick={onClose}
                                className="group flex items-center gap-4 p-3 -mx-3 rounded-lg hover:bg-stone-50 transition-colors"
                              >
                                {/* Artifact Image */}
                                <div className="w-16 h-20 relative overflow-hidden flex-shrink-0 rounded-sm bg-stone-100">
                                  <Image
                                    src={artifact.imageUrl}
                                    alt={artifact.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                </div>
                                
                                {/* Artifact Info */}
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-sm font-serif text-stone-900 group-hover:text-gold transition-colors">
                                    {artifact.name}
                                  </h5>
                                  <p className="text-[10px] text-stone-500 mt-0.5">
                                    {artifact.subtitle}
                                  </p>
                                  <p className="text-xs font-medium text-stone-700 mt-1">
                                    {artifact.price}
                                  </p>
                                </div>
                                
                                {/* Add to Suitcase Arrow */}
                                <ArrowRight 
                                  className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity" 
                                  aria-hidden="true" 
                                />
                              </Link>
                            </div>
                          );
                        })()}
                        
                        {/* CTA - Travel Language */}
                        <Link
                          href={`/destinations/${hoveredDestination.handle}`}
                          onClick={onClose}
                          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold hover:gap-3 transition-all"
                        >
                          Pack for {hoveredDestination.name}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  {/* End of Column 3 */}

                </div>
                {/* End of grid */}
              </div>
              {/* End of container-wide */}

              {/* Bottom Accent - Subtle Gold Line */}
              <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      );
}

