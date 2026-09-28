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
  headerTitle: ["Governance", "& Integrity"],
  /** `613:24835` — the line above the intro, at the title's baseline. */
  headerEyebrow: "Our Approach",
  headerIntro:
    "DWF is committed to transparent governance, ethical standards, gender equality, and athlete representation in leadership and decision-making.",
  bandAlt:
    "Delegates seated in the federation's general assembly hall during a session",

  /** `613:24895` — the white band the photograph is covered by. */
  overview: {
    eyebrow: "Overview",
    heading: "Governance",
    roleLabel: "Our Role",
    role:
      "As the world governing federation for dominoes, DWF works to protect the spirit of the game while supporting its growth and encouraging participation worldwide.",
    commitmentsLabel: "Our Commitments",
    commitments:
      "DWF promotes fair competition and inclusion, adheres to the World Anti-Doping Code, and recognises the jurisdiction of the Court of Arbitration for Sport.",
  },

  committeesHeading: "Institutional Commitments",
  /** Names the commitment list for assistive tech. */
  committeesLabel: "Institutional commitments of the federation",

  statutes: {
    heading: "Governance Documents",
    intro:
      "Access DWF’s statutes, meeting minutes, election records, resolutions, and other official documents that support transparent and accountable governance.",
  },

  strategy: {
    heading: "Domino Agenda 2030 Strategic Plan",
    intro:
      "Through its long-term Domino Agenda 2030 Strategic Plan, DWF is building a sustainable future for dominoes focused on youth empowerment, education, accessibility, digital innovation, cultural preservation, and international competitions that promote peace, solidarity, friendship, and unity.",
  },

  /** `%1` is the document title, `%2` its printed file description. */
  downloadLabel: "Download %s",
} as const
