/**
 * Overview copy — Figma node `84:753`, kept out of JSX for i18n (RULES §9).
 *
 * One fix against the design: `79:625` reads "…fairness across a borders",
 * where "a" is a stray article left over from an edit. Corrected to "all
 * borders" — the sentence is otherwise ungrammatical, and shipping a typo the
 * federation would have to ask us to fix is not fidelity.
 */

export type OverviewPillar = {
  id: string
  title: string
  body: string
}

export const OVERVIEW_COPY = {
  eyebrow: "Overview",
  heading: "Unifying the world piece by piece",
} as const

export const OVERVIEW_PILLARS: readonly OverviewPillar[] = [
  {
    id: "standardization",
    title: "Standardization",
    body: "Defining the universal rules of engagement, from professional tournament formats to casual community play, ensuring fairness across all borders.",
  },
  {
    id: "sanctioning",
    title: "Sanctioning",
    body: "The sole authority for recognizing world records, hosting World Championships, and ranking the elite practitioners of the game.",
  },
] as const
