/**
 * Structural Frameworks copy — Figma node `111:3152`, kept out of JSX for i18n
 * (RULES §9).
 *
 * The section is a PLACEHOLDER in the design and is built as one deliberately.
 * Figma draws a 1760 × 700 grey panel carrying an icon and a grey sentence
 * describing what the eventual org chart will show — it is the designer saying
 * "a diagram goes here", not a diagram. Inventing a chart of a federation whose
 * committee structure we have not been given would put fiction on an About page,
 * so the panel is reproduced as drawn and marked here instead.
 *
 * TODO(design): replace with the real organisational chart (blocker B2).
 */

export const FRAMEWORKS_COPY = {
  heading: "Structural Frameworks",
  /**
   * Two entries because Figma breaks the line itself (`113:3663`), centred in
   * an 864px column. Each renders as its own line.
   */
  placeholder: [
    "Our structure ensures clear accountability from the Executive Board through",
    "to Technical Committees and Member National Federations.",
  ],
} as const
