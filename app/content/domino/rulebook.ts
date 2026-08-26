/**
 * The Rulebook section — Figma node `277:15676` in the **updated** file. Kept
 * out of JSX for i18n (RULES §9).
 *
 * This is the block R12 was opened for. The old file declared 6033px of screen
 * and stopped drawing at y=2180 (D42), so "Official Game Rules" was left
 * unbuilt; the updated file draws it, and this is it.
 *
 * **The design draws six tabs and the contents of one.** Its strip reads "DRaw
 * rules", "block rules", "scoring", "rules 4", "rules 5", "rules 6" — the last
 * three are placeholder labels, and only one card exists behind any of them.
 * So `RULE_SETS` holds the one that has copy, and the strip renders from that
 * array rather than from the six labels: a tab that opens nothing is the silent
 * no-op D28 ruled out, and the same call D50 made about the news archive's
 * categories. Add a set here and its tab appears.
 *
 * TODO(design): five rule sets still owed — block, scoring, and the three the
 * design has not named. Until then this section shows one card and no strip.
 *
 * TODO(design): the design marks "block rules" as the selected tab while the
 * card beside it is titled "Standar Draw Regulations" and describes drawing
 * from the boneyard. The card wins here — it is the half with content — but the
 * two disagree in the file (D44).
 */

export const RULEBOOK_COPY = {
  /** `277:15679`. */
  heading: "The Rulebook",
  /** Names the tab strip for assistive tech. */
  tabsLabel: "Rule sets",
} as const

export type RuleSet = {
  id: string
  /** The label on the tab strip. */
  tab: string
  title: string
  body: string
  quote: { text: string; cite: string }
}

export const RULE_SETS: readonly RuleSet[] = [
  {
    id: "draw",
    // "DRaw rules" in Figma (`288:15758`) — a stray capital, corrected the way
    // "Sub-Commitees" was (D40).
    tab: "Draw rules",
    // "Standar Draw Regulations" (`289:15782`). "Standar" is "Standard" a
    // letter short; the same call.
    title: "Standard Draw Regulations",
    // Figma hard-breaks this between the two sentences. The break is not
    // reproduced — the column decides where a line ends (D40).
    body: "If a player cannot play a tile, they must draw from the boneyard until they find a playable tile or the boneyard is empty. This adds a layer of variance and resource management to the core mechanics.",
    quote: {
      text: "The draw is not a penalty, but a tactical redirection of the game state.",
      cite: "DWF Rule 4.2.1",
    },
  },
]
