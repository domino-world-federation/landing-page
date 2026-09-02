/**
 * The Rulebook section — Figma node `277:15676` in the **updated** file. Kept
 * out of JSX for i18n (RULES §9).
 *
 * This is the block R12 was opened for. The old file declared 6033px of screen
 * and stopped drawing at y=2180 (D42), so "Official Game Rules" was left
 * unbuilt; the updated file draws it, and this is it.
 *
 * **The redraw turns the strip into match formats.** `572:14028` replaces the
 * six rule-set labels the older file drew ("DRaw rules", "block rules",
 * "scoring", "rules 4/5/6") with three: **101**, **1 round**, **best of 3** —
 * the same vocabulary the tournament records use in `formatLabel`. The middle
 * one is drawn selected.
 *
 * **Two of the three sets are written here, and that is stated rather than
 * hidden.** The design still draws only one card, the one behind "1 round", and
 * a strip whose other two tabs open nothing is the silent no-op D28 rules out —
 * so the strip could either not render at all (which is what it did while there
 * was one set) or the missing copy could be supplied. The repo owner asked for
 * the tabs, so it is supplied, the same call `MOCK_SHOWCASE_EVENTS` records for
 * the five events Figma never wrote: invented siblings in the same shape beat
 * a control that pretends.
 *
 * TODO(design): the copy for `101` and `best-of-3` is ours, not the
 * federation's. Both describe the format their tab names and cite a rule number
 * in the same series as the drawn one; neither is an official text and both
 * should be replaced the moment the rulebook exists.
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

/**
 * The strip's order is the design's, and so is which one opens: `572:14031`,
 * the middle tab, is the one drawn selected — see `Rulebook.vue`.
 */
export const RULE_SETS: readonly RuleSet[] = [
  {
    id: "101",
    tab: "101",
    title: "Scoring to 101",
    body: "A match is played until one side reaches 101 points, counted from the pips left in the losers' hands at the end of each hand. It is the federation's standard scoring ceiling and the one every sanctioned result is recorded against.",
    quote: {
      text: "A hand ends when a player is domino; the score it carries is the count of every tile still held against them.",
      cite: "DWF Rule 3.1.4",
    },
  },
  {
    id: "1-round",
    // "1 round" in Figma (`572:14032`).
    tab: "1 round",
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
  {
    id: "best-of-3",
    tab: "Best of 3",
    title: "Best of Three Matches",
    body: "A tie is decided over three games, and a side takes the match on the first two it wins. The third is played only where the first two are split, so a match is as long as it needs to be and no longer.",
    quote: {
      text: "Where the first two games are shared, the third is played to the same ceiling and decides the match outright.",
      cite: "DWF Rule 3.4.2",
    },
  },
]
