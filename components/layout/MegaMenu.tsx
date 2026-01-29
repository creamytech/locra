"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DESTINATIONS, REGIONS, Destination } from "@/lib/data/atlas";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [activeRegion, setActiveRegion] = useState(REGIONS[0]);
  const [hoveredDestination, setHoveredDestination] = useState<Destination | null>(
    DESTINATIONS.find((d) => d.region === activeRegion) || DESTINATIONS[0]
  );

  const filteredDestinations = DESTINATIONS.filter(
    (d) => d.region === activeRegion
  );

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
            className="fixed inset-0 bg-stone-900/20 z-[90]"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-20 left-0 w-full bg-white border-b border-stone-200 z-[100] shadow-2xl overflow-hidden"
            onMouseLeave={() => {
              // Optionally close on leave, but usually better to have explicit trigger
            }}
          >
            <div className="container-wide py-12">
              <div className="grid grid-cols-12 gap-12">
                
                {/* Column 1: Regions */}
                <div className="col-span-2 border-r border-stone-100 pr-8">
                  <p className="text-[10px] tracking-[0.2em] font-medium text-stone-400 uppercase mb-8">
                    Regions
                  </p>
                  <ul className="space-y-4">
                    {REGIONS.map((region) => (
                      <li key={region}>
                        <button
                          onMouseEnter={() => {
                            setActiveRegion(region);
                            const firstInRegion = DESTINATIONS.find(d => d.region === region);
                            if (firstInRegion) setHoveredDestination(firstInRegion);
                          }}
                          className={cn(
                            "text-lg font-serif transition-all text-left w-full",
                            activeRegion === region
                              ? "text-gold translate-x-1"
                              : "text-stone-500 hover:text-stone-800"
                          )}
                        >
                          {region}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Destination Cards */}
                <div className="col-span-6 grid grid-cols-2 gap-4">
                  <div className="col-span-2 mb-4">
                    <p className="text-[10px] tracking-[0.2em] font-medium text-stone-400 uppercase">
                      Portals to {activeRegion}
                    </p>
                  </div>
                  {filteredDestinations.map((dest) => (
                    <Link
                      key={dest.handle}
                      href={`/destinations/${dest.handle}`}
                      onMouseEnter={() => setHoveredDestination(dest)}
                      onClick={onClose}
                      className="group flex items-start gap-4 p-3 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      <div className="w-16 h-20 relative overflow-hidden flex-shrink-0" style={{ borderRadius: "40px 40px 0 0" }}>
                        <Image
                          src={dest.thumbnailUrl}
                          alt={dest.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex flex-col pt-1">
                        <span className="text-sm font-medium text-stone-900 group-hover:text-gold transition-colors">
                          {dest.name}
                        </span>
                        <span className="text-[9px] text-stone-400 font-mono uppercase tracking-tighter mb-1">
                          {dest.coordinates}
                        </span>
                        <span className="text-xs text-stone-500 line-clamp-1 italic font-serif">
                          {dest.poeticDescription}
                        </span>
                      </div>
                    </Link>
                  ))}
                  {filteredDestinations.length === 0 && (
                    <div className="col-span-2 py-8 text-stone-400 font-serif italic">
                      Expedition pending discovery...
                    </div>
                  )}
                </div>

                {/* Column 3: Featured Preview */}
                <div className="col-span-4 pl-8 border-l border-stone-100">
                  <AnimatePresence mode="wait">
                    {hoveredDestination ? (
                      <motion.div
                        key={hoveredDestination.handle}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm group">
                          <Image
                            src={hoveredDestination.heroImageUrl}
                            alt={hoveredDestination.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-stone-900/10" />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] tracking-[0.2em] font-medium text-stone-400 uppercase mb-2">
                              Destination Spirit
                            </p>
                            <h4 className="font-serif text-2xl">
                              {hoveredDestination.name}
                            </h4>
                          </div>
                          <p className="text-sm text-stone-600 leading-relaxed font-light line-clamp-2">
                            {hoveredDestination.story}
                          </p>
                          <Link
                            href={`/destinations/${hoveredDestination.handle}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gold hover:gap-3 transition-all"
                          >
                            Explore Artifacts <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-stone-300 font-serif italic">
                        Select a region to begin
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-1 bg-gradient-to-r from-gold/5 via-gold/40 to-gold/5" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
