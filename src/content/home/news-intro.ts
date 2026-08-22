/**
 * S7 copy, kept out of JSX for i18n (RULES §9).
 *
 * One line of text and nothing else — the section is a photograph with a
 * sentence over it, introducing the news carousel that follows in S8.
 */

export const NEWS_INTRO_COPY = {
  /** Figma node `55:3224`, verbatim. */
  headline: "Find the news and updates from the main source",
} as const

export const NEWS_INTRO_ALT = {
  /**
   * Decorative. The photograph carries the section's mood, not its meaning —
   * the sentence over it is the content, and describing the desk would only
   * make a screen reader read past it to reach the words (RULES §12).
   */
  desk: "",
} as const
