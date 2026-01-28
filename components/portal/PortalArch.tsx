"use client";

import { cn } from "@/lib/utils";

interface PortalArchProps {
  children?: React.ReactNode;
  className?: string;
  glowEnabled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Portal Arch - A reusable arch frame component
 * Features a rounded top rectangle arch shape with optional glow effect
 */
export function PortalArch({
  children,
  className,
  glowEnabled = true,
  size = "md",
}: PortalArchProps) {
  const sizeClasses = {
    sm: "w-32 h-40",
    md: "w-48 h-64",
    lg: "w-64 h-80",
    xl: "w-80 h-96 md:w-96 md:h-[28rem]",
  };

  return (
    <div className={cn("relative inline-flex", className)}>
      {/* Glow Leak Effect */}
      {glowEnabled && (
        <div
          className="absolute inset-0 -z-10 animate-glow-pulse"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 80%, hsl(var(--primary) / 0.2) 0%, transparent 60%)`,
            filter: "blur(40px)",
            transform: "scale(1.2)",
          }}
        />
      )}

      {/* Arch Frame */}
      <div
        className={cn(
          "relative overflow-hidden bg-stone-200/50 border border-stone-300/50",
          "flex items-center justify-center",
          sizeClasses[size]
        )}
        style={{
          borderRadius: "999px 999px 0 0",
        }}
      >
        {/* Inner Shadow for Depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: "inset 0 4px 20px rgba(0, 0, 0, 0.06)",
          }}
        />

        {/* Content Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {children ? (
            children
          ) : (
            /* Default placeholder pattern */
            <div className="w-full h-full bg-gradient-to-b from-stone-100 to-stone-200/50" />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Portal Arch Frame - Just the outline/border version
 * For use with images that fill the frame
 */
export function PortalArchFrame({
  children,
  className,
  glowEnabled = false,
}: Omit<PortalArchProps, "size">) {
  return (
    <div className={cn("relative", className)}>
      {/* Glow Effect */}
      {glowEnabled && (
        <div
          className="absolute inset-0 -z-10 animate-glow-pulse"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 60%, hsl(var(--primary) / 0.15) 0%, transparent 60%)`,
            filter: "blur(30px)",
            transform: "scale(1.1)",
          }}
        />
      )}

      {/* Arch Container */}
      <div
        className="relative overflow-hidden border border-stone-300/30"
        style={{
          borderRadius: "999px 999px 4px 4px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
