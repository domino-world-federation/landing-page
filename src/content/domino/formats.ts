/**
 * The two competition formats — Figma nodes `131:4834` (singles) and
 * `207:15558` (doubles). Kept out of JSX for i18n (RULES §9).
 *
 * **The doubles panel is defective in the design and is corrected only in
 * part** (D44, applying the D40 precedent).
 *
 * Its heading reads "SINGLES FORMAT" (`207:15611`) and its body is byte-for-byte
 * the singles body (`207:15612`) — a paste that was never finished, as the
 * panel's own statistics prove: 2 VS 2, 200 pts. The heading is corrected here,
 * because the panel demonstrably IS the doubles panel and naming it so is
 * spelling a settled word. The body is left exactly as drawn and marked, because
 * replacing it would mean inventing claims about how doubles play works that
 * nobody has made yet.
 */

/** One `label: value` row in a panel's statistics list. */
export type FormatStat = {
  id: string
  label: string
  value: string
}

export type Format = {
  id: string
  eyebrow: string
  heading: string
  body: string
  stats: readonly FormatStat[]
}

export const FORMATS: readonly Format[] = [
  {
    id: "singles",
    eyebrow: "Overview",
    heading: "Singles Format",
    body: "The purest test of individual tactical depth. Players must track all 28 tiles while managing a private hand of 7, calculating remaining possibilities with absolute accuracy.",
    stats: [
      { id: "players", label: "Players", value: "1 vs 1" },
      { id: "hand-size", label: "Hand Size", value: "7 tiles" },
      { id: "winning-score", label: "Winning Score", value: "100 / 150 pts" },
    ],
  },
  {
    id: "doubles",
    eyebrow: "Overview",
    // Corrected from Figma's "SINGLES FORMAT" — see the note at the top.
    heading: "Doubles Format",
    // TODO(design): duplicated from the singles panel in `207:15612`. The
    // wireframe's equivalent panel (`119:4536`) has doubles-specific copy —
    // "Teammates must communicate through tile placement and gameplay flow
    // without verbal signals" — but the two files disagree, and choosing
    // between them is the designer's call, not ours.
    body: "The purest test of individual tactical depth. Players must track all 28 tiles while managing a private hand of 7, calculating remaining possibilities with absolute accuracy.",
    stats: [
      { id: "players", label: "Players", value: "2 vs 2" },
      { id: "hand-size", label: "Hand Size", value: "7 tiles" },
      { id: "winning-score", label: "Winning Score", value: "200 pts" },
    ],
  },
] as const

export const FORMATS_ALT = {
  /**
   * The figure straddling the seam between the two panels. Decorative in the
   * strict sense — the panels say everything it shows — but it carries an `alt`
   * anyway because it is the section's only picture and a reader who hits it
   * should not be told nothing at all.
   */
  tile: "A single domino tile standing upright, a globe engraved across its face",
} as const
