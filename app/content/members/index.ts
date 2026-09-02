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
  /** Names the filter strip under the map for assistive tech. */
  mapKeyLabel: "Filter members by tier",
  /** `404:28374` — the pill that clears the filter. */
  mapShowAll: "Show All",
  /** Spoken when the filter changes; the map has no other way to say what
   *  happened. `%1` is the tier, `%2` how many markers are left. */
  mapFilterStatus: (tier: string, count: number) =>
    `Showing ${count} ${tier}`,
  mapFilterAllStatus: (count: number) => `Showing all ${count} members`,
  /** Names the group of marker buttons on the map for assistive tech. */
  markersLabel: "Member locations",

  directoryHeading: "National Federation Members",
  /** Names the federation list for assistive tech. */
  directoryListLabel: "National federation members",
  /**
   * The record window's close button. A label rather than a bare glyph: the
   * button is an `×` and a screen reader has nothing to read off it.
   */
  detailCloseLabel: "Close federation record",
  /** `%s` is the federation — six rows all reading "Open" say nothing about
   *  which one a screen-reader user is on. */
  directoryOpenLabel: "Show details for %s",
  /** The detail card (`405:28394` redraw). */
  directoryDetail: {
    joined: (year: number) => `Joined since ${year}`,
    president: "President",
    headquarters: "Headquarters",
    contact: "Contact",
    /** `%s` is the federation. */
    websiteLabel: "Open the %s website",
  },
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
 * **A filter, as the design draws it.** This shipped as a flat colour key at
 * first, with "Show All" dropped, and the note here said why: the 57 markers
 * were baked into one exported SVG with their tier colours already in them, so
 * there was nothing to filter and D28 forbids shipping a control that cannot do
 * its job.
 *
 * That reasoning expired when `MAP_MARKERS` arrived. Every marker now carries
 * its own coordinates AND its tier, so the dots are drawn from data rather than
 * from the export — see `MapMarkers` — and the pills can do exactly what Figma
 * shows them doing. The stale note is kept here in outline because "we decided
 * this was impossible" is worth being able to date.
 *
 * Listed in the design's own order — continent, national, regional, club
 * (`404:28373`) — which is how the strip reads left to right. An earlier version
 * sorted them by marker count, which made the row disagree with the picture it
 * sits under for no reason a reader could name. The counts are 5, 34, 11 and 7
 * respectively, and the filter reports them.
 */
export const MEMBERSHIP_TIERS = [
  {
    id: "continent",
    label: "Continent Members",
    from: "#E51B5E",
    to: "#FF5F8F",
  },
  {
    id: "national",
    label: "National Members",
    /** Matches the marker ring in `world-map-dots.svg`. */
    from: "#E1B762",
    to: "#EAD9B6",
  },
  { id: "regional", label: "Regional Members", from: "#AF68FF", to: "#E0B4FF" },
  { id: "club", label: "Club Members", from: "#4E9EFF", to: "#AAC7FF" },
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
