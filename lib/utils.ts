import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price from Shopify's money format
 */
export function formatPrice(
  amount: string | number,
  currencyCode: string = "USD"
): string {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "...";
}

/**
 * Remove em dashes from marketing copy (per brand guidelines)
 */
export function cleanCopy(text: string): string {
  return text.replace(/—/g, " - ").replace(/–/g, "-");
}

/**
 * Generate a random ID for client-side use
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
