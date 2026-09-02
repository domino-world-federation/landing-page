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
   * One line, and it used to be two.
   *
   * The old node set it against the card's LEFT EDGE, stacked "FEATURED /
   * EVENT", because the section was a row and the eyebrow was a column of its
   * own beside the content. The revision (`561:13282`) turns the section into a
   * column and lifts the eyebrow above the row as a full-width label, where a
   * forced break would leave one word hanging over 1760px of empty space.
   */
  eyebrow: "Featured event",

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
