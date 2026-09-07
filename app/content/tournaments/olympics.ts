/**
 * `/tournaments/olympics` — Figma screen `648:30473` (RULES §9).
 *
 * The results table opened up: a period column beside it, every row an
 * accordion, five to a page.
 */
export const OLYMPICS_COPY = {
  /** `648:30486`. One line — the design draws it as one. */
  title: ["More Olympics Results"],
  back: "Back",
  backHref: "/tournaments",

  /** The three columns the closed rows print (`648:30575`). */
  columns: {
    year: "Year",
    event: "Event",
    category: "Category",
  },

  /**
   * The period column (`648:30549`).
   *
   * "All periods" and then a year per tab, and the years are DERIVED from the
   * results rather than written here — a hard-coded 2022–2026 would print tabs
   * that filter to nothing the year the federation files nothing, and hide the
   * year it files something in 2027.
   */
  filterLabel: "Filter results by period",
  allPeriods: "All periods",

  /** The row's expander. `%s` is the event. */
  expand: "Show details for %s",
  collapse: "Hide details for %s",

  /** The labels down the opened row (`648:30593`). */
  facts: {
    event: "Olympic Event",
    date: "Event Date",
    location: "Location",
    format: "Format",
  },

  /** Over the winner's name on the photo card (`648:30608`). */
  championEyebrow: "Olympic Champion(s)",

  /** Names the paginated list for assistive tech. */
  listLabel: "Olympic results",

  /** `?period=` naming a year the archive does not hold. */
  empty: "No results were filed for that period.",

  /**
   * Five to a page (`648:30615` draws three pages under five rows).
   *
   * Here rather than in the page, because it is the one number somebody might
   * want to change and it should be findable next to the copy it governs.
   */
  perPage: 5,

  description:
    "Every Olympic domino result the Domino World Federation has recorded — by year, event and category, with the champions who won them.",
} as const
