/**
 * The two competition formats — Figma nodes `131:4834` (singles) and
 * `207:15558` (doubles). Kept out of JSX for i18n (RULES §9).
 *
 * **The doubles panel used to be defective and the designer has now fixed it.**
 *
 * In the old file its heading read "SINGLES FORMAT" (`207:15611`) and its body
 * was byte-for-byte the singles body (`207:15612`) — a paste that was never
 * finished, as the panel's own statistics proved: 2 VS 2, 200 pts. The heading
 * was corrected here under D40, because the panel demonstrably WAS the doubles
 * panel; the body was left exactly as drawn and marked `TODO(design)`, because
 * replacing it would have meant inventing claims about how doubles play works.
 *
 * The updated file writes both properly, and the body it now carries is the one
 * the wireframe had all along. So the marker comes off and the copy below is the
 * design's own — which is the outcome the note was waiting for, and a small
 * argument for leaving a defect visible rather than quietly patching it.
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
    heading: "Doubles Format",
    body: "The pinnacle of professional play. Teammates must communicate through tile placement and gameplay flow without verbal signals, creating a silent strategic dialogue.",
    stats: [
      { id: "players", label: "Players", value: "2 vs 2" },
      { id: "hand-size", label: "Hand Size", value: "7 tiles" },
      { id: "winning-score", label: "Winning Score", value: "200 pts" },
    ],
  },
] as const

/**
 * The figures flanking the seam between the two panels.
 *
 * **These used to be one picture.** The design placed a single globe-engraved
 * tile lying across the seam, each panel clipping its share of it; the updated
 * file replaces it with two different photographs — a lone silhouette on the
 * singles side, a pair back to back on the doubles side. That is a better
 * argument than the tile made: the pictures now say what the panels say.
 *
 * Decorative in the strict sense — each panel's heading already names its
 * format — but they carry text anyway, because they are the section's only
 * pictures and a reader who reaches one should not be told nothing at all.
 */
export const FORMATS_ALT = {
  singles:
    "The silhouette of a single player, arms folded, lit from behind",
  doubles:
    "The silhouettes of two players standing back to back, lit from behind",
} as const
