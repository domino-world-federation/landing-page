/**
 * S8 copy, kept out of JSX for i18n (RULES §9).
 *
 * The cards' own words are data, not content — they arrive from the API (mock
 * for now), so only the chrome around them lives here.
 */

export const NEWS_COPY = {
  /**
   * The eyebrow every card carries in Figma (`55:3217` and siblings), written
   * there in capitals. Stored in its natural case and capitalised in CSS, so a
   * translation that has no uppercase form is not mangled by the data.
   */
  eyebrow: "News",
  /**
   * The per-card link. `%s` is the headline — screen readers announce the card's
   * button on its own, and "Read article" alone would be seven identical labels
   * in a row with no way to tell them apart.
   */
  readLabel: "Read: %s",
  /** Names the region for assistive technology, which cannot see the strip. */
  regionLabel: "Latest news",
} as const
