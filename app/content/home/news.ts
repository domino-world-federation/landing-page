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
   * Figma node `673:1453` — the section's title, hard left in its header row.
   *
   * It replaces the sentence that used to stand here ("Find the news and updates
   * from / the main source", `55:3224`): a centred, blur-swept line over the
   * photograph, which the redraw dropped from the frame entirely. A title in the
   * page's own gold display style says what the section is in three words where
   * the sentence took nine, and it leaves the right half of the row for the
   * controls.
   *
   * A plain string, where the sentence was an array: the array existed because
   * the sharpening sweep runs along each line independently and had to be told
   * where the lines were. Nothing sweeps this one.
   */
  heading: "News & Updates",
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
  /** The two rail controls, now a pair on the right (`673:1455`, `673:1456`). */
  previous: "Previous articles",
  next: "More articles",
} as const

export const NEWS_ALT = {
  /**
   * Decorative. The photograph carries the section's mood, not its meaning —
   * the title over it and the cards under it are the content, and describing the
   * desk would only make a screen reader read past it to reach them (RULES §12).
   */
  desk: "",
} as const
