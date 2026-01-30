"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CurvedBadge } from "@/components/ui/CurvedBadge";

interface DestinationCardProps {
  handle: string;
  name: string;
  region: string;
  coordinates: string;
  imageUrl: string;
  tagline?: string;
  pieceCount?: number;
  className?: string;
  size?: "default" | "large" | "small";
}

export function DestinationCard({
  handle,
  name,
  region,
  coordinates,
  imageUrl,
  tagline,
  pieceCount,
  className,
  size = "default",
}: DestinationCardProps) {
  const sizeStyles = {
    small: { className: "w-[200px]", width: 200 },
    default: { className: "w-[280px]", width: 280 },
    large: { className: "w-[320px]", width: 320 },
  };

  const { className: sizeClass, width: cardWidth } = sizeStyles[size];

  return (
    <Link 
      href={`/destinations/${handle}`}
      className={cn("group block flex-shrink-0", sizeClass, className)}
    >
      <article>
        {/* Portal Arch Image Container */}
        <div 
          className="relative aspect-[4/5] overflow-hidden bg-stone-200"
          style={{ 
            borderRadius: "50% 50% 16px 16px / 30% 30% 0 0",
          }}
        >
          {/* Image */}
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 80vw, 320px"
          />
          
          {/* Atmospheric overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)]" />
          
          {/* Curved Region Badge - Follows arch apex like mobile app */}
          <CurvedBadge 
            text={region} 
            width={cardWidth} 
            position="top" 
            color="#FFFFFF"
          />
          
          {/* Content - Bottom of card */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
            <h3 className="font-serif text-2xl md:text-3xl text-white mb-1 group-hover:text-gold transition-colors drop-shadow-lg">
              {name}
            </h3>
            
            {/* Coordinates with gold color */}
            <span className="text-[11px] uppercase tracking-[0.1em] text-gold font-medium">
              {coordinates}
            </span>
          </div>
        </div>

        {/* Info Below Card - Like Mobile */}
        <div className="pt-4 px-1">
          {tagline && (
            <p className="text-sm text-stone-500 italic font-serif mb-1 line-clamp-1">
              "{tagline}"
            </p>
          )}
          
          {pieceCount !== undefined && (
            <span className="text-[11px] uppercase tracking-[0.15em] text-gold font-semibold">
              {pieceCount} Pieces
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}

/**
 * Grid variant for 2x2 layout like mobile Atlas screen
 */
export function DestinationCardGrid({
  handle,
  name,
  region,
  coordinates,
  imageUrl,
  tagline,
  pieceCount,
  className,
}: DestinationCardProps) {
  // Default grid card width - will be responsive but base on typical mobile-like width
  const cardWidth = 180;

  return (
    <Link 
      href={`/destinations/${handle}`}
      className={cn("group block", className)}
    >
      <article>
        {/* Portal Arch Image Container */}
        <div 
          className="relative aspect-[4/5] overflow-hidden bg-stone-200"
          style={{ 
            borderRadius: "50% 50% 12px 12px / 30% 30% 0 0",
          }}
        >
          {/* Image */}
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          
          {/* Atmospheric overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          
          {/* Curved Region Badge - Follows arch apex like mobile app */}
          <CurvedBadge 
            text={region} 
            width={cardWidth} 
            position="top" 
            color="#FFFFFF"
          />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h3 className="font-serif text-xl text-white mb-0.5 group-hover:text-gold transition-colors drop-shadow-lg">
              {name}
            </h3>
            <span className="text-[10px] uppercase tracking-[0.1em] text-gold font-medium">
              {coordinates}
            </span>
          </div>
        </div>

        {/* Info Below */}
        <div className="pt-3 px-1">
          {tagline && (
            <p className="text-xs text-stone-500 italic font-serif mb-1 line-clamp-1">
              "{tagline}"
            </p>
          )}
          {pieceCount !== undefined && (
            <span className="text-[10px] uppercase tracking-[0.15em] text-gold font-semibold">
              {pieceCount} Pieces
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}

/**
 * Compact destination pill for inline usage
 */
export function DestinationPill({
  handle,
  name,
  imageUrl,
}: {
  handle: string;
  name: string;
  imageUrl: string;
}) {
  return (
    <Link 
      href={`/destinations/${handle}`}
      className="group inline-flex items-center gap-3 px-2 py-1.5 rounded-full bg-stone-50 hover:bg-stone-100 transition-colors"
    >
      <div 
        className="relative w-8 h-10 overflow-hidden"
        style={{ borderRadius: "50% 50% 4px 4px / 50% 50% 0 0" }}
      >
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="32px"
        />
      </div>
      <span className="text-sm text-stone-700 group-hover:text-gold transition-colors pr-2">
        {name}
      </span>
    </Link>
  );
}
