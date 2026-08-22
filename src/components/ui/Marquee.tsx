"use client"

import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react"
import { useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils/cn"

/**
 * A strip that travels leftwards forever, pausing when the reader engages with
 * it.
 *
 * The loop is the ordinary two-copy trick: the children are rendered twice and
 * the track is translated from 0% to -50%, which lands the second copy exactly
 * where the first began, so the reset is invisible. That is why `children` must
 * be a complete set of items — a partial one makes the seam land mid-content.
 *
 * Only `transform` is animated, on one composited track rather than per item
 * (RULES §12), so the cost is the same whether the strip holds seven cards or
 * seventy.
 *
 * **Pausing is not a nicety here.** Text that never stops moving cannot be read
 * comfortably and a link that slides away cannot be clicked reliably, so the
 * track holds still on hover and whenever focus is anywhere inside it — the
 * latter is what makes the strip keyboard-operable at all, since tabbing
 * through moving links would otherwise chase them across the screen.
 */
export function Marquee({
  children,
  /** Seconds for one full pass. Larger is slower. */
  duration = 60,
  className,
  /** Names the region for assistive technology. */
  label,
}: {
  children: ReactNode
  duration?: number
  className?: string
  label: string
}) {
  const prefersReducedMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)

  // Reduced motion stops the strip completely rather than slowing it (RULES
  // §12) — and it does so through the ANIMATION VALUES, never by branching the
  // markup. `useReducedMotion()` is `null` on the server and `true`/`false` on
  // the client, so rendering a different tree for it makes the two disagree and
  // React discards the subtree instead of patching it (proven in S2). Both
  // cases render the same two copies and the same track; only whether the
  // position advances differs, and it starts at 0 either way, so the first
  // client paint matches the server byte for byte.
  const still = prefersReducedMotion || paused

  // The position is driven by hand rather than by `animate={{ x: "-50%" }}`,
  // and the reason is the pause. A declarative animation makes "paused" a
  // different TARGET, so hovering does not stop the strip — it sends it back to
  // wherever the paused state points. Measured on the first attempt: hovering
  // snapped x from -51 to 0, i.e. the strip jumped to the start under the
  // reader's cursor, which is the opposite of holding still to be read.
  //
  // Advancing a MotionValue per frame makes pausing mean *stop adding*, which
  // is what leaves it exactly where it was. It is still a single `transform` on
  // one composited track (RULES §12) — a MotionValue writes straight to the
  // style without a React render.
  const x = useMotionValue(0)
  // Progress through one lap, 0 → 1, kept separate from the pixel offset so the
  // wrap point does not depend on having measured the track.
  const progress = useRef(0)

  useAnimationFrame((_, delta) => {
    if (still) return
    // `delta` is milliseconds since the previous frame, so the travel is tied
    // to elapsed time rather than to frame count — a 120Hz screen and a
    // struggling phone move the strip at the same speed.
    progress.current = (progress.current + delta / (duration * 1000)) % 1
    // -50% of the track is exactly one copy of the children, so the wrap from
    // 1 back to 0 puts the second copy where the first was: no visible seam.
    x.set(-50 * progress.current)
  })

  // `x` is a plain number so the frame loop can do arithmetic on it; the track
  // needs a percentage, so the unit is attached here. Percent rather than px
  // keeps the loop correct without measuring: 50% of the track is always one
  // copy of the children, whatever the viewport does to the cards' widths.
  const translate = useMotionTemplate`${x}%`

  return (
    <div
      // `group` so the cards can react to hover on the strip as a whole.
      className={cn("group relative w-full overflow-hidden", className)}
      role="region"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      // Focus entering the strip stops it, so a keyboard reader can walk the
      // cards. `onFocus`/`onBlur` bubble in React, which is what makes this
      // work for the links nested inside.
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* No easing anywhere: the travel is linear by construction, one fixed
          increment per millisecond. An eased lap would surge and stall once per
          cycle, which reads as the strip stumbling rather than running. */}
      <motion.div
        className="flex w-max"
        style={{ x: translate, willChange: "transform" }}
      >
        {/* Both copies are wrapped identically. The -50% lands the second copy
            exactly where the first started, which only holds if the two halves
            measure the same — so the first cannot be bare flex children while
            the second sits in a wrapper, or the track's own gap would apply
            between the items of one half and not the other. */}
        <div className="flex shrink-0">{children}</div>
        {/* The second copy exists only to cover the gap the first leaves as it
            travels; it is the same content, so it is hidden from screen
            readers, which would otherwise announce every headline twice.
            `inert` as well as `aria-hidden`: the copy is full of links, and
            hiding a focusable element from the accessibility tree without also
            taking it out of the tab order strands a keyboard reader on a
            control their screen reader cannot describe. */}
        <div aria-hidden inert className="flex shrink-0">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
