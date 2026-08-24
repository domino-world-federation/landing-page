/**
 * Archive copy — Figma nodes `166:8431` (the filter) and `165:8250` (the grid),
 * kept out of JSX for i18n (RULES §9).
 *
 * The articles and their categories are data (`getLatestNews`). The tab labels
 * are NOT written here for that reason: Figma names five (All, DWF,
 * Tournaments, Members, Development) and the feed's categories are a different
 * vocabulary, so a fixed list would print tabs that filter to nothing. Only
 * "All" is copy, because it is the one tab that is not a category.
 */

export const NEWS_ARCHIVE_COPY = {
  /** Names the section for assistive tech; the design has no visible heading. */
  heading: "Latest articles",

  /** The tab that clears the filter. `166:8379`. */
  allTab: "All",

  /** Names the tab strip for assistive tech. */
  filterLabel: "Filter articles by category",

  /** `166:8429` — the silver pill under the grid. */
  more: "View more",

  /**
   * The per-card link name. `%s` is the headline: the card is a stretched
   * anchor over a picture, a category, a date and a title, and without the
   * title in the name a screen reader hears six identical links.
   */
  readLabel: "Read %s",

  /** Shown when a category has nothing in it. */
  empty: "No articles filed under this category yet.",
} as const
