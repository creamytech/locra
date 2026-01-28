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
 */
export function HeroVideo({ src, poster, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsLoaded(true);
    const handleError = () => setHasError(true);

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div className={cn("bg-gradient-to-b from-stone-200 to-stone-300", className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-2xl text-stone-500/60 tracking-widest">
            ENTER
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-b from-stone-200 to-stone-300 animate-pulse" />
      )}

      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
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
