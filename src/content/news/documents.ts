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

  /** `168:8478` — reads to the full press archive, which does not exist yet
   *  (B2), so it points at `#` the way the unbuilt nav entries do. */
  archiveLink: "View press archive",
  archiveHref: "#",

  /** The download pill's accessible name. `%1` is the title, `%2` the file
   *  type and size — "PDF (5.2 MB)" is printed, but a screen reader landing on
   *  four identical pills needs to hear which document each one is. */
  downloadLabel: "Download %1, %2",
} as const

export const NEWS_PUBLICATIONS_COPY = {
  /** `168:8584`. */
  heading: "Publications",
  downloadLabel: "Download %1, %2",
} as const
