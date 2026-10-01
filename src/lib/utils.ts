import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a holiday package price with its CMS currency symbol (falls back to "€").
 * Letter symbols like "R" get a space so the amount doesn't run into them ("R 1500").
 * Only the symbol changes — amounts are never converted.
 */
export function formatPackagePrice(amount: number | string, currency?: string | null): string {
  const symbol = currency?.trim() || "€";
  return /[A-Za-z]$/.test(symbol) ? `${symbol} ${amount}` : `${symbol}${amount}`;
}
