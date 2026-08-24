/**
 * Headquarters copy — Figma node `117:3846`, kept out of JSX for i18n
 * (RULES §9).
 *
 * The address, the mailbox and the number are placeholders in the design (the
 * Maison du Sport International is the IOC's building in Lausanne, not the
 * DWF's) and are reproduced as drawn. They are the kind of detail only the
 * federation can supply, and inventing an address for a governing body is worse
 * than showing the one the mock carries.
 *
 * TODO(design): confirm the three contact lines before publication (blocker B2).
 */

export type ContactLine = {
  id: string
  /** Path under `public/assets/global/`. */
  icon: string
  label: string
  /** Absent means the line is not actionable — an address is read, not opened. */
  href?: string
}

export const HQ_COPY = {
  headline: "Domino World Federation Headquarters",
  /** Not a link: the design draws a plain panel, and there is nowhere for a
   *  reader to go — the hours are the information. */
  hours: "Office hours: 09:00 - 17:00 CET",
} as const

export const HQ_CONTACT: readonly ContactLine[] = [
  {
    id: "address",
    icon: "/assets/global/icon-location.svg",
    label: "Maison du Sport International, Lausanne, Switzerland",
  },
  {
    id: "email",
    icon: "/assets/global/icon-mail.svg",
    label: "contact@dwf-domino.org",
    href: "mailto:contact@dwf-domino.org",
  },
  {
    id: "phone",
    icon: "/assets/global/icon-phone.svg",
    label: "+41 21 032 320 00",
    // Spaces stripped: `tel:` wants the dialable number, not the readable one.
    href: "tel:+412103232000",
  },
] as const

export const HQ_ALT = {
  /**
   * The same building S4 shows, and the same reasoning: it is the section's
   * subject rather than its backdrop — a headquarters page whose photograph is
   * the headquarters.
   */
  building:
    "The DWF headquarters, a concrete and glass building carrying the federation emblem above its entrance",
} as const
