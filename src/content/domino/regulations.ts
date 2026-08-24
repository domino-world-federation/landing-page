/**
 * The regulations section — Figma wireframe `119:4581`. Kept out of JSX for
 * i18n (RULES §9).
 *
 * **This section has no hi-fi design.** The Domino screen (`119:4737`) declares
 * 6033px of height but stops drawing at y=2180, so the last three blocks the
 * wireframe specifies were never rendered (D42). The layout and every word here
 * come from the wireframe, which does write them out in full; only the palette
 * is extrapolated, because the wireframe is greyscale and this site is not.
 *
 * The documents themselves are NOT here — a rulebook and two regulations are
 * entities with a file, a size and a type, so they come through
 * `getResources(category)` like every other document (RULES §8). What stays
 * here is prose: headings, the intro, and the four referee duties.
 */

export const REGULATIONS_COPY = {
  /**
   * Read but never drawn. The wireframe names the frame "Download & Regulations
   * Section" and then gives its two halves their own headings with nothing
   * above them — so the section has no visible title, and this is the name a
   * screen reader's landmark list gets instead of "section".
   */
  sectionLabel: "Downloads & Regulations",
  /** `119:4595` and `119:4598`. */
  refereeHeading: "Referee Guidelines",
  refereeIntro:
    "Referees ensure the mathematical integrity of the game and monitor for illegal signaling (kibitzing) or tile manipulation.",
  /** `119:4621`. */
  competitionHeading: "Competition Regulations",
  /**
   * The rulebook button's visible label (`119:4592`). `%t` is the file type and
   * `%s` the size, both from the document rather than written in — the design
   * says "DOWNLOAD PDF (4.2 MB)" and every part of that but the verb belongs to
   * the file. Two placeholders rather than one sentence so a translation can
   * reorder them.
   */
  downloadCta: "Download %t (%s)",
  /**
   * The same label for a document whose size the API did not send. A second
   * string rather than stripping " (%s)" out of the one above — that would be a
   * substring match against translated copy, and the first language that
   * punctuates the parenthetical differently would leave the marker on screen.
   */
  downloadCtaNoSize: "Download %t",
  /**
   * `%s` is the document title. Read as the button's accessible name, because
   * the visible label says what the control does but not which document it does
   * it to — a reader tabbing through hears "Download PDF (4.2 MB)" with no way
   * to know it is the rulebook.
   */
  downloadLabel: "Download %s",
  /**
   * `%s` is the document title. Same reason, on the two regulation rows — their
   * visible text is the title, so this only adds the verb.
   */
  openLabel: "Open %s",
} as const

/**
 * The four duties, `119:4600`–`119:4615`. Numbered in the design as `01`–`04`,
 * and the numbers are drawn rather than implied — but they are generated from
 * the array index at render rather than stored, so an inserted duty cannot
 * leave the list reading 01, 02, 02, 03.
 */
export const REFEREE_DUTIES: readonly { id: string; text: string }[] = [
  {
    id: "shuffle",
    text: 'Verification of the shuffle (the "washing" of tiles).',
  },
  {
    id: "clock",
    text: "Monitoring of the 15-second move clock in elite play.",
  },
  {
    id: "disputes",
    text: "Dispute resolution for exposed tiles or improper placement.",
  },
  {
    id: "certification",
    text: "Final pip count certification and scorecard entry.",
  },
] as const
