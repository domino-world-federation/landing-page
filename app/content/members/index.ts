/**
 * Members page copy — Figma screen `386:18480`, in the "Members" section of the
 * **updated** file (`xdogWlTYLSqwh2fBTmxPJi`). RULES §9.
 *
 * The federations and the hero figures are data (`getMemberFederations`,
 * `getMembershipStats`). Everything here is the page's own words.
 */

export const MEMBERS_COPY = {
  /** `401:19069` — Inter Medium 84, centred. This page opens on a full-bleed
   *  hero rather than the header band the other inner pages share, so the
   *  title is not run through `SharpeningHeadline`: Figma gives it no blur. */
  heroTitle: "Our Global Community",
  heroIntro:
    "Connecting 140+ national domino federations across six continents to standardize, promote, and celebrate the sport of dominoes.",
  /** `401:19093` — the gold pill. */
  heroCta: "Explore membership",
  heroCtaHref: "#membership-benefits",

  /** Names the map for assistive tech; the design gives it no visible heading. */
  mapLabel: "Where DWF members are",
  /**
   * The callout pinned over the map (`404:28268`). One city, drawn once — the
   * design's example of what a marker says rather than a list of them.
   */
  mapPinCity: "Jakarta, ID",
  mapPinTier: "National Members",
  /** Introduces the colour key under the map. */
  mapKeyLabel: "Membership tiers",
  /** Names the group of marker buttons on the map for assistive tech. */
  markersLabel: "Member locations",

  directoryHeading: "National Federation Members",
  /** `405:28519`. Leads to the full directory, which does not exist yet (B2),
   *  so it points at `#` the way the unbuilt nav entries do. */
  directoryCta: "View all",
  directoryCtaHref: "#",

  benefitsHeading: "Membership Benefits",

  processHeading: "Application process",
  processIntro:
    "A standardized 4-step pathway for national organizations to achieve DWF recognition.",

  ctaHeading: "Become part of our global federation membership",
  ctaIntro:
    "Bring your national federation into DWF to access international competitions, official recognition, and a growing global network.",
  ctaButton: "Contact us",
  ctaHref: "/contact",
} as const

/**
 * The colour key under the map (`404:28373`).
 *
 * **Drawn as a filter, built as a key.** Figma draws these as pill "menus" with
 * "Show All" selected, but the 57 markers are baked into one exported SVG
 * (`world-map-dots.svg`) with their tier colours already in them — there is no
 * marker data to filter, and there will not be until a backend has one (B2).
 * D28 settled what to do in that position: a control that cannot do its job is
 * not shipped looking like a control. So the tiers are presented as what the
 * design's own inner frames call them — a `legend` — and "Show All" is dropped,
 * because a key has nothing to show or hide.
 *
 * The counts come from the artwork itself: 5 continent, 34 national, 11
 * regional and 7 club markers, which is why the tiers are listed in that order
 * rather than the design's.
 */
export const MEMBERSHIP_TIERS = [
  {
    id: "national",
    label: "National Members",
    /** Matches the marker ring in `world-map-dots.svg`. */
    from: "#E1B762",
    to: "#EAD9B6",
  },
  { id: "regional", label: "Regional Members", from: "#AF68FF", to: "#E0B4FF" },
  { id: "club", label: "Club Members", from: "#4E9EFF", to: "#AAC7FF" },
  {
    id: "continent",
    label: "Continent Members",
    from: "#E51B5E",
    to: "#FF5F8F",
  },
] as const

/** The three cards (`405:28526`). Icons are 56px inside a 72px gold tile. */
export const MEMBERSHIP_BENEFITS = [
  {
    id: "events",
    title: "Sanctioned Events",
    body: "Full eligibility for national teams to compete in the World Domino Championships and regional qualifiers.",
    iconUrl: "/assets/members/icon-benefit-events.svg",
  },
  {
    id: "governance",
    title: "Governance & Voting",
    body: "Direct influence on global rules, standards, and federation policy during the Annual General Assembly.",
    iconUrl: "/assets/members/icon-benefit-governance.svg",
  },
  {
    id: "data",
    title: "Data & Infrastructure",
    body: "Access to the DWF player database, referee certification programs, and tournament management software.",
    iconUrl: "/assets/members/icon-benefit-data.svg",
  },
] as const

/**
 * The four steps (`406:363`).
 *
 * The numbers are strings rather than the position, unlike the legal documents'
 * clauses: Figma writes them "01".."04" as zero-padded labels in their own
 * colour and size, which is a design element rather than an ordinal the list
 * could generate.
 */
export const APPLICATION_STEPS = [
  {
    id: "documentation",
    number: "01",
    title: "Documentation",
    body: "Submit national bylaws, proof of non-profit status, and active player list.",
  },
  {
    id: "review",
    number: "02",
    title: "Review",
    body: "The DWF Membership Committee audits documents and federation history.",
  },
  {
    id: "provisional",
    number: "03",
    title: "Provisional",
    body: "12-month provisional membership awarded with full observer rights.",
  },
  {
    id: "ratification",
    number: "04",
    title: "Ratification",
    body: "Final vote by the General Assembly for full DWF Member status.",
  },
] as const
