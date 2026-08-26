/**
 * Development header copy — Figma node `190:13657`, kept out of JSX for i18n
 * (RULES §9).
 */

export const DEVELOPMENT_HEADER_COPY = {
  /**
   * One entry per line, for the same reason `ABOUT_HEADER_COPY.title` is an
   * array: the sharpening sweep runs left-to-right along **each** line, so the
   * lines have to be known rather than left to whatever the column width
   * happens to produce. Figma sets this on one line at 824px, and one entry is
   * what says so.
   */
  title: ["Growing the game"],
  intro:
    "Establishing the global infrastructure for competitive excellence and grassroots participation.",
} as const

export const DEVELOPMENT_HEADER_ALT = {
  /**
   * The full-bleed band below the header (`190:13660`). Not decorative: the
   * heading claims the federation is growing the game and this is that work
   * happening — the same relationship About's and Domino's bands have to
   * theirs.
   */
  band: "Four students at a long table in a bright modern classroom, laying out dominoes in front of them",
} as const
