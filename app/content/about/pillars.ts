/**
 * Pillars copy — Figma node `107:2847`, kept out of JSX for i18n (RULES §9).
 *
 * TODO(design): nodes `104:2798` and `106:2821` — the "Global Unity" and
 * "Next-Gen Infrastructure" blocks carry the *same* sentence in Figma. It reads
 * as a paste left over from laying out the third block, not as an intent.
 * Reproduced verbatim rather than invented around: inventing a sentence for a
 * federation to publish is worse than showing the one the design actually has
 * and marking it. Replace `next-gen`'s `body` when the real copy arrives.
 */

export type Pillar = {
  id: string
  eyebrow: string
  title: string
  body: string
}

export const PILLARS: readonly Pillar[] = [
  {
    id: "olympic",
    eyebrow: "Olympic Stage",
    title: "Olympic recognition",
    body: "Lobbying international sport committees to codify and integrate competitive dominoes into official global multi-sport events.",
  },
  {
    id: "cultural",
    eyebrow: "Cultural Connect",
    title: "Global Unity",
    body: "Bridging diverse cultural histories through a single harmonized set of rules and universally understood competitive formats.",
  },
  {
    id: "next-gen",
    eyebrow: "Digital Pieces",
    title: "Next-gen infrastructure",
    body: "Bridging diverse cultural histories through a single harmonized set of rules and universally understood competitive formats.",
  },
] as const

export const PILLARS_ALT = {
  /**
   * The photograph the section is built around (`106:2812`). It earns a real
   * description rather than `alt=""` because it is the first block's claim
   * made literal: the rings on a building, which is what "Olympic recognition"
   * would look like if the federation got it.
   */
  photo:
    "The Olympic rings mounted and lit on the facade of a white building at dusk",
} as const
