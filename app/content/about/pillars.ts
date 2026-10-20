/**
 * Pillars copy — Figma node `107:2847`, kept out of JSX for i18n (RULES §9).
 *
 * "Why Dominoes?" — the federation's revision (2026-09-29). The section's
 * heading replaces the rolling counter the design drew, and the claims lost
 * the small kicker line each carried above its title.
 *
 * `566:13542` draws ONE photograph for the whole column. The repo owner asked
 * for a picture per claim, and the federation supplied one for each
 * (2026-10-20).
 */

export type Pillar = {
  id: string
  title: string
  body: string
  /** The photograph that stands beside this claim while it is being read. */
  imageUrl: string
  imageAlt: string
}

export const PILLARS: readonly Pillar[] = [
  {
    id: "accessible",
    title: "Accessible to All",
    body: "A set of tiles and a table are enough to begin. People of different ages, backgrounds, and abilities can take part.",
    imageUrl: "/assets/about/pillar-accessible.webp",
    imageAlt:
      "Players young and old seated around a green baize table, each with a row of tiles in front of them",
  },
  {
    id: "connects",
    title: "A Game That Connects",
    body: "Dominoes brings people together across homes, clubs, communities, and generations.",
    imageUrl: "/assets/about/pillar-connects.webp",
    imageAlt:
      "Four players seen from above around a green baize table, their tiles set out along each side",
  },
  {
    id: "depth",
    title: "Simple to Learn, Deep to Master",
    body: "The basics are easy to learn, while every match challenges players to think ahead, adapt, and make strategic decisions.",
    imageUrl: "/assets/about/pillar-depth.webp",
    imageAlt:
      "An older player gesturing to a younger one across the table, explaining the tiles laid out between them",
  },
] as const

export const PILLARS_COPY = {
  /** Replaces the design's counter (the "0" above the column). */
  heading: "Why Dominoes?",
} as const
