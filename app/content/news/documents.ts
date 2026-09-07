/**
 * Copy for the two document shelves — Figma nodes `168:8475` (press releases)
 * and `168:8582` (publications). RULES §9.
 *
 * One file for both because they are one component drawn twice: a gold title
 * on the left, a wrapping list of white cards on the right. The only structural
 * difference is that the press shelf carries a link under its title and the
 * publications shelf does not, which is why `archiveLink` is optional rather
 * than a second copy file with a hole in it.
 *
 * The documents themselves are data — `getResources("Press Release")` and
 * `getResources("Publication")`, the same library the Domino and Development
 * pages read (RULES §8).
 */

export const NEWS_PRESS_COPY = {
  /** `168:8477`. Figma sets it in capitals; the gradient title does that in
   *  CSS, so the string keeps its own case (D40). */
  heading: "Press releases",

  /** `168:8478` — the link under the heading, to the full archive. It pointed
   *  at `#` while that page did not exist. */
  archiveLink: "View press archive",
  archiveHref: "/news/press-releases",

  /** The download pill's accessible name. `%1` is the title, `%2` the file
   *  type and size — "PDF (5.2 MB)" is printed, but a screen reader landing on
   *  four identical pills needs to hear which document each one is. */
  downloadLabel: "Download %1, %2",
} as const

/**
 * `/news/press-releases` — the archive the shelf's link opens.
 *
 * Not a screen in the file. The news page draws the shelf and a link out of it
 * (`168:8478`) and stops there, so this page follows the shape the site already
 * uses for "the full list of what a section shows four of": the header band
 * with a back link, then the same cards the shelf draws, unbounded.
 */
export const NEWS_PRESS_ARCHIVE_COPY = {
  title: ["Press Release Archive"],
  back: "Back",
  backHref: "/news",
  /** Shown before the federation has filed any press release. */
  empty: "No press release has been published yet.",
  description:
    "Every press release the Domino World Federation has published — statements, announcements and media notes, newest first.",
} as const

export const NEWS_PUBLICATIONS_COPY = {
  /** `168:8584`. */
  heading: "Publications",
  downloadLabel: "Download %1, %2",
} as const
