"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HeroVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

/**
 * Hero Video Component
 * Cinematic video that plays within the Portal Arch frame
 * Optimized for fast loading with graceful loading state
 */
export function HeroVideo({ src, poster, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Use loadeddata instead of canplay for faster appearance
    // loadeddata fires when the first frame is available
    const handleLoadedData = () => setIsLoaded(true);
    const handleError = () => setHasError(true);

    // If video is already loaded (cached), show immediately
    if (video.readyState >= 2) {
      setIsLoaded(true);
    }

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, []);

  // Loading/Error placeholder - styled to match video aesthetic
  const PlaceholderBackground = () => (
    <div 
      className={cn(
        "absolute inset-0 transition-opacity duration-700",
        isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      {poster ? (
        // If poster provided, use it
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      ) : (
        // Elegant gradient that matches video color scheme
        <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900">
          {/* Subtle animated shimmer */}
          <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer" />
        </div>
      )}
    </div>
  );

  if (hasError) {
    return (
      <div className={cn("relative", className)}>
        <PlaceholderBackground />
        {/* Cinematic overlay for consistency */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-stone-900/10" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Placeholder shown while video loads */}
      <PlaceholderBackground />

      {/* Video - preload for faster loading */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={poster}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-stone-900/10" />
    </div>
  );
}
