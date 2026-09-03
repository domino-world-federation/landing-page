/**
 * Heritage section copy — Figma node `88:1163`, kept out of JSX for i18n
 * (RULES §9).
 *
 * **The milestones are here too, for now.** RULES §8 puts entities behind
 * `lib/api/client.ts` and these are entities — the federation keeps adding them,
 * and each has a year, a summary and a photograph of its own. But the CMS has no
 * `/heritage-milestones` endpoint yet, so served from a real API the section came
 * through empty: a heading over nothing. Static copy that is right beats a feed
 * that is not there.
 *
 * TODO(B2): move these back behind `getHeritageMilestones` once the endpoint
 * exists. `lib/api/mock` already re-exports this array, so the API path keeps
 * working and there is only ever one copy of the data.
 */
import type { HeritageMilestone } from "~/lib/api/types"

export const HERITAGE_COPY = {
  eyebrow: "Our Heritage",
  heading: "Decades of excellence",
  /** Screen-reader name for the strip; the design has no visible label for it.
   *  It doubles as the name of the scrollable region, so it has to say what
   *  moves rather than merely what it contains. */
  timelineLabel: "Federation milestones",
} as const

/**
 * The About page's heritage timeline (`88:1163`).
 *
 * The years come from the axis markers (`88:1172`, `88:1181`, `88:1190`,
 * `88:1199`) and the titles and photographs from the four cards, in the order
 * Figma places them along it.
 *
 * TODO(design): the first three cards carry the SAME body text in Figma
 * (`88:1205`, `88:1210`, `88:1215` are one shared text layer) — the Geneva
 * founding paragraph, which reads as card 1's and cannot be true of the 1990
 * World Cup or the 2001 accession. It is reproduced verbatim rather than
 * invented around, because inventing federation history is a worse error than
 * showing the design's own placeholder. Replace once the copy lands (B2).
 */
export const HERITAGE_MILESTONES: HeritageMilestone[] = [
  {
    id: "h1",
    year: "1974",
    title: "The Foundation",
    summary:
      "Representatives from 12 nations gathered in Geneva to formalize the first set of international rules and establish the DWF.",
    imageUrl: "/assets/about/heritage-card-01.webp",
    imageAlt:
      "Two men in early twentieth-century suits conferring across a roll-top desk in a wood-panelled office",
  },
  {
    id: "h2",
    year: "1990",
    title: "Inaugural World Cup",
    summary:
      "Representatives from 12 nations gathered in Geneva to formalize the first set of international rules and establish the DWF.",
    imageUrl: "/assets/about/heritage-card-02.webp",
    imageAlt:
      "A packed arena of competitors at long tables beneath World Domino Championship banners",
  },
  {
    id: "h3",
    year: "2001",
    title: "75 Countries Joined",
    summary:
      "Representatives from 12 nations gathered in Geneva to formalize the first set of international rules and establish the DWF.",
    imageUrl: "/assets/about/heritage-card-03.webp",
    imageAlt:
      "Delegates seated along both sides of a conference table before a row of national flags and press cameras",
  },
  {
    id: "h4",
    year: "2003",
    title: "DWF Championship World Tour",
    summary: "The First DWF Championship World Tour with 80 countries joined.",
    imageUrl: "/assets/about/heritage-card-04.webp",
    imageAlt:
      "Supporters in team colours with their arms raised, cheering in a crowd",
  },
]
