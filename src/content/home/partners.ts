/**
 * S9 copy, kept out of JSX for i18n (RULES §9).
 *
 * The partners themselves are data — name and artwork arrive from the API (mock
 * for now) — so only the section's own words live here.
 */

export const PARTNERS_COPY = {
  /**
   * Figma node `55:3316`, written there in capitals with 0.25em tracking.
   * Stored in its natural case and capitalised in CSS, so a translation with no
   * uppercase form is not mangled by the data.
   */
  heading: "Official Partners",
  /** Names the moving strip for assistive tech, which cannot see it. */
  regionLabel: "Official partners",
} as const
