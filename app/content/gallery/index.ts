/**
 * Gallery page copy — Figma node `156:7154` (RULES §9).
 *
 * The albums, their titles, their dates and their pictures are data
 * (`getGalleryAlbums`). What is left here is the page's own furniture.
 */

export const GALLERY_COPY = {
  title: ["Gallery"],

  /**
   * Figma prints "Last updated Aug 17, 2026" beside the title (`156:7158`) —
   * the same line the terms header carries. Stored ISO and formatted at render
   * like every other date on the site, rather than frozen as a spelling.
   */
  updatedAt: "2026-08-17T00:00:00Z",
  updatedLabel: "Last updated %s",

  /** `156:7160`. Figma writes "Search Event" — kept, because on this page the
   *  thing being searched really is an event rather than a picture. */
  searchPlaceholder: "Search Event",
  searchLabel: "Search gallery events",
  /**
   * There is no search endpoint (B2) and no client-side index — the page
   * renders whichever album the URL asks for, so nothing is loaded to match
   * against. D28: the control refuses in the open rather than appearing to look
   * and finding nothing.
   */
  searchUnavailable:
    "Search is not connected yet. Use the event list to browse the archive.",

  /** The tab that clears the filter (`156:7220`). */
  allTab: "All Events",
  /** Names the event column for assistive tech; the design gives it no heading,
   *  unlike the terms contents. */
  filterLabel: "Filter gallery by event",

  /** The 48px arrow beside an album heading (`156:7240`), and the round badge
   *  over one of its tiles (`156:7263`). Both open the album. `%s` is the
   *  album's title — four identical "open" links would otherwise be four
   *  identical links to a screen reader. */
  openAlbum: "View all photos from %s",

  /**
   * The name of the button covering a video, in the collage and on a
   * single-film album alike.
   *
   * This was `videoLabel: "Video: %s"` — a description, because there was
   * nothing to play (B2) and the tile was not a control. Both halves of that
   * have changed: the films are real and the tile opens them. "Play" rather
   * than "Open" because the press starts the film as well as the viewer, and
   * the verb a reader gets should be the one that says what they will hear
   * happen, not the dialog it happens inside.
   */
  playVideo: "Play %s",
  /**
   * The name of the button covering a photograph in the collage.
   *
   * "Open" rather than "View": the press opens a viewer over the page, and a
   * reader who cannot see the dialog appear needs the verb to say a thing
   * happened rather than describing what is already on screen.
   */
  openImage: "Open %s at full size",

  /** Shown when `?event=` names something the archive does not hold. */
  empty: "No album matches that event.",

  /**
   * The album's own page — Figma screen `523:9831`.
   *
   * A header with a back link and the album's title over the whole collage, no
   * event column beside it. The index filters in place with `?event=`; this is
   * the screen for looking at one event's pictures and nothing else, which is
   * where the heading arrow has always pointed.
   */
  detail: {
    /** The link above the title (`523:9837`), back to the archive. */
    back: "Back",
    backHref: "/gallery",
    /** `%s` is the album's title. */
    description:
      "Photographs and films from %s, filed by the Domino World Federation.",
  },
} as const
