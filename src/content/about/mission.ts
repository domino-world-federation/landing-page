/**
 * Mission copy — Figma node `107:2997`, kept out of JSX for i18n (RULES §9).
 */

export type MissionCardCopy = {
  id: string
  /** Path under `public/assets/about/`. The icon repeats the card's title as a
   *  picture, so it renders `alt=""` and stays out of the reading order. */
  icon: string
  title: string
  body: string
}

export const MISSION_COPY = {
  eyebrow: "Our Mission",
  /**
   * Two entries because Figma breaks the line itself (`107:2888`, at 100/108)
   * rather than letting the 1920 column decide. Each entry is its own line.
   */
  heading: ["Providing the platform", "for uncompromising competition"],
  intro:
    "Our mission is to establish, regulate, and systematically promote competitive dominoes on a global scale.",
} as const

export const MISSION_CARDS: readonly MissionCardCopy[] = [
  {
    id: "excellence",
    icon: "/assets/about/icon-mission-excellence.svg",
    title: "Promote Excellence",
    body: "Sanctioning elite world championships, formalizing global rankings, and recognizing historic master records.",
  },
  {
    id: "community",
    icon: "/assets/about/icon-mission-community.svg",
    title: "Build Community",
    body: "Encouraging inter-generational tournament formats that unify local clubs and preserve competitive heritage.",
  },
  {
    id: "inclusion",
    icon: "/assets/about/icon-mission-inclusion.svg",
    title: "Foster Inclusion",
    body: "Delivering educational kits and resource packages directly to national associations to grow inclusive regional play.",
  },
  {
    id: "integrity",
    /**
     * A group in Figma (`107:2956`) rather than a single glyph — the gold
     * plate and the mark on it are separate layers — so it is exported whole.
     */
    icon: "/assets/about/icon-mission-integrity.svg",
    title: "Ensure Integrity",
    /** Figma reads "on all contents" (`107:2962`); "continents" is what the
     *  sentence means, and the other three cards all speak geographically. */
    body: "Enforcing clean, drug-free play, standardized rules, and unbiased technical commissions on all continents.",
  },
] as const
