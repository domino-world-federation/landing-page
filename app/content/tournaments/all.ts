import type { TournamentRegistration } from "~/lib/api/types"

/**
 * `/tournaments/all` copy — Figma screen `517:2487` (RULES §9).
 *
 * The tournaments themselves are data (`client.ts`); what lives here is the
 * page's furniture — the title, the filter rows, the search field's words and
 * what the page says when a filter matches nothing.
 */

/**
 * The filter column (`517:2507`).
 *
 * Figma types six rows: All, Soon, Open, Closed, Ongoing, Ended. Five of them
 * map onto the data and one does not, which is worth stating rather than
 * quietly dropping:
 *
 *  - **"Soon" is `upcoming`** — entries have not opened yet. The word the pill
 *    on the card prints is "Upcoming"; the tab says "Soon" because Figma writes
 *    it that way and a filter row is allowed to be terser than a badge.
 *  - **"Ended" is not a registration state.** Registration being closed says
 *    nothing about whether the tournament has been played — a championship in
 *    June 2027 can have closed its entries today. So "Ended" filters on
 *    `status: "completed"` instead, which is the fact the word names. It is the
 *    one row whose `value` is not a `TournamentRegistration`, and the page
 *    branches on it by name.
 */
export const TOURNAMENT_FILTERS: ReadonlyArray<{
  /** What goes in `?status=`. `undefined` on "All", which drops the query. */
  value?: TournamentRegistration | "ended"
  label: string
}> = [
  { value: undefined, label: "All" },
  { value: "upcoming", label: "Soon" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "ongoing", label: "Ongoing" },
  { value: "ended", label: "Ended" },
]

export const ALL_TOURNAMENTS_COPY = {
  /** `517:2500`, one entry per line — `SharpeningHeadline` takes the array. */
  title: ["All Tournaments"],
  back: { label: "Back", href: "/tournaments" },

  filtersLabel: "Filter tournaments by state",

  /** `517:2502`. */
  searchLabel: "Search tournaments",
  searchPlaceholder: "Search Tournament",

  /** The list, for assistive tech — the grid has no visible heading. */
  listLabel: "Tournaments",

  /**
   * Said when a filter or a search matches nothing. Two sentences rather than
   * one: the second is the way out, and a dead end with no way back is the
   * failure an empty state exists to prevent.
   */
  empty:
    "No tournaments match this filter yet. Try another state, or clear the search.",

  /** `517:2720` — "1 of 6". `%1` is the page, `%2` the total. */
  pageOf: (page: number, total: number) => `${page} of ${total}`,
  previousPage: "Previous page",
  nextPage: "Next page",
  /** Spoken when the page changes; the grid is not re-announced on its own. */
  pageChanged: (page: number, total: number) =>
    `Showing page ${page} of ${total}`,
} as const
