/**
 * Pillars copy — Figma node `107:2847`, kept out of JSX for i18n (RULES §9).
 *
 * TODO(design): `566:13542` draws ONE photograph for the whole column. The repo
 * owner asked for a picture per claim, so the second and third are taken from
 * the site's own library — a team delegation for Global Unity, a broadcast
 * position for Next-gen infrastructure. Both are real photographs already
 * shipped with the site rather than invented files, and both are placeholders
 * for whatever the federation means these claims to be shown as.
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
  /** The photograph that stands beside this claim while it is being read. */
  imageUrl: string
  imageAlt: string
}

export const PILLARS: readonly Pillar[] = [
  {
    id: "olympic",
    eyebrow: "Olympic Stage",
    title: "Olympic recognition",
    body: "Lobbying international sport committees to codify and integrate competitive dominoes into official global multi-sport events.",
    imageUrl: "/assets/global/olympic-rings-facade.png",
    imageAlt:
      "The Olympic rings mounted and lit on the facade of a white building at dusk",
  },
  {
    id: "cultural",
    eyebrow: "Cultural Connect",
    title: "Global Unity",
    body: "Bridging diverse cultural histories through a single harmonized set of rules and universally understood competitive formats.",
    imageUrl: "/assets/global/gallery-team-delegation.png",
    imageAlt:
      "A national team delegation standing together in matching kit before a match",
  },
  {
    id: "next-gen",
    eyebrow: "Digital Pieces",
    title: "Next-gen infrastructure",
    body: "Bridging diverse cultural histories through a single harmonized set of rules and universally understood competitive formats.",
    imageUrl: "/assets/global/gallery-match-broadcast.png",
    imageAlt:
      "A match being broadcast from the hall floor, camera and monitors trained on the table",
  },
] as const
