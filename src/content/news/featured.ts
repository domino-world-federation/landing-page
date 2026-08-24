/**
 * Featured band copy — Figma node `162:7600` (RULES §9).
 *
 * The stories are data (`getFeaturedNews`), including their dates and the
 * photograph behind them. What is left here is the furniture: the word above
 * the headline, the button, and the words the pager needs to say out loud.
 */

export const NEWS_FEATURED_COPY = {
  /** `162:7601`, above the date and separated from it by a bullet. */
  eyebrow: "Featured Story",

  /** `162:7612`. */
  readCta: "Read full story",

  /** Names the region for assistive tech; the design has no visible heading. */
  regionLabel: "Featured stories",

  previous: "Previous story",
  next: "Next story",

  /**
   * The pager's label — `162:7603` prints "1 of 6". `%1` is the position and
   * `%2` the total, because a language that puts them the other way round
   * cannot be served by concatenation.
   *
   * The total is whatever the feed returns rather than the design's literal
   * six: it is a count of things, and a count written into the page is a
   * number that goes wrong the first time the federation flags a seventh story.
   */
  position: "%1 of %2",
} as const
