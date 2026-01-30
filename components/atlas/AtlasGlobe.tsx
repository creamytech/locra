"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { DESTINATIONS } from "@/lib/data/atlas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import WorldMap to avoid SSR issues
const WorldMap = dynamic(() => import("@/components/ui/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[2/1] bg-stone-800/50 rounded-lg animate-pulse" />
  ),
});

// Parse coordinates from string like "36.3932° N, 25.4615° E"
function parseCoordinates(coordString: string): { lat: number; lng: number } {
  const parts = coordString.split(",");
  const latPart = parts[0]?.trim() || "0° N";
  const lngPart = parts[1]?.trim() || "0° E";
  
  const latMatch = latPart.match(/([\d.]+)°?\s*([NS])/i);
  const lngMatch = lngPart.match(/([\d.]+)°?\s*([EW])/i);
  
  let lat = parseFloat(latMatch?.[1] || "0");
  let lng = parseFloat(lngMatch?.[1] || "0");
  
  if (latMatch?.[2]?.toUpperCase() === "S") lat = -lat;
  if (lngMatch?.[2]?.toUpperCase() === "W") lng = -lng;
  
  return { lat, lng };
}

export function AtlasGlobe() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedDestination = DESTINATIONS[selectedIndex];

  // Create map points from destinations
  const mapPoints = useMemo(() => 
    DESTINATIONS.map(dest => {
      const coords = parseCoordinates(dest.coordinates);
      return {
        lat: coords.lat,
        lng: coords.lng,
        label: dest.name,
      };
    }), 
  []);

  const handlePointClick = useCallback((point: { lat: number; lng: number; label?: string }, index: number) => {
    setSelectedIndex(index);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <p className="text-[10px] tracking-[0.3em] font-bold text-gold uppercase mb-3 flex items-center justify-center gap-2">
          <Compass className="w-4 h-4" />
          Click a Location to Explore
        </p>
      </div>

      {/* Interactive World Map */}
      <div className="bg-stone-800/30 rounded-2xl p-4 md:p-8 border border-stone-700/50">
        <WorldMap
          dots={mapPoints}
          lineColor="#D4A853"
          selectedIndex={selectedIndex}
          onPointClick={handlePointClick}
        />
      </div>

      {/* Destination Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {DESTINATIONS.map((dest, index) => (
          <button
            key={dest.handle}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border",
              selectedIndex === index
                ? "bg-gold text-stone-900 border-gold shadow-lg shadow-gold/20"
                : "bg-transparent text-stone-300 border-stone-700 hover:border-gold hover:text-gold"
            )}
          >
            {dest.name}
          </button>
        ))}
      </div>

      {/* Selected Destination Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDestination.handle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-stone-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-48 md:h-auto md:aspect-[4/3] overflow-hidden">
                <Image
                  src={selectedDestination.heroImageUrl}
                  alt={selectedDestination.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-900/80 via-stone-900/40 to-transparent" />
                
                {/* Coordinates overlay */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span className="text-xs font-mono text-white/80">{selectedDestination.coordinates}</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 flex flex-col justify-center">
                <Badge 
                  className="w-fit mb-3 border-none text-[10px] text-white"
                  style={{ backgroundColor: selectedDestination.colorPalette.primary }}
                >
                  {selectedDestination.region}
                </Badge>
                <h3 className="font-serif text-2xl md:text-3xl text-white mb-1 italic">
                  {selectedDestination.name}
                </h3>
                <p className="text-gold text-sm mb-3 italic">
                  "{selectedDestination.tagline}"
                </p>
                <p className="text-stone-400 text-sm mb-5 line-clamp-2">
                  {selectedDestination.poeticDescription}
                </p>
                
                <Button asChild className="w-full bg-gold text-stone-900 hover:bg-gold/90 rounded-lg font-semibold">
                  <Link href={`/destinations/${selectedDestination.handle}`}>
                    Explore Collection
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
