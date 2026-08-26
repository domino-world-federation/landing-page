/**
 * S6 copy (RULES §9).
 *
 * The event itself — its name, dates, place and summary — is NOT here. That is
 * data, and it comes through `getEventShowcase()`. What is left is the furniture
 * the section puts around it: the labels, the buttons, and the words the pager
 * needs for assistive tech.
 */
export const FEATURED_EVENT_COPY = {
  /**
   * Two entries because Figma breaks the line explicitly (`52:3028`): the
   * eyebrow is set two words tall against the card's left edge. A `<br>` in the
   * JSX would make the break part of the markup rather than part of the text,
   * so a translation could not move it.
   */
  eyebrow: ["FEATURED", "EVENT"],

  /** Field labels above the date and place (`52:3033`, `52:3036`). */
  dateLabel: "Date",
  locationLabel: "Location",

  details: "Details",
  register: "Register for event",

  /**
   * The brand half of the wordmark across the card's foot (`52:3047`). The
   * year beside it is the event's and comes from the data, so only this part
   * is copy.
   */
  watermark: "DWF",

  /**
   * The pager. Figma writes "1 of 6" as flat text; the numbers here are filled
   * in at render, so a translation keeps the word order it needs.
   */
  pagerPosition: (current: number, total: number) => `${current} of ${total}`,
  previous: "Previous event",
  next: "Next event",

  /**
   * Names the section for assistive tech. The visible eyebrow is styled as a
   * label rather than a heading, and promoting it to one would put "FEATURED
   * EVENT" into the document outline in a size the design never draws.
   */
  heading: "Featured event",
} as const

export const FEATURED_EVENT_ALT = {
  /**
   * The watermark and the light streaks across the card are decoration — the
   * emblem is the federation's own mark, already spelled out by the logo in the
   * navbar, and the streaks are lighting (RULES §7).
   */
  watermark: "",
} as const
