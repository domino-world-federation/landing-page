/**
 * S10 copy, kept out of JSX for i18n (RULES §9).
 *
 * The documents themselves are data — title, category and file size arrive from
 * the API (mock for now) — so only the section's own words live here.
 */

export const RESOURCES_COPY = {
  /**
   * Figma node `56:4544` writes this on two lines. The break is not stored:
   * the column and the type are both sized in `vw`, so the heading wraps at
   * the same place on its own at every width, and a baked-in newline would
   * survive translation into languages where it falls mid-word.
   */
  heading: "Resource Library",
  intro:
    "Access official statutes, rulebooks, and governance documentation for all sanctioned play.",
  /**
   * The per-card link. `%s` is the document title — screen readers announce
   * links out of context, and "Download PDF" alone would be four identical
   * labels with no way to tell them apart.
   */
  downloadLabel: "Download %s",
} as const
