/**
 * Shared motion constants.
 *
 * Every entrance on the page reads from here, so "make it feel the same" is a
 * change in one file rather than a hunt through the sections.
 */

/**
 * The page's easing curve.
 *
 * This replaces the expo-out curve (`[0.22, 1, 0.36, 1]`) the sections started
 * with, and the reason is worth recording because it is not obvious: expo-out
 * is not merely *fast*, it is front-loaded. Sampled, it completes **40% of the
 * travel in the first 10% of the duration and 96% by the halfway point** — so
 * stretching `duration` does not soften it, it just adds dead time on the end
 * while the visible part of the move stays as abrupt as before. Its peak
 * velocity is 4.5× its average; the eye reads that spike as a snap.
 *
 * This curve carries 24% at 10% and 87% at the halfway point, with a peak of
 * 2.5× average — the steadiest of the candidates measured. It is still an
 * ease-*out*: it leaves immediately, unlike an in-out curve, which idles for
 * the first quarter (5% of travel at 25% of duration) and reads as lag when the
 * move is triggered by the reader's own scrolling.
 */
export const EASE = [0.25, 0.6, 0.35, 1] as const

/**
 * Seconds. The length of a standard entrance — a layer arriving, copy rising.
 * Long enough to be followed rather than merely noticed.
 */
export const DURATION = 1.4

/** Seconds. The step between staggered siblings, e.g. headline → body → button. */
export const STAGGER = 0.16
