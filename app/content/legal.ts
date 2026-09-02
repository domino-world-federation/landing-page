/**
 * The shape a legal document takes on this site.
 *
 * Terms & Conditions (`613:24310`) and the Privacy Policy (`613:23545`) are the
 * same screen with different clauses in it — same header, same contents column,
 * same translucent panel — so they share a type, a component and, since the
 * repo owner asked for it, a single route (D32/D43, on its second user).
 */

import { PRIVACY_COPY } from "~/content/privacy"
import { PRIVACY_SECTIONS } from "~/content/privacy/sections"
import { TERMS_COPY } from "~/content/terms"
import { TERMS_SECTIONS } from "~/content/terms/sections"

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

/** A whole document: its furniture, its clauses, and what search engines see. */
export type LegalDocument = {
  copy: LegalDocumentCopy
  sections: readonly LegalSection[]
  /** Written here rather than in the route, which no longer knows which one. */
  seo: { title: string; description: string }
}

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
 * The keys are the public URLs (`/page/terms`, `/page/privacy`), so they are
 * part of the site's addresses and not free to rename.
 */
export const LEGAL_DOCUMENTS: Readonly<Record<string, LegalDocument>> = {
  terms: {
    copy: TERMS_COPY,
    sections: TERMS_SECTIONS,
    seo: {
      title: "Terms & Conditions | Domino World Federation",
      description:
        "The terms of engagement for the Domino World Federation portal — member federation status, intellectual property, code of conduct, tournament participation, liability and governing law.",
    },
  },
  privacy: {
    copy: PRIVACY_COPY,
    sections: PRIVACY_SECTIONS,
    seo: {
      title: "Privacy Policy | Domino World Federation",
      description:
        "How the Domino World Federation captures, processes and preserves personal details — what is collected, how it is used, who it is shared with, and the rights registered members hold.",
    },
  },
} as const
