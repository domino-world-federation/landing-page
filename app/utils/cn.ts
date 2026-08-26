import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Joins Tailwind classes and resolves conflicts along the way —
 * `cn("p-4", "p-6")` yields `"p-6"`, not both.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
