"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils/cn"
import { DURATION, EASE, RESET_DURATION } from "@/lib/utils/motion"

type RevealProps = {
  children: ReactNode
  /**
   * Upward travel in px — the element starts this far below its resting place
   * and rises into it.
   */
  y?: number
  /** `[from, to]` scale. */
  scale?: [number, number]
  /**
   * Starting blur, e.g. `"10px"`. The element comes into focus as it arrives.
   * Implemented as a cross-fade between two static copies, never as an animated
   * `filter` — see the note on the render below.
   */
  blurFrom?: string
  /** Seconds. Defaults to the page's shared entrance length. */
  duration?: number
  delay?: number
  /**
   * Play the entrance only the first time the element is seen. The default is
   * to rearm it: scroll the section away and back, and it plays again.
   */
  once?: boolean
  className?: string
}

/**
 * A one-off entrance played when the element scrolls into view.
 *
 * Distinct from `ParallaxLayer`, which fires on mount and then rides the scroll
 * position: this one waits. A section below the fold that starts on mount has
 * finished animating before anyone looks at it, so the entrance is spent on an
 * empty room — `whileInView` spends it when the section is read.
 *
 * Only `transform` and `opacity` are animated (RULES §12).
 */
export function Reveal({
  children,
  y = 0,
  scale,
  blurFrom,
  duration = DURATION,
  delay = 0,
  once = false,
  className,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion()

  // Reduced motion collapses the TRANSITION, never the rendered tree.
  // `useReducedMotion` is `null` on the server and `true` on a reducing client,
  // so branching `initial` — or which copies get rendered — would make the two
  // disagree, and React would throw the subtree away rather than patch it. That
  // is the failure S2 hit and RULES §12 records. Both sides render the same
  // markup and the same `initial`; only the duration differs, and `duration: 0`
  // still lands everything at rest before the browser paints.
  const enter = prefersReducedMotion
    ? { duration: 0 }
    : { duration, delay, ease: EASE }

  const reset = prefersReducedMotion
    ? { duration: 0 }
    : { duration: RESET_DURATION, ease: "easeOut" as const }

  const from = {
    opacity: 0,
    ...(y ? { y } : {}),
    ...(scale ? { scale: scale[0] } : {}),
  }

  const to = {
    opacity: 1,
    ...(y ? { y: 0 } : {}),
    ...(scale ? { scale: scale[1] } : {}),
  }

  // `amount` holds the entrance until enough of the element is on screen for
  // the move to be seen — and, with `once: false`, it is also what rearms it:
  // the element is considered gone once less than this much of it is visible.
  const viewport = { once, amount: 0.25 } as const

  // The transition rides INSIDE each target rather than on a `transition` prop,
  // because the two directions want different timings — see `RESET_DURATION`.
  // A single prop would apply to both.
  //
  // `animate` is the rest state the element falls back to when it is out of
  // view, and it is the same values as `initial`. With `once`, `whileInView`
  // never hands control back and the element simply stays where it landed.
  const rest = { ...from, transition: reset }
  const shown = { ...to, transition: enter }

  return (
    <motion.div
      className={cn("relative", className)}
      initial={from}
      animate={rest}
      whileInView={shown}
      viewport={viewport}
      style={{ willChange: "transform, opacity" }}
    >
      {blurFrom ? (
        // Two stacked copies, each with a STATIC blur, cross-fading — the same
        // trick `SofteningImage` uses. Animating `filter` would repaint the
        // layer every frame, which RULES §12 rules out; an opacity cross-fade
        // is composited and reads identically as "coming into focus".
        //
        // The blurred copy is `aria-hidden` and the sharp one carries the real
        // text, so assistive tech sees the content once. The sharp copy is the
        // one in flow — it alone gives the wrapper its height, so nothing
        // shifts when the blurred copy is finally at zero opacity.
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1, transition: reset }}
            whileInView={{ opacity: 0, transition: { ...enter, ease: "easeIn" } }}
            viewport={viewport}
            style={{ filter: `blur(${blurFrom})`, willChange: "opacity" }}
          >
            {children}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0, transition: reset }}
            whileInView={{
              opacity: 1,
              transition: { ...enter, ease: "easeOut" },
            }}
            viewport={viewport}
            style={{ willChange: "opacity" }}
          >
            {children}
          </motion.div>
        </>
      ) : (
        children
      )}
    </motion.div>
  )
}
