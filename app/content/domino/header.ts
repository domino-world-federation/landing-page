/**
 * Domino header copy — Figma node `119:4809`, kept out of JSX for i18n
 * (RULES §9).
 */

export const DOMINO_HEADER_COPY = {
  /**
   * One entry per line, for the same reason `ABOUT_HEADER_COPY.title` is an
   * array: the sharpening sweep runs left-to-right along **each** line, so the
   * lines have to be known rather than left to the column width. This title is
   * short enough to sit on one, and one entry is what says so.
   */
  title: ["The Domino"],
  /**
   * Figma writes "Mathematic Precision" (`119:4817`) where the wireframe's
   * equivalent heading reads "Mathematical" (`119:4491`). Left as the hi-fi
   * writes it — the two files disagree about a word, which is a question for
   * the designer rather than a typo with one obvious answer (D40).
   *
   * TODO(design): confirm "Mathematic" vs "Mathematical" — `119:4817`.
   */
  subtitle: "A Discipline of Mathematic Precision",
  intro:
    "Dominoes is more than a pastime; it is a competitive sport requiring high-level strategic thinking, probability assessment, and psychological fortitude. The Domino World Federation (DWF) standardizes the game for international play, ensuring every match is a fair test of skill.",
} as const

export const DOMINO_HEADER_ALT = {
  /**
   * The full-bleed band below the header (`131:4824`). Not decorative: the page
   * is about how the game is actually played, and this is the game being
   * played — the same relationship About's band has to its heading.
   */
  band: "Two players facing each other across a wooden table, a chain of dominoes laid out between them",
} as const
