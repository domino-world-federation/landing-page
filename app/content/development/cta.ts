/**
 * The page's closing CTA — Figma node `207:15320`, kept out of JSX for i18n
 * (RULES §9).
 */

export const DEVELOPMENT_CTA_COPY = {
  /**
   * Figma sets this across two lines inside a 1135px box. The break is not
   * stored: both the box and the type are sized in `vw`, so the line falls in
   * the same place on its own at every width, and a baked-in newline would
   * survive translation into a language that wants to break elsewhere.
   */
  heading: "Shape the future of dominoes",
  body: "We are currently accepting applications for new associate and full member federations. Benefit from technical support, sanctioned event hosting, and global ranking integration.",
  cta: "Contact us",
  /**
   * `#` while blocker B2 stands: there is no contact route yet, and pointing at
   * one that does not exist would give a 404 rather than a button that visibly
   * does nothing — the same call every other placeholder destination on the
   * site makes.
   */
  ctaHref: "/contact",
} as const
