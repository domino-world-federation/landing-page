/**
 * Overview copy — Figma node `84:753`, kept out of JSX for i18n (RULES §9).
 *
 * The copy is the federation's revision (2026-09-28), not the design's.
 */

export type OverviewPillar = {
  id: string
  title: string
  body: string
}

export const OVERVIEW_COPY = {
  eyebrow: "Overview",
  heading: "One World, One Game, One Global Family",
} as const

export const OVERVIEW_PILLARS: readonly OverviewPillar[] = [
  {
    id: "purpose",
    title: "Our Purpose",
    body: "To create opportunities for people to play, learn, compete, and connect through dominoes.",
  },
  {
    id: "approach",
    title: "Our Approach",
    body: "We promote participation, inclusion, fair competition, and respect for the game and everyone who plays it.",
  },
] as const
