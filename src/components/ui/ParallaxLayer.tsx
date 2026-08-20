"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { useRef, type ReactNode } from "react"

import { cn } from "@/lib/utils/cn"

type ParallaxLayerProps = {
  children: ReactNode
  /**
   * Travel distance as a percentage of the layer's own height.
   * Small values read as distant (slow), large ones as close by.
   * Negative flips the direction — the layer rises as the page scrolls down.
   */
  speed?: number
  className?: string
  /** Decorative layer: hide it from screen readers (RULES §12). */
  decorative?: boolean
}

export function ParallaxLayer({
  children,
  speed = 20,
  className,
  decorative = false,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Scope the target to this element — without it the whole page counts
  // towards the progress and the effect lands off-mark (RULES §12).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed}%`])

  // The hooks stay unconditional; only the value we apply changes.
  // prefers-reduced-motion kills parallax ENTIRELY rather than slowing it —
  // the layer rests at its static position.
  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      aria-hidden={decorative || undefined}
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { y, willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  )
}
