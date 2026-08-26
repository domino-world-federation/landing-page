/**
 * Executive Boards copy — Figma node `112:3590`, kept out of JSX for i18n
 * (RULES §9).
 *
 * Only the section's framing is here. The members themselves are data and come
 * through `lib/api/client.ts` (RULES §8): they take office and leave it, each
 * with a portrait of their own, and the carousel draws however many it is given.
 */

export const BOARDS_COPY = {
  heading: "Executive Boards",
  /** The strip has no visible label in the design, so it needs one spoken. */
  carouselLabel: "Executive board members",
  previous: "Previous board members",
  next: "Next board members",
  /**
   * Announced when the strip moves, so a screen-reader user is told the view
   * changed rather than only being able to discover it by arrowing through.
   */
  position: (current: number, total: number) =>
    `Showing member ${current} of ${total}`,
} as const
