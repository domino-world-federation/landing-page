/**
 * `/player-membership` copy — Figma screen `629:28323`. Kept out of the
 * components for i18n (RULES §9).
 *
 * The page the navbar's Members dropdown has pointed at since the dropdown was
 * built, and the design draws it in full: what a DWF ID is, what it grants, who
 * may apply and how, ending on the site's closing call.
 *
 * **Two of the design's paragraphs are pasted from other screens**, and both are
 * marked below rather than reproduced. That is the D44 line — a card that says
 * one thing while the heading over it says another is a defect on the page, not
 * a variation to be preserved — and the same call `RULEBOOK_COPY` records for
 * the sets Figma never wrote.
 */

export const PLAYER_MEMBERSHIP_COPY = {
  hero: {
    /** `629:28460`, Inter Medium 84 centred. */
    title: "Your Global Domino Identity",
    /** `629:28461`, 812px wide at 60%. */
    body: "Get your official DWF ID, compete in recognized tournaments, build your international player profile, and become part of the global domino community.",
    /** `629:28480`. The hero's gold pill. */
    cta: "Apply for DWF ID",
    /**
     * Still `#` — there is no application form anywhere in the design or the
     * build, and the closing section's "Contact us" is where a reader asking to
     * apply is answered today. A destination that does not exist is worse than
     * one that is honestly unset (D28).
     */
    ctaUrl: "/contact",
  },

  whatIs: {
    /** `629:28538`, Bebas 100/108 in the gold fall. */
    heading: "What is DWF ID?",
    /** `629:28540`, Inter 36/44 centred. */
    lead: "One identity across the DWF ecosystem",
    /**
     * `629:28541`. Figma writes it as one text node with a blank line in it;
     * two entries here, because a paragraph break is structure rather than
     * whitespace and `<p>` is what says so.
     */
    body: [
      "A DWF ID is a unique membership number assigned to every verified player within the Domino World Federation network. It connects the player’s identity, tournament participation, ranking history, and federation membership in one official record.",
      "The ID may be required to register for selected DWF-sanctioned tournaments and access official player services.",
    ],
  },

  benefits: {
    /** `629:28543`. */
    heading: "Membership Benefits",
  },

  eligibility: {
    /** `629:28603`. */
    heading: "Who can apply",
    /**
     * TODO(design): `629:28605` holds the Development page's grassroots
     * paragraph — "Focus on core mechanics, etiquette, and basic mathematical
     * probability for school clubs" — which is about school programmes and says
     * nothing about who may hold an ID. Written here to introduce the list it
     * actually sits above; replace when the section's own copy exists.
     */
    intro:
      "Any player registered with a DWF member federation may apply. The application asks for the following.",
  },

  process: {
    /** `629:28623`. */
    heading: "Application process",
    /** `629:28625`. */
    intro:
      "Getting your DWF ID is simple. Submit your player information and required documents, complete the verification process, and receive your unique DWF ID once your application is approved.",
  },

  cta: {
    /**
     * `629:28649` — the same two lines the landing page closes on, and the same
     * paragraph under them. One entry per line, because the break is the
     * composition rather than the wrapping (RULES §9).
     */
    headline: ["Ready to Join?", "Start Your Journey with DWF"],
    body: "Bring your national federation into DWF to access international competitions, official recognition, and a growing global network.",
    /** `629:28652`. */
    cta: "Contact us",
    ctaUrl: "/contact",
  },
} as const

export type MembershipBenefit = {
  id: string
  iconUrl: string
  title: string
  body: string
}

/** `629:28544` — two rows of three, in the design's order. */
export const MEMBERSHIP_BENEFITS: readonly MembershipBenefit[] = [
  {
    id: "identity",
    iconUrl: "/assets/player-membership/icon-identity.svg",
    title: "Official Player Identity",
    body: "Receive a unique and verifiable DWF ID recognized across the DWF network.",
  },
  {
    id: "tournament-access",
    iconUrl: "/assets/player-membership/icon-tournament-access.svg",
    title: "Tournament Access",
    body: "Meet the membership requirement for eligible DWF-sanctioned competitions.",
  },
  {
    id: "player-profile",
    iconUrl: "/assets/player-membership/icon-player-profile.svg",
    title: "Global Player Profile",
    body: "Build an official record containing your federation, country, results, and achievements.",
  },
  {
    id: "ranking",
    iconUrl: "/assets/player-membership/icon-ranking.svg",
    title: "Ranking Recognition",
    body: "Collect eligible ranking points and appear in official DWF player rankings.",
  },
  {
    id: "development",
    iconUrl: "/assets/player-membership/icon-development.svg",
    title: "Development Opportunities",
    body: "Access selected player education, training, and community development programmes.",
  },
  {
    id: "community",
    iconUrl: "/assets/player-membership/icon-community.svg",
    title: "Global Community",
    body: "Connect with players, events, and member federations from around the world.",
  },
] as const

/** `629:28606` — what an application has to carry. */
export const ELIGIBILITY_REQUIREMENTS: readonly string[] = [
  "Valid government-issued identification",
  "Active email address and contact information",
  "Recent player photograph",
  "Country and national federation information",
  "Agreement to the DWF Code of Ethics and applicable regulations",
] as const

export type ApplicationStep = {
  id: string
  title: string
  body: string
}

/** `629:28626` — four steps, numbered by their position rather than in the data. */
export const APPLICATION_STEPS: readonly ApplicationStep[] = [
  {
    id: "submit",
    title: "Submit Application",
    /**
     * TODO(design): `629:28631` repeats "Valid government-issued
     * identification" from the requirements list two columns over, which
     * describes what to attach rather than what this step is. Written to
     * describe the step; replace when the design's own line exists.
     */
    body: "Send your player details and the supporting documents listed opposite.",
  },
  {
    id: "verification",
    title: "Identification",
    body: "DWF or the relevant national federation reviews the submitted information.",
  },
  {
    id: "approval",
    title: "Application Approval",
    body: "The player receives confirmation after all requirements have been fulfilled.",
  },
  {
    id: "issued",
    title: "DWF ID Issued",
    body: "The player receives a unique ID and an official digital player profile.",
  },
] as const

export const PLAYER_MEMBERSHIP_ALT = {
  /**
   * `629:28457`. The card is the page's subject — the thing being applied for —
   * so it is described rather than dropped.
   */
  card: "A DWF player identity card, the federation's emblem embossed across its face",
} as const
