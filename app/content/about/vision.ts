/**
 * Vision copy — Figma node `102:2793`, kept out of JSX for i18n (RULES §9).
 */

export const VISION_COPY = {
  eyebrow: "Our Vision",
  /**
   * Two entries because Figma sets the heading at 100/108 in a 560px column
   * (`97:2745`), which breaks a two-line heading — and the break is part of the
   * composition: it keeps the second line clear of the figure standing behind
   * it. Each entry renders as its own line; a narrow screen may wrap further.
   */
  heading: ["A Game for", "Every Generation"],
  lead: "We envision a world where people of every age, background, and ability can find a place in dominoes—whether they play for enjoyment, connection, learning, or competition.",
  /** The second column (`97:2742`), set below a short rule. */
  detail:
    "By bringing people together across cultures and generations, dominoes can strengthen communities and create lasting opportunities for the people who keep the game alive.",
} as const

export const VISION_ALT = {
  /**
   * Not decorative: the tile IS the argument the copy makes — a domino with
   * the world where its top pip should be: one game, played the world over,
   * drawn rather than said.
   */
  tile: "A black domino tile standing upright, its upper half bearing a gold globe in place of the pips",
} as const
