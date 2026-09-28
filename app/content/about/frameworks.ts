/**
 * Our Global Network (was Structural Frameworks) — Figma node `1097:3096`,
 * kept out of JSX for i18n (RULES §9).
 *
 * The panel is the org chart the earlier placeholder (`111:3152`) held a place
 * for: the federation at the top, national federations under it, and each
 * federation's registered players and clubs under that. It is a diagram of the
 * STRUCTURE, not a directory — the design repeats one generic federation three
 * times, and so does this.
 *
 * The design labels all three "Country A", which is a card duplicated without
 * its label being touched; they read A, B, C here.
 */

export const FRAMEWORKS_COPY = {
  heading: "Our Global Network",
  /** Between the heading and the panel — the federation's revision
   *  (2026-09-28); the design has nothing there. */
  intro:
    "DWF brings National Federations together across five continents around a shared commitment to participation, respect, and fair competition.",

  chart: {
    apexShort: "DWF",
    apexName: "Domino World Federation",
    federation: "National Federation",
    countries: ["Country A", "Country B", "Country C"],
    members: "Federation Members",
    membersDetail: "Registered Players & Clubs",
  },

  /**
   * Under the chart (`1097:3100`). Two entries because Figma breaks the line
   * itself, centred in an 864px column; each renders as its own line.
   */
  caption: [
    "Our structure ensures clear accountability from the Executive Board through",
    "to Technical Committees and Member National Federations.",
  ],
} as const
