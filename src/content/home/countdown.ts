/**
 * S3 countdown copy, kept out of JSX for i18n (RULES §9).
 *
 * Wording is taken verbatim from Figma node `24:1025`. The event's name, place
 * and date are NOT here — those are data and come from `lib/api/client`.
 *
 * There is no `alt` constant: the flag sits directly beside the place name it
 * stands for, so it is decorative and carries `alt=""` (RULES §7).
 */

export const COUNTDOWN_COPY = {
  label: "Upcoming Match",
  cta: "See Details",
  /** Keys are the render order of the three columns. */
  units: {
    days: "Days",
    hours: "Hours",
    mins: "Mins",
  },
  /**
   * Read out in place of the digits, which are hidden from screen readers —
   * announcing a number that changes every minute is noise. `{time}` is
   * filled in with something like "5 days, 13 hours, 42 minutes".
   */
  remaining: "Starts in {time}",
  started: "This match has started",
} as const
