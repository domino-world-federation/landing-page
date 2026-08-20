import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Menggabungkan class Tailwind sekaligus menyelesaikan konflik —
 * `cn("p-4", "p-6")` menghasilkan `"p-6"`, bukan keduanya.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
