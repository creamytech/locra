"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

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
    small: "aspect-[3/4]",
    default: "aspect-[4/5]",
    large: "aspect-[3/4] md:aspect-[2/3]",
  };

  return (
    <Link 
      href={`/destinations/${handle}`}
      className={cn("group block", className)}
    >
      <article className="relative">
        {/* Portal Arch Image Container */}
        <div 
          className={cn(
            "relative overflow-hidden bg-gradient-to-b from-stone-200 to-stone-300",
            sizeStyles[size]
          )}
          style={{ 
            borderRadius: "50% 50% 12px 12px / 25% 25% 0 0",
          }}
        >
          {/* Image */}
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-all duration-1000 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.15)]" />
          
          {/* Region Badge */}
          <div className="absolute top-5 left-5 z-20">
            <Badge 
              variant="secondary" 
              className="bg-white/90 backdrop-blur-sm text-stone-700 border-0 shadow-sm rounded-full px-3"
            >
              {region}
            </Badge>
          </div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <h3 className="font-serif text-2xl md:text-3xl text-white mb-2 group-hover:text-gold transition-colors">
              {name}
            </h3>
            
            {tagline && (
              <p className="text-sm text-white/70 italic mb-3 line-clamp-1">
                "{tagline}"
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-micro uppercase tracking-[0.2em] text-gold">
                {coordinates}
              </span>
              
              {pieceCount !== undefined && (
                <span className="text-micro uppercase tracking-[0.15em] text-white/60">
                  {pieceCount} pieces
                </span>
              )}
            </div>
          </div>
          
          {/* Hover indicator */}
          <div className="absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </article>
    </Link>
  );
}

/**
 * Large featured destination card for homepage hero sections
 */
export function DestinationCardFeatured({
  handle,
  name,
  region,
  coordinates,
  imageUrl,
  tagline,
  pieceCount,
  className,
}: DestinationCardProps) {
  return (
    <Link 
      href={`/destinations/${handle}`}
      className={cn("group block", className)}
    >
      <article className="relative h-[500px] md:h-[600px] overflow-hidden rounded-3xl">
        {/* Image */}
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-all duration-1000 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          {/* Region Badge */}
          <Badge 
            variant="secondary" 
            className="w-fit bg-white/90 backdrop-blur-sm text-stone-700 border-0 shadow-sm rounded-full px-4 mb-6"
          >
            <MapPin className="w-3 h-3 mr-2" />
            {region}
          </Badge>
          
          <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-3 group-hover:text-gold transition-colors">
            {name}
          </h3>
          
          {tagline && (
            <p className="text-lg text-white/70 italic mb-4 max-w-md">
              "{tagline}"
            </p>
          )}
          
          <div className="flex items-center gap-6">
            <span className="text-sm uppercase tracking-[0.2em] text-gold">
              {coordinates}
            </span>
            
            {pieceCount !== undefined && (
              <>
                <span className="w-px h-4 bg-white/30" />
                <span className="text-sm uppercase tracking-[0.15em] text-white/60">
                  {pieceCount} pieces available
                </span>
              </>
            )}
          </div>
          
          {/* Explore button on hover */}
          <div className="mt-8 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm uppercase tracking-wider rounded-full">
              Explore Collection
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
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
        className="relative w-8 h-8 overflow-hidden"
        style={{ borderRadius: "50% 50% 0 0 / 50% 50% 0 0" }}
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
