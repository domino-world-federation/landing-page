/**
 * S13 copy, kept out of JSX for i18n (RULES §9).
 *
 * Verbatim from Figma nodes `56:4683`, `56:4682` and `56:4685`.
 */

export const JOIN_COPY = {
  /**
   * Two entries because Figma breaks the line explicitly (`56:4683`), and the
   * break is the composition: two lines of equal weight, centred. Each entry
   * renders as its own line — the same treatment S4's headline gets, rather
   * than a `<br>` a translation would have to carry (RULES §9).
   */
  headline: ["Bring Your Nation", "To The World Stage"],
  body: "We are currently accepting applications for new associate and full member federations. Benefit from technical support, sanctioned event hosting, and global ranking integration.",
  cta: "Get In Touch",
  /** Still `#` — no contact page exists yet (blocker B2). */
  ctaUrl: "#",
} as const
