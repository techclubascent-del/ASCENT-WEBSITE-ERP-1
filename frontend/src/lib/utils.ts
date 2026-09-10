// ─────────────────────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────────────────────
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 * This is the standard shadcn/ui utility pattern.
 *
 * @example cn("px-2 py-1", condition && "bg-blue-500", "px-4") → "py-1 bg-blue-500 px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an ISO date string into a readable format.
 *
 * @example formatDate("2024-03-15T10:00:00Z") → "15 Mar 2024"
 */
export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoString));
}

/**
 * Returns true if a deadline ISO string is in the past.
 */
export function isExpired(deadline: string): boolean {
  return new Date(deadline) < new Date();
}
