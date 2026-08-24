/**
 * The "Need Support?" card — Figma nodes `174:11252` (terms) and `173:10083`
 * (gallery), which are the same card drawn twice, word for word.
 *
 * Lifted out of `content/terms/` when the gallery turned out to carry it too
 * (D32/D43: copy moves on its second reader, not on the guess that there will
 * be one). It sits at the root of `content/` beside the footer and the nav,
 * because like them it belongs to a component that several pages mount rather
 * than to any one page.
 *
 * Its paragraph is load-bearing beyond this card: it is the only sentence in
 * the whole design that says what a contact page is for, and `/contact` is
 * built from it (D54, R14).
 */

export const SUPPORT_CARD_COPY = {
  /** Figma breaks the heading across two lines explicitly; the break is kept
   *  because the card is a fixed narrow column and the two words balance. */
  title: ["Need", "Support?"],
  body: "Have a question or need assistance? Get in touch with our team for general enquiries, membership information, tournament support, partnerships, or media requests.",
  cta: "Contact us",
  href: "/contact",
} as const
