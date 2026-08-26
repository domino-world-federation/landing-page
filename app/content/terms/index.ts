/**
 * Terms & Conditions furniture — Figma nodes `174:11163` (header) and
 * `174:11225` (the sidebar). The clauses themselves are in `sections.ts`.
 */

import type { LegalDocumentCopy } from "@/content/legal"

export const TERMS_COPY: LegalDocumentCopy = {
  title: ["Terms & Conditions"],

  /**
   * When the document last changed. Stored ISO and formatted at render, like
   * every other date on the site: Figma prints "Last updated Aug 17, 2026"
   * (`174:11166`), and freezing that spelling into the copy would leave the one
   * date on the page unable to follow the site's own format.
   */
  updatedAt: "2026-08-17T00:00:00Z",
  /** `%s` is the formatted date. */
  updatedLabel: "Last updated %s",

  /**
   * `174:11420`. Goes to the home page rather than `history.back()`: a reader
   * who opened this document from a search result has nothing to go back TO,
   * and a control that does nothing on a first visit is the silent no-op D28
   * ruled out.
   */
  back: "Back",
  backHref: "/",

  /** `174:11227`. */
  contentsTitle: "Table of Contents",
  /** Names the contents nav for assistive tech. */
  contentsLabel: "Terms and conditions sections",

  // The "Need Support?" card's words moved to `content/support-card.ts` when
  // the gallery turned out to draw the same card (D32/D43).

} as const
