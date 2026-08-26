/**
 * The shape a legal document takes on this site.
 *
 * Terms & Conditions (`174:11162`) and the Privacy Policy (`174:10759`) are the
 * same screen with different clauses in it — same header, same contents column,
 * same white card, same 4px rules — so they share a type and a component rather
 * than each carrying a copy of both (D32/D43, on its second user).
 */

export type LegalSection = {
  /** Anchors the clause and the contents link that points at it. */
  id: string
  heading: string
  body: string
  /**
   * An address the clause ends on, appended as a `mailto:` and a full stop.
   *
   * Split out of `body` rather than left inside the sentence for two reasons: a
   * link cannot be built from the middle of a plain string, and a translator
   * handed a sentence with an email buried in it has to carry it across
   * unchanged while moving everything around it.
   *
   * Both documents close on one, and both are `contact@dwf-domino.org` — well
   * formed, unlike the footer's `community@dwf-org`, which is printed as text
   * because a mail link to an address that cannot receive mail is worse than
   * none.
   */
  email?: string
}

/** The furniture around the clauses — everything but the document itself. */
export type LegalDocumentCopy = {
  title: readonly string[]
  /** Stored ISO and formatted at render, like every other date on the site. */
  updatedAt: string
  /** `%s` is the formatted date. */
  updatedLabel: string
  back: string
  backHref: string
  contentsTitle: string
  contentsLabel: string
}
