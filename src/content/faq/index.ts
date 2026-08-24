/**
 * FAQ page furniture — Figma screen `173:9459` (RULES §9).
 *
 * The questions themselves are in `./items`; what is left here is the band, the
 * search field and the strings the page says when a filter finds nothing.
 */

export const FAQ_PAGE_COPY = {
  /** `174:11492`. One entry per line — `SharpeningHeadline` takes the array,
   *  and the design sets the title on one line at the design width. */
  title: ["Frequently Asked Questions"],

  /**
   * `174:11473`. Goes home rather than to a parent section: unlike `/news/all`,
   * which is the news page's archive, this page is reached from the footer of
   * every page on the site, so the only destination "Back" can honestly name is
   * the front of it — the same call the legal screens make.
   */
  back: "Back",
  backHref: "/",

  /**
   * `176:11868` types "Search Event", which is the gallery header's string
   * pasted onto an FAQ screen — there are no events on this page. Corrected the
   * way `/news/all` corrected the same paste (D40).
   */
  searchPlaceholder: "Search FAQs",
  searchLabel: "Search frequently asked questions",
  /** The link out of a search that found nothing. */
  searchClear: "Clear search",

  /** The tab that clears the category filter (`173:9525`). */
  allTab: "All FAQs",
  /** Names the column for assistive tech; the design gives it no heading,
   *  unlike the legal contents columns. */
  filterLabel: "Filter questions by topic",

  /** Shown when `?category=` names a drawer with nothing in it. */
  empty: "No questions are filed under this topic yet.",
  /** Shown when a search matches nothing. `%s` is what was typed. */
  emptySearch: "No questions match “%s”.",
} as const
