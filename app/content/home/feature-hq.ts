/**
 * S4 copy, kept out of JSX for i18n (RULES §9).
 *
 * Wording is taken from Figma node `31:1105`, with one fix: the design's body
 * text reads "…international federationrecognized for the sport…" — two words
 * run together where the line broke in the mock. The space is restored.
 */

export const FEATURE_HQ_COPY = {
  /**
   * Two entries because Figma breaks the line explicitly (`31:1094`), and the
   * break is part of the composition — it is what keeps the headline clear of
   * the signage wall on the right. Each entry renders as its own line; on a
   * narrow screen a line may wrap further, which is fine, but the design's own
   * break is never lost.
   */
  headline: ["A Global Dominoes Federation", "For Every Nation"],
  body: "The Domino World Federation (DWF) is the sole international federation recognized for the sport of dominoes. Founded to standardize competitive play, we ensure that every tile played across the globe adheres to the highest standards of integrity and sportsmanship.",
  cta: "Discover More",
} as const

export const FEATURE_HQ_ALT = {
  /**
   * Not decorative: the building IS the section's subject — the headline claims
   * a global federation and the photograph is the evidence for it.
   */
  building:
    "The DWF headquarters, a concrete and glass building carrying the federation emblem above its entrance",
} as const
