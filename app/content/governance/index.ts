/**
 * `/governance` copy — Figma screen `613:24831` (RULES §9).
 *
 * The documents and the standing committees are data (`client.ts`); what lives
 * here is the page's own furniture — headings, eyebrows, and the prose the
 * design types into the page rather than into a record.
 */

export const GOVERNANCE_COPY = {
  /** `613:24833`, one entry per line — `SharpeningHeadline` takes the array and
   *  sweeps each line on its own, so the break has to be stated. */
  headerTitle: ["Transparency", "& Integrity"],
  /** `613:24835` — the line above the intro, at the title's baseline. */
  headerEyebrow: "Institutional Framework",
  headerIntro:
    "The Domino World Federation (DWF) operates under a rigorous framework of accountability, ensuring the sport's global expansion is managed with the highest ethical standards.",
  /** Figma types "Instituional Framework". The spelling is a typo of the kind
   *  D40 fixes — the word is "Institutional". */
  bandAlt:
    "Delegates seated in the federation's general assembly hall during a session",

  /** `613:24895` — the white band the photograph is covered by. */
  overview: {
    eyebrow: "Overview",
    heading: "Governance",
    mandateLabel: "Mandate",
    mandate:
      "The DWF is a non-profit association headquartered in Lausanne, Switzerland, governed by Articles 60 et seq. of the Swiss Civil Code.",
    missionLabel: "Mission",
    mission:
      "To promote, develop and govern the sport of dominoes globally while protecting its integrity through standardized rules and anti-doping protocols.",
  },

  committeesHeading: "Standing Committees",
  /** Names the committee list for assistive tech. */
  committeesLabel: "Standing committees of the federation",

  statutes: {
    heading: "Statutes & Constitution",
    intro:
      "The fundamental legal documents that define the DWF's structure, powers, and procedures.",
    /** The shelf these two documents are filed under. */
    category: "Statutes",
  },

  strategy: {
    heading: "Strategic Plan 2026 - 2029",
    /** `613:25119`. Figma repeats the members page's "A standardized 4-step
     *  pathway…" here, which is that page's sentence about joining the
     *  federation and says nothing about a strategic plan. Pasted, like the four
     *  identically-dated press releases and the Tokyo album's heading (D40), so
     *  it is replaced with a line about what the plan actually is. */
    intro:
      "Four years of work, set out year by year — from harmonizing the rules to standing for Olympic recognition.",
    label: "Strategic plan milestones",
  },

  repository: {
    eyebrow: "Library",
    heading: "Governance Repository",
    /** The shelf these six documents are filed under. */
    category: "Governance",
  },

  /** `%1` is the document title, `%2` its printed file description. */
  downloadLabel: "Download %s",
} as const

/**
 * The strategic plan's four years — `613:25133`.
 *
 * Copy rather than data: this is the federation stating its own plan in prose on
 * one page, not a record any other page reads or that a backend would serve. The
 * committees below it ARE data, because they are a list of standing bodies that
 * changes when the federation reorganizes.
 */
export const STRATEGY_MILESTONES = [
  {
    id: "2026",
    year: "2026",
    title: "Foundation",
    detail:
      "Global digitization of tournament scoring systems and rules harmonization.",
  },
  {
    id: "2027",
    year: "2027",
    title: "Inclusion",
    detail:
      "Launch of the 'Dominoes in Schools' global initiative and youth championship.",
  },
  {
    id: "2028",
    year: "2028",
    title: "Expansion",
    detail:
      "Establishment of 5 Regional Development Centers across South America and Asia.",
  },
  {
    id: "2029",
    year: "2029",
    title: "Recognition",
    detail:
      "Full Olympic recognized status and the inaugural Global Games of Dominoes.",
  },
] as const
