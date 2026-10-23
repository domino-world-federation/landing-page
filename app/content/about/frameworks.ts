/**
 * Structural Frameworks — Figma node `1097:3096`, kept out of JSX for i18n
 * (RULES §9).
 *
 * The DWF team's revision (2026-10-23) puts the federation's own org chart in
 * this section in place of "Our Global Network": four officers in a single line
 * of command, the President at the head, and the three bodies that report to
 * the last of them. The paragraph beside the heading and the caption under the
 * chart went with it — both described the national federations, which cannot
 * be listed yet.
 */

export const FRAMEWORKS_COPY = {
  heading: "Structural Frameworks",

  chart: {
    /** Top to bottom; the first is drawn in gold. */
    officers: ["President", "General Secretary", "Vice President", "Treasurer"],
    /** The row the last officer branches into, left to right. */
    bodies: [
      "Independent Committees",
      "Athlete’s Commission",
      "Standing Committees and Commissions",
    ],
  },
} as const
