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
   * Video tiles carry a play badge in the design, and there is still nothing to
   * play (B2). What changed is that the tile is now a control: it opens the
   * picture at full size in the viewer below, which is a real thing to do and
   * the reason pressing it is no longer the silent no-op D28 ruled out. The
   * badge stays decoration — it marks which items are films, not a play button —
   * and the viewer says plainly that the film itself is not up yet.
   */
  videoLabel: "Video: %s",

  /** The lightbox — opened by pressing any tile in the collage. */
  viewer: {
    /** Names the dialog for assistive tech; `%s` is the picture's title. */
    label: "Media viewer — %s",
    closeLabel: "Close the media viewer",
    previous: "Previous picture",
    next: "Next picture",
    /** `%1` is the position, `%2` the total. */
    position: (current: number, total: number) => `${current} of ${total}`,
    /**
     * Said under a film's still. The stills are real; the films have nowhere to
     * be streamed from (B2), and a viewer that opened with a play control on it
     * would be promising one.
     */
    videoUnavailable: "Film not published yet — this is the still.",
  },
} as const
