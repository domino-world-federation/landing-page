"use client"

import { useInView } from "motion/react"
import { createContext, useContext, useRef, type ReactNode } from "react"

/**
 * Whether the group's entrance should be playing.
 *
 * The default is `true` so a layer used outside any group behaves exactly as it
 * did before this existed: it plays on mount and stays put.
 */
const EntranceContext = createContext(true)

export const useEntrance = () => useContext(EntranceContext)

type EntranceGroupProps = {
  children: ReactNode
  /**
   * How much of the group must be on screen before the entrance plays — and,
   * below it, the point the group counts as gone and rearms.
   */
  amount?: number
  /** Play once and stay. The default rearms on every return. */
  once?: boolean
  className?: string
}

/**
 * Drives several layers' entrances from ONE viewport trigger.
 *
 * This exists because a composition is not the sum of its layers. Each layer
 * could watch itself — `Reveal` does, and for a single block of copy that is
 * right — but the hero's layers are three parts of one move, spread from the
 * top of the section to the bottom. Letting each one arm itself means the lower
 * rock, which is nearest the reader coming up from S3, crosses its own
 * threshold first and starts retreating while the tile above is still off
 * screen. The composition would then assemble bottom-up on a return visit and
 * top-down on load — the same three animations in a different order, which
 * reads as a different design.
 *
 * One ref, one `useInView`, one boolean handed down: every layer leaves at the
 * same instant and keeps the relative delays the design gives them.
 *
 * `useInView` is `false` on the server and on the client's first render, so both
 * sides paint the same starting state and the entrance begins in an effect —
 * the hydration-safe path RULES §12 requires. Nothing here branches the tree.
 */
export function EntranceGroup({
  children,
  amount = 0.5,
  once = false,
  className,
}: EntranceGroupProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount, once })

  return (
    <EntranceContext.Provider value={inView}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </EntranceContext.Provider>
  )
}
