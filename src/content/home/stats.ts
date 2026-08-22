/**
 * S5 copy (RULES §9).
 *
 * The figures themselves are NOT here — they come from the API through
 * `getFederationStats()`, labels included, because a number that changes is
 * data rather than copy. What is left is the text the section needs around
 * them.
 */
export const STATS_COPY = {
  /**
   * Names the section for assistive tech. Not rendered: the design has no
   * visible heading here, and inventing one would put a word on the page the
   * designer did not ask for.
   */
  heading: "The federation in numbers",
} as const
