/**
 * Pillars copy — Figma node `107:2847`, kept out of JSX for i18n (RULES §9).
 *
 * "Why Dominoes?" — the federation's revision (2026-09-29). The section's
 * heading replaces the rolling counter the design drew, and the claims lost
 * the small kicker line each carried above its title.
 *
 * TODO(design): `566:13542` draws ONE photograph for the whole column. The repo
 * owner asked for a picture per claim, so each is taken from the site's own
 * library — placeholders for whatever the federation means these claims to be
 * shown as. The third is a chess match and should be the first replaced.
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
    imageUrl: "/assets/global/olympic-rings-facade.webp",
    imageAlt:
      "The Olympic rings mounted and lit on the facade of a white building at dusk",
  },
  {
    id: "connects",
    title: "A Game That Connects",
    body: "Dominoes brings people together across homes, clubs, communities, and generations.",
    imageUrl: "/assets/global/gallery-team-delegation.webp",
    imageAlt:
      "A national team delegation standing together in matching kit before a match",
  },
  {
    id: "depth",
    title: "Simple to Learn, Deep to Master",
    body: "The basics are easy to learn, while every match challenges players to think ahead, adapt, and make strategic decisions.",
    imageUrl: "/assets/global/gallery-match-broadcast.webp",
    imageAlt:
      "A match being broadcast from the hall floor, camera and monitors trained on the table",
  },
] as const

export const PILLARS_COPY = {
  /** Replaces the design's counter (the "0" above the column). */
  heading: "Why Dominoes?",
} as const
