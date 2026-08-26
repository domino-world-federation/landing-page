/**
 * About header copy — Figma node `119:4799`, kept out of JSX for i18n
 * (RULES §9).
 */

export const ABOUT_HEADER_COPY = {
  /**
   * One entry per line, the way `VISION_COPY.heading` and
   * `FEATURE_HQ_COPY.headline` are written — the design breaks after
   * "authority" and the break is not incidental here: the sharpening sweep runs
   * left-to-right along **each** line, so the lines have to be known rather
   * than left to whatever the column width happens to produce.
   *
   * A translation may of course want to break elsewhere, which is exactly why
   * this is an array and not a `<br>` buried in the markup (RULES §9).
   */
  title: ["The global authority", "for dominoes."],
  intro:
    "The Domino World Federation (DWF) stands as the definitive international governing body for the sport of dominoes. Established to standardize competitive play and foster global community, we represent over 80 national member associations across five continents.",
} as const

export const ABOUT_HEADER_ALT = {
  /**
   * The full-bleed band below the header (`79:616`). Not decorative: the
   * heading claims a global authority and the photograph is the people who
   * hold it — the same relationship S4's building has to its headline.
   */
  band: "The federation's officials in formal dress, arranged in two rows against a plain grey backdrop",
} as const
