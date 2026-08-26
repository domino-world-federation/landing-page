/**
 * All News copy — Figma node `185:13184` (RULES §9).
 *
 * The full archive: the news page's grid at two columns instead of three, with
 * the category filter moved into a side column and a "Back" link above the
 * title. The articles and their categories are data (`getLatestNews`).
 */

export const ALL_NEWS_COPY = {
  title: ["All News"],

  /**
   * `185:13190`. Goes to `/news` rather than `history.back()`: this page IS the
   * news page's archive, so it has a real parent to return to — unlike the
   * legal documents, whose "Back" can only mean the home page.
   */
  back: "Back",
  backHref: "/news",

  /** The tab that clears the filter (`185:13257`). Figma types it "All NEWS";
   *  the capitals are the row's, not the string's (D40). */
  allTab: "All news",
  /** Names the category column for assistive tech; the design gives it no
   *  heading, unlike the legal contents columns. */
  filterLabel: "Filter news by category",

  /** Shown when a category has nothing in it. */
  empty: "No articles filed under this category yet.",
} as const
