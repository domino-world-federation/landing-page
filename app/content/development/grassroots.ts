/**
 * Grassroots Initiatives copy — Figma node `192:14877`, kept out of JSX for
 * i18n (RULES §9).
 *
 * Copy rather than data. These are three named programmes the federation
 * describes in its own words alongside three commissioned photographs — the
 * same kind of thing About's mission cards are, and unlike the news feed or the
 * document shelf nothing adds a fourth without a page redesign (RULES §8).
 *
 * **The kicker is gone**, on the repo owner's call. Figma puts a dim Bebas word
 * over each title — "Community", "Outreach", "Community" — and the third was a
 * `TODO(design)` here for exactly the reason the label did not survive: it
 * repeats the first card's word over a free digital platform, which is not the
 * same family as permanent street furniture. A label that names two of three
 * cards the same thing is not sorting them.
 */

export const GRASSROOTS_COPY = {
  eyebrow: "Worldwide",
  heading: "Grassroots Initiatives",
  viewAll: "View all",
  /**
   * The news archive, narrowed to the Development category.
   *
   * There is no archive of INITIATIVES — the three below are the whole of what
   * the federation has filed, and no screen in the design draws a listing of
   * them. What does exist is everything the federation has published about this
   * work, which is the same question asked a different way, and `/news/all`
   * already reads `?category=` from the URL (D50) so the filtered view is an
   * address rather than a state the button has to set up.
   *
   * The value has to match the feed's own spelling: `MOCK_NEWS` files these
   * under "Development", and `AllTabs` builds its strip from
   * `getNewsCategories()` — a mismatch here would land on the archive with a
   * filter that selects nothing rather than on the rows it names.
   */
  viewAllHref: "/news/all?category=Development",
} as const

export type GrassrootsCardCopy = {
  id: string
  title: string
  body: string
  image: string
  imageAlt: string
}

export const GRASSROOTS_CARDS: readonly GrassrootsCardCopy[] = [
  {
    id: "plaza",
    title: "Public Plaza Play",
    body: "Installing permanent, weather-resistant domino infrastructure in urban public spaces to encourage spontaneous play.",
    image: "/assets/development/grassroots-plaza.png",
    imageAlt:
      "An aerial view of a landscaped city plaza with curving planted beds, winding paths and circular seating",
  },
  {
    id: "rural",
    title: "Rural Outreach Kits",
    body: "Providing standardized equipment and simplified instructional materials to remote regions with limited access.",
    image: "/assets/development/grassroots-rural-kit.png",
    imageAlt:
      "An open field case with its contents held in place by orange straps, beside the closed grey box it ships in",
  },
  {
    id: "academy",
    title: "DWF Mobile Academy",
    body: "A free-to-use digital platform teaching the fundamentals of professional play through interactive puzzles.",
    image: "/assets/development/grassroots-mobile-academy.png",
    imageAlt:
      "Two hands holding a phone that shows a domino puzzle on a chequered board, lit by a table lamp",
  },
]
