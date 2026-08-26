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

/**
 * Seconds. How long a rearming entrance takes to return to its starting state
 * once it has left the viewport. Short, and with no delay of its own: this is a
 * reset, not an exit animation. The entrance is the thing worth watching;
 * rewinding it at the same pace would mean the reader watches the move leave as
 * well as arrive, and any stagger would replay backwards on the way out.
 *
 * Paired with `easeOut` rather than `EASE` wherever it is used — the page's
 * curve is shaped for a move that is meant to be followed, and this one is not.
 */
export const RESET_DURATION = 0.3

/**
 * Samples a cubic-bézier curve — the easing `CountUp` counts along.
 *
 * The React build imported `cubicBezier` from `motion/react`. `motion-v`
 * re-exports `framer-motion/dom`, which does not carry it: the function lives in
 * `motion-utils`, a transitive dependency this project does not declare. Twenty
 * lines of Newton–Raphson is a better trade than reaching through another
 * package's dependency tree for it, and it keeps the curve readable next to the
 * constant it samples.
 *
 * `x1`/`x2` are the control points' abscissae, `y1`/`y2` their ordinates — the
 * four numbers `EASE` holds, in the order CSS writes them.
 */
export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): (t: number) => number {
  // A cubic bézier with endpoints pinned at (0,0) and (1,1) reduces to this
  // polynomial in each axis; `a`/`b`/`c` are its coefficients.
  const calc = (t: number, p1: number, p2: number) => {
    const c = 3 * p1
    const b = 3 * (p2 - p1) - c
    const a = 1 - c - b
    return ((a * t + b) * t + c) * t
  }

  const slope = (t: number, p1: number, p2: number) => {
    const c = 3 * p1
    const b = 3 * (p2 - p1) - c
    const a = 1 - c - b
    return (3 * a * t + 2 * b) * t + c
  }

  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1

    // Solve x(t) = x for t. Eight iterations is well past convergence for the
    // curves used here; the guard is for the flat spots where the derivative
    // approaches zero and the step would blow up.
    let t = x
    for (let i = 0; i < 8; i += 1) {
      const error = calc(t, x1, x2) - x
      if (Math.abs(error) < 1e-6) break
      const derivative = slope(t, x1, x2)
      if (Math.abs(derivative) < 1e-6) break
      t -= error / derivative
    }

    return calc(t, y1, y2)
  }
}
