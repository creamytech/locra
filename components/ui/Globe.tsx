"use client";

import { useEffect, useRef, useCallback, memo } from "react";
import createGlobe from "cobe";
import { cn } from "@/lib/utils";

interface GlobeProps {
  className?: string;
  markers?: Array<{
    location: [number, number];
    size: number;
  }>;
  focusLat?: number;
  focusLng?: number;
}

// Memoize to prevent unnecessary re-renders
export const Globe = memo(function Globe({ 
  className, 
  markers = [],
  focusLat = 40,
  focusLng = -30,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const phiRef = useRef(0);
  const targetPhiRef = useRef(0);
  const thetaRef = useRef(0.3);
  const targetThetaRef = useRef(0.3);
  const widthRef = useRef(0);

  // Convert lat/lng to phi/theta for globe rotation
  const latLngToPhi = useCallback((lng: number) => {
    return -lng * (Math.PI / 180) + Math.PI / 2;
  }, []);

  const latLngToTheta = useCallback((lat: number) => {
    return (90 - lat) * (Math.PI / 180) * 0.4;
  }, []);

  // Update target position when focus changes
  useEffect(() => {
    targetPhiRef.current = latLngToPhi(focusLng);
    targetThetaRef.current = latLngToTheta(focusLat);
  }, [focusLat, focusLng, latLngToPhi, latLngToTheta]);

  const onResize = useCallback(() => {
    if (canvasRef.current) {
      widthRef.current = canvasRef.current.offsetWidth;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();
    
    if (!canvasRef.current) return;

    // Set initial position
    phiRef.current = latLngToPhi(focusLng);
    thetaRef.current = latLngToTheta(focusLat);

    // Create globe
    globeRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 0.4,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [0.15, 0.15, 0.15],
      markerColor: [0.98, 0.75, 0.14], // Gold
      glowColor: [0.05, 0.05, 0.05],
      markers: markers,
      onRender: (state) => {
        // Smoothly interpolate to target position (no auto-rotation)
        const phiDiff = targetPhiRef.current - phiRef.current;
        const thetaDiff = targetThetaRef.current - thetaRef.current;
        
        // Ease towards target
        phiRef.current += phiDiff * 0.08;
        thetaRef.current += thetaDiff * 0.08;
        
        state.phi = phiRef.current;
        state.theta = thetaRef.current;
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      },
    });

    // Fade in
    if (canvasRef.current) {
      canvasRef.current.style.opacity = "1";
    }

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
      window.removeEventListener("resize", onResize);
    };
  }, [markers, latLngToPhi, latLngToTheta, focusLat, focusLng]);

  return (
    <div className={cn("relative aspect-square w-full max-w-[500px] mx-auto", className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-0 transition-opacity duration-1000"
        style={{ contain: "layout paint size" }}
      />
      
      {/* Subtle glow effect around globe */}
      <div className="absolute inset-0 pointer-events-none rounded-full bg-gradient-radial from-gold/5 via-transparent to-transparent opacity-50" />
    </div>
  );
});

export default Globe;
