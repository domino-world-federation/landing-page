/**
 * Development header copy — Figma node `190:13657`, kept out of JSX for i18n
 * (RULES §9).
 */

export const DEVELOPMENT_HEADER_COPY = {
  /**
   * One entry per line, for the same reason `ABOUT_HEADER_COPY.title` is an
   * array: the sharpening sweep runs left-to-right along **each** line, so the
   * lines have to be known rather than left to whatever the column width
   * happens to produce.
   *
   * TWO entries, and the break is deliberate rather than a consequence of the
   * column: "Growing / the Game" sets the verb on its own line and lets the
   * object land under it. One entry left the break to whatever 824px happened to
   * allow, which put it in a different place at every width.
   */
  title: ["Growing", "the Game"],
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
