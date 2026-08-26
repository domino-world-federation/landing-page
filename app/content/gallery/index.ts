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
   * Video tiles carry a play badge in the design. There is nothing to play
   * (B2), so the badge stays the decoration it is drawn as and the tile is not
   * a control — a play button that does nothing is the silent no-op D28 ruled
   * out. This names the tile in the accessible listing instead.
   */
  videoLabel: "Video: %s",

  /** Shown when `?event=` names something the archive does not hold. */
  empty: "No album matches that event.",
} as const
