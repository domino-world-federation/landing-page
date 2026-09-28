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
   * An array because the heading is drawn one line per entry — Figma broke the
   * design's longer heading itself (`107:2888`, at 100/108). The revised
   * heading fits on one.
   */
  heading: ["More Than a Game"],
  intro:
    "Our mission is to help people and communities grow through dominoes by expanding opportunities to participate, learn, connect, and compete.",
} as const

export const MISSION_CARDS: readonly MissionCardCopy[] = [
  {
    id: "excellence",
    icon: "/assets/about/icon-mission-excellence.svg",
    title: "Grow Participation",
    body: "Make dominoes more accessible to people of different ages, backgrounds, and abilities.",
  },
  {
    id: "community",
    icon: "/assets/about/icon-mission-community.svg",
    title: "Strengthen Communities",
    body: "Bring people together across cultures and generations through a shared love of the game.",
  },
  {
    id: "inclusion",
    icon: "/assets/about/icon-mission-inclusion.svg",
    title: "Support Learning",
    body: "Use dominoes to encourage strategic thinking, communication, resilience, and lifelong learning.",
  },
  {
    id: "integrity",
    /**
     * A group in Figma (`107:2956`) rather than a single glyph — the gold
     * plate and the mark on it are separate layers — so it is exported whole.
     */
    icon: "/assets/about/icon-mission-integrity.svg",
    title: "Protect the Game",
    body: "Promote respect, integrity, and fair competition at every level of participation.",
  },
] as const
