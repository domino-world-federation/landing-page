<script setup lang="ts">
import type { UseScrollOptions } from "motion-v"

const ORIGINS = {
  top: "origin-top",
  bottom: "origin-bottom",
  center: "origin-center",
  topRight: "origin-top-right",
  bottomLeft: "origin-bottom-left",
} as const

/**
 * Where a layer's 0 → 1 scroll progress is measured from. `motion-v` does not
 * export the offset type on its own, so it is read back off `useScroll`'s
 * options — the same trick the React build used.
 */
type ScrollOffset = NonNullable<UseScrollOptions["offset"]>

const ANCHORS: Record<"cross" | "top" | "foot", ScrollOffset> = {
  /** Default: the layer animates while it crosses the viewport. */
  cross: ["start end", "end start"],
  /**
   * For a section already on screen at load (the hero). `cross` would put an
   * unscrolled page partway along the range, so the layer would render
   * pre-shifted — a top-anchored layer visibly detaches from the top edge.
   */
  top: ["start start", "end start"],
  /**
   * Finishes when the section's FOOT reaches the viewport's foot, rather than
   * when its head leaves the top.
   *
   * `cross` needs the section to exit upwards to reach progress 1, and the last
   * section on a page never does — the document simply runs out. Measured on
   * S7 while it was last: the page ended at 5100 and the section's own crossing
   * wanted 2040px of scroll, of which only 960 existed, so the layer stalled at
   * f≈0.5 and delivered half its travel with no way to reach the rest.
   *
   * This range spans exactly the scroll that always exists — the section
   * arriving and coming to rest fully in view — so the whole move is reachable
   * whether or not anything follows. When something does follow, the layer
   * settles while the section is still fully on screen and then rides out
   * static, which suits a full-bleed backdrop: the motion belongs to the
   * arrival, not to the exit.
   */
  foot: ["start end", "end end"],
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

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
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
    /** Decorative layer: hide it from screen readers (RULES §12). */
    decorative?: boolean
  }>(),
  { speed: 20, origin: "center", anchor: "cross", decorative: false },
)

const attrs = useAttrs()
const rootClass = computed(() => cn("relative", attrs.class as string | undefined))
const passThrough = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const root = useTemplateRef<HTMLDivElement>("root")
const prefersReducedMotion = useReducedMotion()

// Whether the enclosing `EntranceGroup` is on screen. `true` when there is no
// group, which is what keeps a standalone layer playing on mount as before.
const entered = useEntrance()

// Scope the target to this element — without it the whole page counts towards
// the progress and the effect lands off-mark (RULES §12).
const { scrollYProgress } = useScroll({
  target: root,
  offset: ANCHORS[props.anchor],
})

// prefers-reduced-motion kills BOTH the parallax and the entrance rather than
// slowing them (RULES §12) — but it does so through the TRANSITION, never
// through the rendered tree. `useReducedMotion` reads a media query, which is
// `false` during SSR and `true` on a client that prefers reduction, so any
// branch that swaps markup or inline style would make the two disagree and cost
// the whole hero a re-render. Both sides render the same `initial` and the same
// `style`; only the transition differs.
//
// Zeroing the travel is what disables the parallax. Written as a transformer
// rather than as a fixed output range so the preference is re-read on every
// frame instead of being frozen at setup; at an unscrolled page both resolve to
// `0%`, so the first client render still matches the server exactly.
const y = useTransform(
  scrollYProgress,
  (progress: number) =>
    `${progress * (prefersReducedMotion.value ? 0 : props.speed)}%`,
)

// The layer still has to LAND on the entrance's end state — that is where the
// design puts it. `duration: 0` is how it gets there: motion starts animations
// before the browser paints, so the values are already at rest and there is no
// movement to see.
//
// `animate` is driven by `entered`, so a layer inside a rearming group winds
// back to its starting values when the group leaves and plays again when it
// returns. The two directions carry their own transitions: arriving uses the
// design's timing, leaving uses the short reset — the entrance is what the
// reader is meant to watch, and rewinding it at the same pace would show them
// the move twice, backwards the second time.
const from = computed(() =>
  !props.enter
    ? {}
    : {
        ...(props.enter.scale ? { scale: props.enter.scale[0] } : {}),
        ...(props.enter.opacity ? { opacity: props.enter.opacity[0] } : {}),
        ...(props.enter.rotate ? { rotate: props.enter.rotate[0] } : {}),
      },
)

const to = computed(() =>
  !props.enter
    ? {}
    : {
        ...(props.enter.scale ? { scale: props.enter.scale[1] } : {}),
        ...(props.enter.opacity ? { opacity: props.enter.opacity[1] } : {}),
        ...(props.enter.rotate ? { rotate: props.enter.rotate[1] } : {}),
      },
)

const initial = computed(() => (props.enter ? from.value : undefined))

const animate = computed(() => {
  if (!props.enter) return undefined

  return entered.value
    ? {
        ...to.value,
        transition: prefersReducedMotion.value
          ? { duration: 0 }
          : {
              duration: props.enter.duration ?? 1.2,
              delay: props.enter.delay ?? 0,
              ease: EASE,
            },
      }
    : {
        ...from.value,
        transition: prefersReducedMotion.value
          ? { duration: 0 }
          : { duration: RESET_DURATION, ease: "easeOut" as const },
      }
})
</script>

<template>
  <div
    ref="root"
    v-bind="passThrough"
    :class="rootClass"
    :aria-hidden="decorative || undefined"
  >
    <!-- `relative size-full` so a child filling its parent has a sized
         positioned ancestor — without it such a layer collapses to zero. -->
    <Motion
      as="div"
      :class="cn('relative size-full', ORIGINS[origin])"
      :style="{ y, willChange: 'transform, opacity' }"
      :initial="initial"
      :animate="animate"
    >
      <slot />
    </Motion>
  </div>
</template>
