/**
 * `/tournaments/[slug]` copy — Figma screen `517:1895` (RULES §9).
 *
 * The tournament is data (`client.ts`); the headings, the labels beside the
 * hero's two facts, and the words on the controls live here.
 */

export const TOURNAMENT_DETAIL_COPY = {
  back: { label: "Back", href: "/tournaments/all" },

  /** The two facts in the hero's info bar (`517:1915`, `517:1918`). */
  dateLabel: "Date",
  locationLabel: "Location",

  /** `517:1921`. */
  notify: "Notify me",
  /** `%s` is the tournament — five pages of buttons all reading "Notify me"
   *  tell a screen-reader user nothing about which one they are on. */
  notifyLabel: "Get reminders about %s",
  register: "Register",
  registerLabel: "Register for %s",
  watchLive: "Watch live",
  watchLiveLabel: "Watch %s live",
  /** No entry form, no stream and no portal to host either (B2, phase 2), so
   *  the button refuses in the open rather than navigating nowhere (D28). */
  unavailable: "Entries open through the portal — coming soon.",

  venue: {
    /** Names the venue photograph's region for assistive tech. */
    label: "Venue",
    addressLabel: "Address",
  },

  prize: { label: "Prize pool" },

  /** The white document card's five blocks (`517:2046` and siblings). */
  overview: {
    heading: "Tournament Overview",
    eligibility: "Eligibility & Registration",
    schedule: "Schedule",
    format: "Tournament Format",
    regulations: "Regulations & Rule",
    /** `%s` is the document title — `ui/ResourceCard` stretches one link over
     *  the whole card, so the accessible name is the title alone. */
    downloadLabel: "Download %s",
    /** `517:2155` prints "Published on May 12, 2025". */
    publishedOn: "Published on %s",
  },

  support: {
    contactHeading: "Contact",
    emailLabel: "Email the federation",
    phoneLabel: "Call the federation",
    contactCta: "Contact us",
    contactHref: "/contact",
    officialsHeading: "Officials & Referees",
    officialsLabel: "Officials and referees appointed to this tournament",
  },

  winners: {
    heading: "Results & Winners",
    /** Read out with the card, so a screen-reader user gets the placing as a
     *  sentence rather than as a word floating above two portraits. */
    label: "%1 — %2, %3",
  },

  /** Said when a slug names nothing. */
  notFound: "That tournament is not in the calendar.",
} as const
