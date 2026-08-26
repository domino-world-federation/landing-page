/**
 * Grassroots Initiatives copy — Figma node `192:14877`, kept out of JSX for
 * i18n (RULES §9).
 *
 * Copy rather than data. These are three named programmes the federation
 * describes in its own words alongside three commissioned photographs — the
 * same kind of thing About's mission cards are, and unlike the news feed or the
 * document shelf nothing adds a fourth without a page redesign (RULES §8).
 */

export const GRASSROOTS_COPY = {
  eyebrow: "Worldwide",
  heading: "Grassroots Initiatives",
} as const

export type GrassrootsCardCopy = {
  id: string
  /** The dim Bebas word above the title — the programme's family. */
  kicker: string
  title: string
  body: string
  image: string
  imageAlt: string
}

export const GRASSROOTS_CARDS: readonly GrassrootsCardCopy[] = [
  {
    id: "plaza",
    kicker: "Community",
    title: "Public Plaza Play",
    body: "Installing permanent, weather-resistant domino infrastructure in urban public spaces to encourage spontaneous play.",
    image: "/assets/development/grassroots-plaza.png",
    imageAlt:
      "An aerial view of a landscaped city plaza with curving planted beds, winding paths and circular seating",
  },
  {
    id: "rural",
    kicker: "Outreach",
    title: "Rural Outreach Kits",
    body: "Providing standardized equipment and simplified instructional materials to remote regions with limited access.",
    image: "/assets/development/grassroots-rural-kit.png",
    imageAlt:
      "An open field case with its contents held in place by orange straps, beside the closed grey box it ships in",
  },
  {
    // TODO(design): `192:14948` reuses the same "Community" text layer card one
    // carries (`192:14935`), which reads as a paste that was never changed — a
    // free digital platform is not the same family as permanent street
    // furniture. Reproduced as drawn rather than invented around, the same call
    // D40 makes about the duplicated committee office.
    id: "academy",
    kicker: "Community",
    title: "DWF Mobile Academy",
    body: "A free-to-use digital platform teaching the fundamentals of professional play through interactive puzzles.",
    image: "/assets/development/grassroots-mobile-academy.png",
    imageAlt:
      "Two hands holding a phone that shows a domino puzzle on a chequered board, lit by a table lamp",
  },
]
