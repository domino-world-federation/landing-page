/**
 * Media gallery copy — Figma node `168:8680` (RULES §9).
 *
 * The tiles are data (`getGalleryItems`); their alt text belongs to the
 * pictures and travels with them.
 */

export const NEWS_GALLERY_COPY = {
  /** `168:8684`. */
  heading: "Media gallery",

  /** The arrow beside the heading (`168:8685`) reads to the full gallery
   *  (`156:7154`), which is now a real route. */
  seeAll: "See all media",
  seeAllHref: "/gallery",

  /**
   * Video tiles carry a play badge in the design. There is nothing to play
   * (B2), so the badge stays as the decoration it is drawn as and the tile is
   * not a control — a play button that does nothing is the silent no-op D28
   * ruled out. This names the tile in the accessible listing instead.
   */
  videoLabel: "Video: %s",
} as const
