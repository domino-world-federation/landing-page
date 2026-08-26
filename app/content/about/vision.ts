/**
 * Vision copy — Figma node `102:2793`, kept out of JSX for i18n (RULES §9).
 */

export const VISION_COPY = {
  eyebrow: "Our Vision",
  /**
   * Two entries because Figma sets the heading at 100/108 in a 560px column
   * (`97:2745`), which breaks it here — and the break is part of the
   * composition: it keeps the second line clear of the figure standing behind
   * it. Each entry renders as its own line; a narrow screen may wrap further.
   */
  heading: ["Elevating tiles", "to the world stage"],
  lead: "We envision dominoes elevated from a beloved local pastime to a universally recognized, prestigious strategic sport.",
  /** The second column (`97:2742`), set below a short rule. */
  detail:
    "Our goal is to see the elite practitioners of the game celebrated on the global Olympic stage, bringing analytical depth and professional sportsmanship to the absolute forefront of minds worldwide.",
} as const

export const VISION_ALT = {
  /**
   * Not decorative: the tile IS the argument the copy makes — a domino with
   * the world where its top pip should be, which is "elevating tiles to the
   * world stage" drawn rather than said.
   */
  tile: "A black domino tile standing upright, its upper half bearing a gold globe in place of the pips",
} as const
