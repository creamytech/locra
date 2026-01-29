"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "icon" | "wordmark" | "full";
  color?: "dark" | "light" | "gold";
}

/**
 * LOCRA Logo Components
 * - icon: The arch/portal icon
 * - wordmark: The LOCRA text
 * - full: Icon + Wordmark side by side
 */
export function Logo({ className, variant = "wordmark", color = "dark" }: LogoProps) {
  const colorClass = {
    dark: "invert-0",
    light: "invert",
    gold: "sepia saturate-200 hue-rotate-15", // Gold-ish tint
  }[color];

  if (variant === "icon") {
    return (
      <Image
        src="/IconLocra.svg"
        alt="LOCRA"
        width={32}
        height={36}
        className={cn("h-auto", colorClass, className)}
      />
    );
  }

  if (variant === "wordmark") {
    return (
      <Image
        src="/WordmarkLocra.svg"
        alt="LOCRA"
        width={120}
        height={28}
        className={cn("h-auto", colorClass, className)}
      />
    );
  }

  // Full logo: Icon + Wordmark
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/IconLocra.svg"
        alt=""
        width={24}
        height={28}
        className={cn("h-7 w-auto", colorClass)}
      />
      <Image
        src="/WordmarkLocra.svg"
        alt="LOCRA"
        width={100}
        height={24}
        className={cn("h-6 w-auto", colorClass)}
      />
    </div>
  );
}

/**
 * Just the icon component for compact usage
 */
export function LogoIcon({ className, color = "dark" }: Omit<LogoProps, "variant">) {
  return <Logo variant="icon" color={color} className={className} />;
}

/**
 * Just the wordmark for text-heavy contexts
 */
export function LogoWordmark({ className, color = "dark" }: Omit<LogoProps, "variant">) {
  return <Logo variant="wordmark" color={color} className={className} />;
}
