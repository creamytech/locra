"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CurvedBadgeProps {
  text: string;
  width: number; // Card width to calculate the arc
  position?: "left" | "right" | "top";
  color?: string; // Text color (hex or CSS color)
  className?: string;
}

/**
 * CurvedBadge - Text that curves along an arc path
 * Used for destination badges that follow the portal arch shape
 * Matches the mobile app's CurvedBadge component using SVG textPath
 */
export function CurvedBadge({
  text,
  width,
  position = "top",
  color = "#78716c", // stone-500
  className,
}: CurvedBadgeProps) {
  const radius = width / 2;
  const padding = 8;

  // Generate unique path ID
  const pathId = useMemo(
    () => `curved-path-${position}-${Math.random().toString(36).substr(2, 9)}`,
    [position]
  );

  // Create an arc path for the text to follow
  const createArcPath = () => {
    if (position === "top") {
      // Top arc - text follows the dome of the arch
      // Creates a gentle upward curve at the top of the card
      const startX = padding + 10;
      const endX = width - padding - 10;
      const centerY = radius * 0.35; // Position near top
      const curveHeight = 20; // How much the arc curves up

      // Quadratic bezier curve for smooth arc at top
      return `M ${startX} ${centerY} Q ${width / 2} ${centerY - curveHeight} ${endX} ${centerY}`;
    } else if (position === "left") {
      // Left side arc - text follows left curve of arch
      const startX = padding;
      const startY = radius - padding;
      const endX = radius - padding;
      const endY = padding + 10;

      return `M ${startX} ${startY} A ${radius - padding} ${radius - padding} 0 0 1 ${endX} ${endY}`;
    } else {
      // Right side arc - text follows right curve of arch
      const startX = radius + padding;
      const startY = padding + 10;
      const endX = width - padding;
      const endY = radius - padding;

      return `M ${startX} ${startY} A ${radius - padding} ${radius - padding} 0 0 1 ${endX} ${endY}`;
    }
  };

  const svgWidth = width;
  const svgHeight = position === "top" ? radius * 0.5 : radius + 20;

  return (
    <div
      className={cn(
        "absolute pointer-events-none z-20",
        position === "top" && "top-0 left-0",
        position === "left" && "top-0 left-0",
        position === "right" && "top-0 right-0",
        className
      )}
      style={{ width: svgWidth, height: svgHeight }}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible"
      >
        <defs>
          <path id={pathId} d={createArcPath()} fill="none" />
        </defs>
        <text
          fill={color}
          fontSize={10}
          fontWeight={600}
          letterSpacing={2}
          textAnchor={position === "top" ? "middle" : "start"}
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            textTransform: "uppercase",
          }}
        >
          <textPath
            href={`#${pathId}`}
            startOffset={position === "top" ? "50%" : "5%"}
          >
            {text.toUpperCase()}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

/**
 * Simple flat pill badge as a fallback or alternative style
 * Positions at the top center of portal arch cards
 */
export function FlatBadge({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={cn("absolute top-5 left-1/2 -translate-x-1/2 z-20", className)}>
      <span className="bg-white/95 backdrop-blur-sm text-stone-700 text-[10px] uppercase tracking-[0.15em] font-semibold px-4 py-1.5 rounded-full shadow-sm">
        {text}
      </span>
    </div>
  );
}
