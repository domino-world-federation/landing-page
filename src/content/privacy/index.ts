/**
 * Privacy Policy furniture — Figma nodes `174:11440` (header) and `174:10821`
 * (the contents column). The clauses themselves are in `sections.ts`.
 */

import type { LegalDocumentCopy } from "@/content/legal"

export const PRIVACY_COPY: LegalDocumentCopy = {
  title: ["Privacy Policy"],

  /** `174:11454` prints "Last updated Aug 17, 2026" — the same line the terms
   *  header carries, to the day. */
  updatedAt: "2026-08-17T00:00:00Z",
  updatedLabel: "Last updated %s",

  /**
   * `174:11445`. Goes to the home page rather than `history.back()`: a reader
   * who opened this document from a search result has nothing to go back TO,
   * and a control that does nothing on a first visit is the silent no-op D28
   * ruled out.
   */
  back: "Back",
  backHref: "/",

  /** `174:11103`. */
  contentsTitle: "Table of Contents",
  contentsLabel: "Privacy policy sections",
}
