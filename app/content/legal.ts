/**
 * The shape a legal document takes on this site.
 *
 * Terms & Conditions (`613:24310`) and the Privacy Policy (`613:23545`) are the
 * same screen with different clauses in it — same header, same contents column,
 * same translucent panel — so they share a type, a component and, since the
 * repo owner asked for it, a single route (D32/D43, on its second user).
 */


export type LegalSection = {
  /** Anchors the clause and the contents link that points at it. */
  id: string
  heading: string
  /**
   * Sanitised HTML, not plain text.
   *
   * The clauses are written in the backoffice's basic rich-text editor, whose
   * toolbar offers bold, italic, lists and links — and a flat string can carry
   * none of them. The server runs every clause through `Purifier` before
   * storing it, narrowed to that same list.
   *
   * This is also where the old `email` field went. A clause that ends on an
   * address now carries it as a `mailto:` link inside the HTML: one field
   * fewer, and one fewer thing that can be forgotten at render.
   */
  body: string
}

/** The furniture around the clauses — everything but the document itself. */
/**
 * Every document `/page/[key]` can serve, keyed by the segment that names it.
 *
 * **One route, not one page each.** `/terms` and `/privacy` were two files that
 * differed only in which two constants they imported, and a third document would
 * have been a third copy of the same eleven lines. The key IS the registry
 * lookup, so adding a document is adding an entry here — nothing under `pages/`
 * changes, and nothing can be added that the route does not already know how to
 * render.
 *
 * The keys are the public URLs (`/page/terms`, `/page/privacy-policy`), so they are
 * part of the site's addresses and not free to rename.
 */
/**
 * Perabot yang SAMA untuk tiap dokumen hukum.
 *
 * Dulu tiap dokumen membawa salinannya sendiri (`TERMS_COPY`,
 * `PRIVACY_COPY`) — dan keduanya identik kecuali judulnya. Judul, tanggal
 * revisi, dan klausanya sekarang datang dari API; yang tersisa di sini cuma
 * label antarmuka, yang memang milik situs dan bukan milik dokumennya.
 */
export const LEGAL_PAGE_CHROME = {
  /** `%s` is the formatted date. */
  updatedLabel: "Last updated %s",

  /**
   * `174:11420`. Goes to the home page rather than `history.back()`: a reader
   * who arrived from the footer of any page has no single "back" to return to.
   */
  back: "Back",
  backHref: "/",

  contentsTitle: "Contents",
  contentsLabel: "Clauses in this document",
} as const

export type LegalPageChrome = typeof LEGAL_PAGE_CHROME
