"use client"

import { motion, useReducedMotion } from "motion/react"
import Image from "next/image"

import { useEntrance } from "@/components/motion/EntranceGroup"
import { RESET_DURATION } from "@/lib/utils/motion"

/**
 * An image that cross-fades between two blur levels.
 *
 * Blur is NOT animated — `filter` repaints the layer every frame, which
 * RULES §12 rules out. Instead two copies are stacked, each with a static
 * blur, and only their `opacity` cross-fades. The eye reads it as the image
 * going soft (or coming into focus); the compositor only ever sees an
 * opacity change.
 *
 * Runs in both directions: rocks go sharp → soft as they retreat, the tile
 * comes soft → sharp as it arrives.
 *
 * A `to` of `"0px"` means the resting copy carries no `filter` property at all
 * — see `filterFor` below, and the hero tile, which is the layer that needed
 * it.
 */

type SofteningImageProps = {
  src: string
  /** Empty for a decorative layer, whose wrapper carries `aria-hidden`. */
  alt: string
  /** Starting blur, e.g. `"0px"`. */
  from: string
  /** The resting blur from the design, e.g. `"4px"`. */
  to: string
  /** Seconds, matched to the enclosing layer so both land together. */
  duration: number
  delay?: number
  /**
   * Fill the positioned parent instead of flowing at intrinsic size. Requires
   * `sizes`; `width`/`height` are then unused.
   */
  fill?: boolean
  sizes?: string
  width?: number
  height?: number
  priority?: boolean
  quality?: number
  /** Applied to each copy — `object-contain` and the like. */
  imageClassName?: string
}

export function SofteningImage({
  src,
  alt,
  from,
  to,
  duration,
  delay = 0,
  fill = false,
  sizes,
  width,
  height,
  priority = false,
  quality,
  imageClassName = "h-auto w-full",
}: SofteningImageProps) {
  const prefersReducedMotion = useReducedMotion()

  // The cross-fade has to rearm along with the scale it accompanies. They are
  // one move: a rock that retreats without going soft again has already spent
  // its focus change on the first visit, so the replay would show half of it.
  const entered = useEntrance()

  // A zero blur is written as NO filter at all, not as `blur(0px)`.
  //
  // The two are the same picture and not the same layer: any `filter` value
  // puts the element through a filter pass, which promotes it and has the
  // compositor rasterise the subtree into a texture of its own. On a high-DPI
  // screen that texture is where the extra pixels go missing — the image lands
  // visibly softer than the same image with no filter on it, which is what a
  // resting `blur(0px)` would have cost the hero tile for nothing.
  const filterFor = (blur: string) =>
    Number.parseFloat(blur) === 0 ? undefined : `blur(${blur})`

  const image = (
    <Image
      src={src}
      alt={alt}
      {...(fill
        ? { fill: true as const, sizes }
        : { width: width!, height: height! })}
      priority={priority}
      quality={quality}
      className={imageClassName}
    />
  )

  // Reduced motion skips the cross-fade and shows the design's resting state
  // immediately — but BOTH copies still render. Dropping one of them was the
  // obvious version and it broke hydration: `useReducedMotion` is `null` on
  // the server and `true` on a reducing client, so the server sent two copies
  // and the client wanted one. React cannot patch a difference in the tree
  // itself, so it discarded the hero and re-rendered it from scratch.
  //
  // Keeping the markup identical and collapsing only the duration costs one
  // extra decoded copy of an image the browser has already downloaded once —
  // `next/image` serves both from the same URL, so it is a cache hit.
  // No `ease` here on purpose: each copy sets its own below, and a cross-fade
  // wants the pair rather than the page's transform curve — see the note there.
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration, delay }

  // Winding back is quick and unstaggered, matching `ParallaxLayer`'s reset —
  // the pair leaves together because they arrived together.
  const reset = prefersReducedMotion
    ? { duration: 0 }
    : { duration: RESET_DURATION }

  return (
    <>
      {/* Starting copy. When not filling, this one is in flow and alone gives
          the wrapper its height. */}
      <motion.div
        className={fill ? "absolute inset-0" : undefined}
        initial={{ opacity: 1 }}
        animate={
          entered
            ? { opacity: 0, transition: { ...transition, ease: "easeIn" } }
            : { opacity: 1, transition: reset }
        }
        style={{ filter: filterFor(from), willChange: "opacity" }}
      >
        {image}
      </motion.div>

      {/* Resting copy, overlaid so the two register exactly. */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={
          entered
            ? { opacity: 1, transition: { ...transition, ease: "easeOut" } }
            : { opacity: 0, transition: reset }
        }
        style={{ filter: filterFor(to), willChange: "opacity" }}
      >
        {image}
      </motion.div>
    </>
  )
}
