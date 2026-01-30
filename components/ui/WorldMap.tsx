"use client";

import { useRef, useMemo } from "react";
import DottedMap from "dotted-map";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MapPoint {
  lat: number;
  lng: number;
  label?: string;
}

interface WorldMapProps {
  dots?: MapPoint[];
  lineColor?: string;
  className?: string;
  onPointClick?: (point: MapPoint, index: number) => void;
  selectedIndex?: number;
}

export function WorldMap({
  dots = [],
  lineColor = "#D4A853", // Gold color matching LOCRA
  className,
  onPointClick,
  selectedIndex = 0,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate the dotted world map SVG
  const svgMap = useMemo(() => {
    const map = new DottedMap({ height: 60, grid: "diagonal" });

    const svgMap = map.getSVG({
      radius: 0.22,
      color: "#4a4a4a", // Dark gray dots
      shape: "circle",
      backgroundColor: "transparent",
    });

    return `data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`;
  }, []);

  // Project lat/lng to SVG coordinates
  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  // Create curved path between two points
  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50; // Curve upward
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  // Get center point (for drawing arcs from selected to others)
  const centerPoint = dots[selectedIndex] 
    ? projectPoint(dots[selectedIndex].lat, dots[selectedIndex].lng)
    : { x: 400, y: 200 };

  return (
    <div className={cn("w-full aspect-[2/1] relative rounded-lg overflow-hidden", className)}>
      {/* Background dotted map */}
      <Image
        src={svgMap}
        alt="World Map"
        fill
        className="object-contain opacity-60 pointer-events-none select-none"
        draggable={false}
      />

      {/* Interactive SVG overlay */}
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
            <stop offset="50%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Draw connecting lines from selected point to all others */}
        {dots.map((dot, index) => {
          if (index === selectedIndex) return null;
          
          const point = projectPoint(dot.lat, dot.lng);
          const path = createCurvedPath(centerPoint, point);

          return (
            <motion.path
              key={`line-${index}`}
              d={path}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          );
        })}

        {/* Draw destination dots */}
        {dots.map((dot, index) => {
          const point = projectPoint(dot.lat, dot.lng);
          const isSelected = index === selectedIndex;

          return (
            <g 
              key={`dot-${index}`} 
              style={{ pointerEvents: "auto", cursor: "pointer" }}
              onClick={() => onPointClick?.(dot, index)}
            >
              {/* Pulse ring for selected */}
              {isSelected && (
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={12}
                  fill="transparent"
                  stroke={lineColor}
                  strokeWidth="2"
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Outer glow */}
              <circle
                cx={point.x}
                cy={point.y}
                r={isSelected ? 10 : 6}
                fill={lineColor}
                opacity={isSelected ? 0.3 : 0.2}
              />

              {/* Main dot */}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={isSelected ? 6 : 4}
                fill={lineColor}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.5 }}
              />

              {/* Label */}
              {dot.label && isSelected && (
                <motion.text
                  x={point.x}
                  y={point.y - 18}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="500"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {dot.label}
                </motion.text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default WorldMap;
