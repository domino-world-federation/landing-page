<script setup lang="ts">
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
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /**
     * Upward travel in px — the element starts this far below its resting place
     * and rises into it.
     */
    y?: number
    /** `[from, to]` scale. */
    scale?: [number, number]
    /**
     * Starting blur, e.g. `"10px"`. The element comes into focus as it arrives.
     * Implemented as a cross-fade between two static copies, never as an
     * animated `filter` — see the note in the template.
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
  }>(),
  { y: 0, duration: DURATION, delay: 0, once: false },
)

const attrs = useAttrs()
const rootClass = computed(() => cn("relative", attrs.class as string | undefined))
const passThrough = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const prefersReducedMotion = useReducedMotion()

// Reduced motion collapses the TRANSITION, never the rendered tree. Branching
// `initial` — or which copies get rendered — would make the server and the
// hydrating client disagree, and Vue would warn and patch the subtree from
// scratch. That is the failure S2 hit and RULES §12 records. Both sides render
// the same markup and the same `initial`; only the duration differs, and
// `duration: 0` still lands everything at rest before the browser paints.
const enter = computed(() =>
  prefersReducedMotion.value
    ? { duration: 0 }
    : { duration: props.duration, delay: props.delay, ease: EASE },
)

const reset = computed(() =>
  prefersReducedMotion.value
    ? { duration: 0 }
    : { duration: RESET_DURATION, ease: "easeOut" as const },
)

const from = computed(() => ({
  opacity: 0,
  ...(props.y ? { y: props.y } : {}),
  ...(props.scale ? { scale: props.scale[0] } : {}),
}))

const to = computed(() => ({
  opacity: 1,
  ...(props.y ? { y: 0 } : {}),
  ...(props.scale ? { scale: props.scale[1] } : {}),
}))

// `amount` holds the entrance until enough of the element is on screen for the
// move to be seen — and, with `once: false`, it is also what rearms it: the
// element is considered gone once less than this much of it is visible.
const viewport = computed(() => ({ once: props.once, amount: 0.25 }))

// The transition rides INSIDE each target rather than on a `transition` prop,
// because the two directions want different timings — see `RESET_DURATION`.
// A single prop would apply to both.
//
// `animate` is the rest state the element falls back to when it is out of view,
// and it is the same values as `initial`. With `once`, `whileInView` never hands
// control back and the element simply stays where it landed.
const rest = computed(() => ({ ...from.value, transition: reset.value }))
const shown = computed(() => ({ ...to.value, transition: enter.value }))

const blurOut = computed(() => ({
  opacity: 0,
  transition: { ...enter.value, ease: "easeIn" as const },
}))
const sharpIn = computed(() => ({
  opacity: 1,
  transition: { ...enter.value, ease: "easeOut" as const },
}))
</script>

<template>
  <Motion
    as="div"
    v-bind="passThrough"
    :class="rootClass"
    :initial="from"
    :animate="rest"
    :while-in-view="shown"
    :in-view-options="viewport"
    :style="{ willChange: 'transform, opacity' }"
  >
    <template v-if="blurFrom">
      <!-- Two stacked copies, each with a STATIC blur, cross-fading — the same
           trick `SofteningImage` uses. Animating `filter` would repaint the
           layer every frame, which RULES §12 rules out; an opacity cross-fade
           is composited and reads identically as "coming into focus".

           The blurred copy is `aria-hidden` and the sharp one carries the real
           text, so assistive tech sees the content once. The sharp copy is the
           one in flow — it alone gives the wrapper its height, so nothing
           shifts when the blurred copy is finally at zero opacity. -->
      <Motion
        as="div"
        aria-hidden="true"
        class="pointer-events-none absolute inset-0"
        :initial="{ opacity: 1 }"
        :animate="{ opacity: 1, transition: reset }"
        :while-in-view="blurOut"
        :in-view-options="viewport"
        :style="{ filter: `blur(${blurFrom})`, willChange: 'opacity' }"
      >
        <slot />
      </Motion>

      <Motion
        as="div"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 0, transition: reset }"
        :while-in-view="sharpIn"
        :in-view-options="viewport"
        :style="{ willChange: 'opacity' }"
      >
        <slot />
      </Motion>
    </template>

    <slot v-else />
  </Motion>
</template>
