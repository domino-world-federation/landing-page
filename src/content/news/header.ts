/**
 * News page header copy — Figma node `156:7513`, kept out of JSX for i18n
 * (RULES §9).
 *
 * The band carries no intro paragraph, unlike About, Domino and Development.
 * That is the design's doing and it is not an oversight to correct: the search
 * field takes the slot the intro occupies on those pages, and a page whose
 * first control is a search box is telling the reader what it is without a
 * sentence about it.
 */

export const NEWS_HEADER_COPY = {
  /**
   * Rendered a word per line by `SharpeningHeadline`, which takes an array —
   * the break is the design's (`156:7521` sets one line, but the page title
   * token wraps it at every width below 1920 anyway).
   */
  title: ["Federation News"],

  /** The placeholder Figma prints in the field (`176:11862`). */
  searchPlaceholder: "Search News",

  /**
   * The field's own label. Not rendered — the design draws a placeholder and
   * a magnifier, no label — but a control with no accessible name is a control
   * a screen reader cannot describe, so it is attached with `sr-only`.
   */
  searchLabel: "Search news articles",

  /**
   * Said out loud when the form is submitted, through `role="status"`.
   *
   * There is no search endpoint (B2), and D28 settled what a control does in
   * that position: it refuses in the open. A box that silently does nothing is
   * a lie, and disabling it removes the shape the design drew.
   */
  searchUnavailable:
    "Search is not connected yet. The archive below lists every article we have published.",
} as const
