/**
 * The loading screen's copy, kept out of JSX for i18n (RULES §9).
 *
 * Not from Figma — the design draws no loading state for any page. What is
 * here is the minimum a loading screen owes a reader who cannot see it.
 */

export const LOADING_COPY = {
  /**
   * Read aloud, never printed. The mark and the bar say "loading" to the eye;
   * this is the same sentence for a screen reader, which is why it is a real
   * string rather than an `aria-label` on a decorative image.
   */
  label: "Loading the page",
} as const
