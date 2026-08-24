/**
 * Development News copy — Figma node `207:15528`, kept out of JSX for i18n
 * (RULES §9).
 *
 * The articles themselves are data: they come from
 * `getLatestNews(4, "Development")`, the same feed S8's mosaic reads (RULES
 * §8). Only the section's own words live here — the dates are formatted by
 * `formatLongDate`, because the design types them four different ways and one
 * of them has to win.
 */

export const DEVELOPMENT_NEWS_COPY = {
  eyebrow: "Updates",
  heading: "Development News",
  /**
   * The per-card link. `%s` is the headline — the card is a stretched anchor
   * over a date and a title, and without the title in the name a screen reader
   * hears four identical links.
   */
  readLabel: "Read %s",
} as const
