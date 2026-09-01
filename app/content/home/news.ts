/**
 * S8 copy, kept out of JSX for i18n (RULES §9).
 *
 * The cards' own words are data, not content — they arrive from the API (mock
 * for now), so only the chrome around them lives here.
 *
 * This file used to have a twin, `news-intro.ts`, holding the sentence and the
 * photograph's alt for a section of their own. The redraw (`53:3067`) draws the
 * photograph, the sentence and the strip as ONE 1920 × 1080 frame, so the two
 * sections became one and the two copy files with them.
 */

export const NEWS_COPY = {
  /**
   * Figma node `55:3224`, verbatim — the line over the photograph.
   *
   * One entry per line, for the same reason `DEVELOPMENT_HEADER_COPY.title` and
   * `ABOUT_HEADER_COPY.title` are arrays: the sharpening sweep runs
   * left-to-right along **each** line independently, so the lines have to be
   * known rather than left to whatever the column width happens to produce.
   * Figma breaks it after "from" inside its 1008px box, and two entries are what
   * say so.
   */
  headline: ["Find the news and updates from", "the main source"],
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
  /** The two rail controls the redraw adds (`566:13385`, `566:13386`). */
  previous: "Previous articles",
  next: "More articles",
} as const

export const NEWS_ALT = {
  /**
   * Decorative. The photograph carries the section's mood, not its meaning —
   * the sentence over it is the content, and describing the desk would only
   * make a screen reader read past it to reach the words (RULES §12).
   */
  desk: "",
} as const
