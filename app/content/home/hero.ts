/**
 * S2 hero copy, kept out of JSX for i18n (RULES §9).
 *
 * Wording is taken verbatim from Figma node `22:789`.
 */

export const HERO_COPY = {
  tagline: "Domino World Federation",
  headline: "Dominoes Without Borders",
  mission:
    "To unite the world through dominoes by connecting nations, growing the game, and setting fair global standards for every player.",
  accountability:
    "Designed and operates under a rigorous framework of accountability",
  primaryCta: "Explore Membership",
  /**
   * The federation directory. The hero's gold pill is the page's loudest
   * control and pointed at `#` until the destination was decided; it now goes
   * where the navbar's own "Federation Members" goes.
   */
  primaryCtaUrl: "/federation-members",
  secondaryCta: "Official Rules",
} as const

/**
 * Decorative layers carry `alt=""`, so these describe the one image that
 * actually conveys meaning.
 */
export const HERO_ALT = {
  dominoTile: "A black domino tile with gold pips",
} as const
