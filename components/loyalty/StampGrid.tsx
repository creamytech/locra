"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin, Lock, CheckCircle2 } from "lucide-react";
import type { Stamp, Destination } from "@/lib/loyalty/types";

interface StampGridProps {
  earnedStamps: (Stamp & { destination: Destination })[];
  allDestinations: Destination[];
  className?: string;
  variant?: "grid" | "masonry" | "passport";
}

export function StampGrid({ 
  earnedStamps, 
  allDestinations, 
  className,
  variant = "grid",
}: StampGridProps) {
  const earnedIds = new Set(earnedStamps.map((s) => s.destinationId));

  // Group destinations by region
  const regionGroups: Record<string, Destination[]> = {};
  for (const dest of allDestinations) {
    if (!regionGroups[dest.region]) {
      regionGroups[dest.region] = [];
    }
    regionGroups[dest.region].push(dest);
  }

  const percentComplete = Math.round((earnedStamps.length / allDestinations.length) * 100);

  if (variant === "passport") {
    return (
      <div className={cn("space-y-8", className)}>
        {/* Passport Page Look */}
        <div className="relative p-8 bg-gradient-to-br from-stone-50 via-white to-stone-50 border border-stone-200 rounded-xl shadow-luxury">
          {/* Vintage texture overlay */}
          <div className="absolute inset-0 opacity-50 pointer-events-none texture-paper rounded-xl" />
          
          {/* Header */}
          <div className="relative text-center mb-8">
            <p className="text-micro tracking-[0.5em] text-stone-400 uppercase mb-2">Atlas Travel Club</p>
            <h3 className="font-serif text-2xl text-stone-800">Passport Stamps</h3>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="w-12 h-px bg-gradient-to-r from-transparent to-stone-300" />
              <span className="text-gold text-xs">◆</span>
              <span className="w-12 h-px bg-gradient-to-l from-transparent to-stone-300" />
            </div>
          </div>

          {/* Stamps by Region */}
          <div className="relative space-y-8">
            {Object.entries(regionGroups).map(([region, destinations]) => (
              <div key={region}>
                <h4 className="text-micro tracking-[0.3em] font-medium text-gold uppercase mb-4 flex items-center gap-3">
                  <MapPin className="w-3.5 h-3.5" />
                  {region}
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-5">
                  {destinations.map((destination) => {
                    const isEarned = earnedIds.has(destination.id);
                    const stamp = earnedStamps.find((s) => s.destinationId === destination.id);

                    return (
                      <PassportStamp
                        key={destination.id}
                        destination={destination}
                        isEarned={isEarned}
                        earnedDate={stamp?.createdAt}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Passport Footer */}
          <div className="relative mt-10 pt-6 border-t border-dashed border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="font-serif text-3xl text-stone-900">{earnedStamps.length}</p>
                <p className="text-micro text-stone-400 uppercase tracking-wider">Collected</p>
              </div>
              <div className="w-px h-10 bg-stone-200" />
              <div className="text-center">
                <p className="font-serif text-3xl text-stone-300">{allDestinations.length - earnedStamps.length}</p>
                <p className="text-micro text-stone-400 uppercase tracking-wider">Remaining</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full">
                <span className="font-serif text-lg text-gold">{percentComplete}%</span>
                <span className="text-micro text-gold/70 uppercase">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default grid variant
  return (
    <div className={cn("space-y-8", className)}>
      {Object.entries(regionGroups).map(([region, destinations]) => (
        <div key={region}>
          <h4 className="text-micro tracking-[0.25em] font-medium text-stone-400 uppercase mb-5 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            {region}
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {destinations.map((destination) => {
              const isEarned = earnedIds.has(destination.id);
              const stamp = earnedStamps.find((s) => s.destinationId === destination.id);

              return (
                <StampCard
                  key={destination.id}
                  destination={destination}
                  isEarned={isEarned}
                  earnedDate={stamp?.createdAt}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Stats Footer */}
      <div className="pt-6 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="font-serif text-3xl text-stone-900">
                {earnedStamps.length}
                <span className="text-stone-300 text-xl"> / {allDestinations.length}</span>
              </p>
              <p className="text-micro text-stone-400 uppercase tracking-wider">Stamps Collected</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-2 bg-stone-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentComplete}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-gold to-amber-500 rounded-full"
              />
            </div>
            <span className="font-mono text-sm text-stone-600">{percentComplete}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StampCardProps {
  destination: Destination;
  isEarned: boolean;
  earnedDate?: Date;
}

function StampCard({ destination, isEarned, earnedDate }: StampCardProps) {
  return (
    <motion.div
      whileHover={isEarned ? { scale: 1.08, rotate: Math.random() * 4 - 2 } : { scale: 1.02 }}
      className={cn(
        "relative aspect-square rounded-xl overflow-hidden transition-all duration-300",
        isEarned
          ? "bg-white border-2 border-gold/60 shadow-luxury-sm hover:shadow-luxury"
          : "bg-stone-50 border-2 border-dashed border-stone-200"
      )}
    >
      {/* Stamp Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
        <AnimatePresence mode="wait">
          {isEarned ? (
            <motion.div
              key="earned"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="flex flex-col items-center"
            >
              {/* Stamp emoji */}
              <span 
                className="text-3xl sm:text-4xl drop-shadow-sm"
                style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.08))" }}
              >
                {destination.stampEmoji}
              </span>
              
              {/* Destination name */}
              <p className="mt-1.5 text-micro font-medium text-stone-700 text-center leading-tight">
                {destination.name}
              </p>
              
              {/* Date */}
              {earnedDate && (
                <p className="text-[8px] text-stone-400 mt-0.5 font-mono">
                  {new Date(earnedDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}

              {/* Decorative stamp ring */}
              <div
                className="absolute inset-2 rounded-lg border-2 border-dashed opacity-20"
                style={{ borderColor: destination.stampColor }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-1">
                <Lock className="w-4 h-4 text-stone-300" />
              </div>
              <p className="text-micro font-medium text-stone-400 text-center leading-tight">
                {destination.name}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Earned badge */}
      {isEarned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
          style={{ backgroundColor: destination.stampColor }}
        >
          <CheckCircle2 className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
}

// Passport page stamp style
function PassportStamp({ destination, isEarned, earnedDate }: StampCardProps) {
  return (
    <motion.div
      whileHover={isEarned ? { scale: 1.1, rotate: Math.random() * 6 - 3 } : {}}
      className={cn(
        "relative aspect-square flex flex-col items-center justify-center",
        isEarned ? "cursor-default" : "opacity-40"
      )}
    >
      {isEarned ? (
        <>
          {/* Actual stamp look */}
          <div 
            className="relative w-full h-full rounded-full border-4 flex flex-col items-center justify-center"
            style={{ 
              borderColor: destination.stampColor,
              background: `radial-gradient(circle, ${destination.stampColor}10 0%, transparent 70%)`
            }}
          >
            <span className="text-3xl">{destination.stampEmoji}</span>
            <p className="text-[9px] font-bold uppercase tracking-wider text-center px-1" style={{ color: destination.stampColor }}>
              {destination.name}
            </p>
          </div>
          
          {/* Date below */}
          {earnedDate && (
            <p className="absolute -bottom-5 text-[8px] text-stone-400 font-mono">
              {new Date(earnedDate).toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
            </p>
          )}
        </>
      ) : (
        <div className="w-full h-full rounded-full border-2 border-dashed border-stone-300 flex flex-col items-center justify-center">
          <Lock className="w-4 h-4 text-stone-300 mb-1" />
          <p className="text-[9px] text-stone-400 text-center px-1">{destination.name}</p>
        </div>
      )}
    </motion.div>
  );
}

// Compact version for headers/summaries
export function StampRowCompact({
  earnedStamps,
  maxVisible = 6,
  className,
}: {
  earnedStamps: (Stamp & { destination: Destination })[];
  maxVisible?: number;
  className?: string;
}) {
  const visibleStamps = earnedStamps.slice(0, maxVisible);
  const remaining = earnedStamps.length - maxVisible;

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-2">
        {visibleStamps.map((stamp, i) => (
          <motion.div
            key={stamp.id}
            initial={{ scale: 0, x: -10 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
            className="w-9 h-9 rounded-full bg-white border-2 flex items-center justify-center shadow-luxury-sm hover:z-10 hover:scale-110 transition-transform"
            style={{ borderColor: stamp.destination.stampColor }}
            title={stamp.destination.name}
          >
            <span className="text-base">{stamp.destination.stampEmoji}</span>
          </motion.div>
        ))}
      </div>
      {remaining > 0 && (
        <div className="ml-1 w-9 h-9 rounded-full bg-stone-100 border-2 border-stone-200 flex items-center justify-center">
          <span className="text-micro font-medium text-stone-500">+{remaining}</span>
        </div>
      )}
    </div>
  );
}
