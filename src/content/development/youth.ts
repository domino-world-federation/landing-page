/**
 * Youth Development copy — Figma node `190:13662`, kept out of JSX for i18n
 * (RULES §9).
 *
 * The two figures are copy rather than data, unlike S5's federation stats: they
 * are drawn once inside a prose block that reads as a claim ("45+ partner
 * schools"), not as a feed the federation keeps updating. If the programme ever
 * publishes live counts they move to `client.ts` — until then inventing an
 * endpoint for two numbers nobody serves would be the heavier lie.
 */

export const YOUTH_COPY = {
  eyebrow: "Programs",
  heading: "Youth Development",
  /**
   * Figma leaves a trailing space at the end of this sentence (`190:14509`);
   * it is not reproduced.
   */
  intro:
    "The DWF Youth Program is designed to introduce the strategic depth of dominoes to educational institutions worldwide.",
  /**
   * Figma types this "Download CURRICULuM PDF" (`190:14529`) — a stray
   * lower-case `u` inside a word set in capitals. That is a typing slip in a
   * word with one obvious spelling, so it is corrected rather than reproduced
   * (D40). Stored in natural case; the button's own `uppercase` does the
   * shouting, which is also why the slip cannot come back.
   */
  downloadCta: "Download curriculum PDF",
  /**
   * The accessible name of that button. The visible label already says what the
   * file is, but a screen reader announces links out of context and "Download
   * curriculum PDF" gives no clue which programme's curriculum it is.
   */
  downloadLabel: "Download the youth development curriculum (PDF)",
  /**
   * `#` while blocker B2 stands. The curriculum PDF does not exist, and
   * pointing at a path that will 404 is worse than a button that visibly does
   * nothing — the same call `MOCK_RESOURCES` makes for every `fileUrl`.
   */
  downloadHref: "#",
} as const

export type YouthStat = {
  id: string
  figure: string
  label: string
}

export const YOUTH_STATS: readonly YouthStat[] = [
  { id: "schools", figure: "45+", label: "Partner Schools" },
  { id: "students", figure: "12K+", label: "Active Students" },
]
