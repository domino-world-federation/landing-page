"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useRef, type ReactNode } from "react"

import { cn } from "@/lib/utils/cn"
import { useEntrance } from "@/components/ui/EntranceGroup"
import { EASE, RESET_DURATION } from "@/lib/utils/motion"

const ORIGINS = {
  top: "origin-top",
  bottom: "origin-bottom",
  center: "origin-center",
  topRight: "origin-top-right",
  bottomLeft: "origin-bottom-left",
}

/**
 * Where a layer's 0 → 1 scroll progress is measured from. `motion` does not
 * export the offset type, so it is read back off `useScroll`'s own options.
 */
type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"]

const ANCHORS: Record<"cross" | "top", ScrollOffset> = {
  /** Default: the layer animates while it crosses the viewport. */
  cross: ["start end", "end start"],
  /**
   * For a section already on screen at load (the hero). `cross` would put an
   * unscrolled page partway along the range, so the layer would render
   * pre-shifted — a top-anchored layer visibly detaches from the top edge.
   */
  top: ["start start", "end start"],
}

/**
 * An entrance played when the layer's `EntranceGroup` comes into view — or on
 * mount, if there is no group above it. Separate from the scroll parallax: `y`
 * rides a MotionValue in `style`, while these ride `animate`, so the two never
 * contend for the same property.
 */
type EnterProps = {
  /** `[from, to]` scale. Shrinking towards `origin` reads as receding. */
  scale?: [number, number]
  /** `[from, to]` opacity, for a layer that should arrive rather than sit. */
  opacity?: [number, number]
  /** `[from, to]` degrees. Positive counters the tilt baked into an asset. */
  rotate?: [number, number]
  /** Seconds. */
  duration?: number
  delay?: number
}

type ParallaxLayerProps = {
  children: ReactNode
  /**
   * Travel distance as a percentage of the layer's own height.
   * Small values read as distant (slow), large ones as close by.
   * Negative flips the direction — the layer rises as the page scrolls down.
   */
  speed?: number
  enter?: EnterProps
  /** The point `enter.scale` grows or shrinks towards. Defaults to centre. */
  origin?: keyof typeof ORIGINS
  anchor?: keyof typeof ANCHORS
  className?: string
  /** Decorative layer: hide it from screen readers (RULES §12). */
  decorative?: boolean
}

export function ParallaxLayer({
  children,
  speed = 20,
  enter,
  origin = "center",
  anchor = "cross",
  className,
  decorative = false,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Whether the enclosing `EntranceGroup` is on screen. `true` when there is no
  // group, which is what keeps a standalone layer playing on mount as before.
  const entered = useEntrance()

  // Scope the target to this element — without it the whole page counts
  // towards the progress and the effect lands off-mark (RULES §12).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ANCHORS[anchor],
  })

  // prefers-reduced-motion kills BOTH the parallax and the entrance rather
  // than slowing them (RULES §12) — but it does so through the TRANSITION,
  // never through the rendered tree. `useReducedMotion` is `null` on the
  // server (it reads a media query, which a server does not have) and `true`
  // on a client that prefers reduction, so any branch that swaps markup or
  // inline style makes the two disagree. React logged exactly that here —
  // "Hydration failed … this tree will be regenerated on the client" — and
  // threw the whole hero away to re-render it. Both sides now render the same
  // `initial` state and the same `style`; only the transition differs.
  //
  // Zeroing the travel is what disables the parallax. The output range is the
  // only part that changes, and at an unscrolled page both ranges resolve to
  // `0%`, so the first client render still matches the server byte for byte.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", prefersReducedMotion ? "0%" : `${speed}%`],
  )

  // The layer still has to LAND on the entrance's end state — that is where
  // the design puts it. `duration: 0` is how it gets there: motion starts
  // animations in a layout effect, so the values are already at rest before
  // the browser paints, and there is no movement to see.
  //
  // `animate` is driven by `entered`, so a layer inside a rearming group winds
  // back to its starting values when the group leaves and plays again when it
  // returns. The two directions carry their own transitions: arriving uses the
  // design's timing, leaving uses the short reset — the entrance is what the
  // reader is meant to watch, and rewinding it at the same pace would show them
  // the move twice, backwards the second time.
  const from = !enter
    ? {}
    : {
        ...(enter.scale ? { scale: enter.scale[0] } : {}),
        ...(enter.opacity ? { opacity: enter.opacity[0] } : {}),
        ...(enter.rotate ? { rotate: enter.rotate[0] } : {}),
      }

  const to = !enter
    ? {}
    : {
        ...(enter.scale ? { scale: enter.scale[1] } : {}),
        ...(enter.opacity ? { opacity: enter.opacity[1] } : {}),
        ...(enter.rotate ? { rotate: enter.rotate[1] } : {}),
      }

  const motionProps = !enter
    ? {}
    : {
        initial: from,
        animate: entered
          ? {
              ...to,
              transition: prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: enter.duration ?? 1.2,
                    delay: enter.delay ?? 0,
                    ease: EASE,
                  },
            }
          : {
              ...from,
              transition: prefersReducedMotion
                ? { duration: 0 }
                : { duration: RESET_DURATION, ease: "easeOut" as const },
            },
      }

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      aria-hidden={decorative || undefined}
    >
      {/* `relative size-full` so a child using next/image `fill` has a sized
          positioned ancestor — without it such a layer collapses to zero. */}
      <motion.div
        className={cn("relative size-full", ORIGINS[origin])}
        style={{ y, willChange: "transform, opacity" }}
        {...motionProps}
      >
        {children}
      </motion.div>
    </div>
  )
}
