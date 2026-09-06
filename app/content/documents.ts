/**
 * The one sentence every document link owes a reader who cannot see it.
 *
 * Document links open the file in a NEW TAB, and a link that moves the reader
 * somewhere they did not ask to go has to say so before they follow it —
 * otherwise the first sign is a Back button that no longer works. Sighted
 * readers get the same warning from the tab appearing; this is that warning for
 * everyone else.
 *
 * Kept in one place rather than appended to the nine `downloadLabel` strings
 * that already exist: it is the same sentence in all nine, and nine copies is
 * eight chances for them to drift apart.
 */
export const DOCUMENT_LINK_COPY = {
  /** Appended to a document link's accessible name. */
  newTab: "opens in a new tab",
} as const
