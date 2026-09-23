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
  headline: ["Join DWF Through", "Your National Federation"],
  body: "Contact your country's national federation to apply for DWF membership and obtain your DWF ID.",
  cta: "Get In Touch",
  /** Still `#` — no contact page exists yet (blocker B2). */
  ctaUrl: "#",
} as const
