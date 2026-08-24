/**
 * Heritage section copy — Figma node `88:1163`, kept out of JSX for i18n
 * (RULES §9).
 *
 * Only the section's own framing lives here. The milestones themselves are
 * data and come through `lib/api/client.ts` (RULES §8) — the federation keeps
 * adding them, and each is an entity with a photograph of its own.
 */

export const HERITAGE_COPY = {
  eyebrow: "Our Heritage",
  heading: "Decades of excellence",
  /** Screen-reader name for the strip; the design has no visible label for it.
   *  It doubles as the name of the scrollable region, so it has to say what
   *  moves rather than merely what it contains. */
  timelineLabel: "Federation milestones",
} as const
