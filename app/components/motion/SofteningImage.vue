<script setup lang="ts">
/**
 * An image that cross-fades between two blur levels.
 *
 * Blur is NOT animated — `filter` repaints the layer every frame, which
 * RULES §12 rules out. Instead two copies are stacked, each with a static blur,
 * and only their `opacity` cross-fades. The eye reads it as the image going soft
 * (or coming into focus); the compositor only ever sees an opacity change.
 *
 * Runs in both directions: rocks go sharp → soft as they retreat, the tile comes
 * soft → sharp as it arrives.
 *
 * A `to` of `"0px"` means the resting copy carries no `filter` property at all —
 * see `filterFor` below, and the hero tile, which is the layer that needed it.
 */
const props = withDefaults(
  defineProps<{
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
    /**
     * @nuxt/image's breakpoint-keyed syntax (`"xs:100vw lg:30vw"`), NOT the raw
     * media-query string `next/image` took. A key names the width its value
     * holds UP TO, and the largest key's value is the default from there on.
     */
    sizes?: string
    width?: number
    height?: number
    priority?: boolean
    quality?: number
    /** Applied to each copy — `object-contain` and the like. */
    imageClassName?: string
  }>(),
  { delay: 0, fill: false, priority: false, imageClassName: "" },
)

const prefersReducedMotion = useReducedMotion()

// The cross-fade has to rearm along with the scale it accompanies. They are one
// move: a rock that retreats without going soft again has already spent its
// focus change on the first visit, so the replay would show half of it.
const entered = useEntrance()

/**
 * A zero blur is written as NO filter at all, not as `blur(0px)`.
 *
 * The two are the same picture and not the same layer: any `filter` value puts
 * the element through a filter pass, which promotes it and has the compositor
 * rasterise the subtree into a texture of its own. On a high-DPI screen that
 * texture is where the extra pixels go missing — the image lands visibly softer
 * than the same image with no filter on it, which is what a resting `blur(0px)`
 * would have cost the hero tile for nothing.
 */
function filterFor(blur: string) {
  return Number.parseFloat(blur) === 0 ? undefined : `blur(${blur})`
}

// `next/image`'s `fill` had no prop equivalent here, so it is written out: the
// element is taken out of flow and stretched over its positioned ancestor,
// which is exactly what that prop did.
const imageClass = computed(() =>
  cn(
    props.fill ? "absolute inset-0 size-full" : "h-auto w-full",
    props.imageClassName,
  ),
)

// Reduced motion skips the cross-fade and shows the design's resting state
// immediately — but BOTH copies still render. Dropping one of them was the
// obvious version and it breaks hydration: the preference is `false` during SSR
// and `true` on a reducing client, so the server would send two copies and the
// client would want one. Keeping the markup identical and collapsing only the
// duration costs one extra decoded copy of an image the browser has already
// downloaded once — both copies resolve to the same URL, so it is a cache hit.
//
// No `ease` here on purpose: each copy sets its own below, and a cross-fade
// wants the pair rather than the page's transform curve.
const transition = computed(() =>
  prefersReducedMotion.value
    ? { duration: 0 }
    : { duration: props.duration, delay: props.delay },
)

// Winding back is quick and unstaggered, matching `ParallaxLayer`'s reset — the
// pair leaves together because they arrived together.
const reset = computed(() =>
  prefersReducedMotion.value ? { duration: 0 } : { duration: RESET_DURATION },
)

const fromAnimate = computed(() =>
  entered.value
    ? { opacity: 0, transition: { ...transition.value, ease: "easeIn" as const } }
    : { opacity: 1, transition: reset.value },
)

const toAnimate = computed(() =>
  entered.value
    ? { opacity: 1, transition: { ...transition.value, ease: "easeOut" as const } }
    : { opacity: 0, transition: reset.value },
)
</script>

<template>
  <!-- Starting copy. When not filling, this one is in flow and alone gives the
       wrapper its height. -->
  <Motion
    as="div"
    :class="fill ? 'absolute inset-0' : undefined"
    :initial="{ opacity: 1 }"
    :animate="fromAnimate"
    :style="{ filter: filterFor(from), willChange: 'opacity' }"
  >
    <NuxtImg
      :src="src"
      :alt="alt"
      :width="fill ? undefined : width"
      :height="fill ? undefined : height"
      :sizes="sizes"
      :quality="quality"
      :preload="priority || undefined"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      :class="imageClass"
    />
  </Motion>

  <!-- Resting copy, overlaid so the two register exactly. -->
  <Motion
    as="div"
    class="absolute inset-0"
    :initial="{ opacity: 0 }"
    :animate="toAnimate"
    :style="{ filter: filterFor(to), willChange: 'opacity' }"
  >
    <NuxtImg
      :src="src"
      :alt="alt"
      :width="fill ? undefined : width"
      :height="fill ? undefined : height"
      :sizes="sizes"
      :quality="quality"
      :preload="priority || undefined"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      :class="imageClass"
    />
  </Motion>
</template>
