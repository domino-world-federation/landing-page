<script setup lang="ts">
import type { ShowcaseEvent } from "~/lib/api/types"
import { FEATURED_EVENT_COPY } from "~/content/home/featured-event"

/**
 * Seconds for one leg of the drift — out and back is twice this, so the card
 * completes a lap every four seconds. Brisk enough that the movement registers
 * while the card is being looked at, and still slow enough to read as breathing
 * rather than as a loading state.
 */
const DRIFT = 2

/**
 * The watermark's larger size. 3%, and deliberately tiny: it is a 365px mark
 * inside a 520px card, so a percent of it is a lot of travel on screen. It
 * starts at `1` — its design size — so the card rests at Figma's exact
 * composition and only ever swells away from it.
 */
const WATERMARK_MAX = 1.03

/**
 * Percent of its own height the trophy rides up and down. The photograph is
 * full-bleed and 720px tall, so 2% is ~14px at the design size — a drift, not a
 * bob, and small enough that its foot never lifts off the card's bottom edge.
 */
const TROPHY_RISE = -2

/**
 * The card in S6 — Figma node `52:3038`. A gold-lit panel, 520 × 720, holding
 * the federation watermark, the trophy, and the event's year across its foot.
 *
 * **The motion.** Two layers drift continuously and in step, and they drift the
 * SAME WAY: as the trophy rides up, the watermark behind it swells. Both run on
 * one duration from one shared resting pose, so the pair reads as a single
 * object breathing towards the viewer — put out of phase (the mark shrinking as
 * the hand rises) they pull apart and read as two layers taking turns instead.
 * Nothing else on the card moves — the type, the panel and the light streaks are
 * fixed, which is what keeps the drift legible as depth rather than wobble.
 *
 * It is a loop, not an entrance: `repeatType: "mirror"` runs the same tween
 * backwards on every other pass, so the ends meet exactly and there is no seam
 * where a restart would show. It only runs while the card is on screen —
 * `whileInView` hands control back to `animate` when it leaves, which parks both
 * layers at their resting values instead of leaving a timer burning against an
 * off-screen element.
 *
 * Only `transform` is animated, and `prefers-reduced-motion` stops the loop
 * entirely rather than slowing it (RULES §12) — through the transition, never by
 * branching the markup, which is what would break hydration.
 *
 * The layers are stacked in Figma's own child order: gradient panel, watermark,
 * photograph, wordmark, light streaks.
 */
defineOptions({ inheritAttrs: false })

const props = defineProps<{ event: ShowcaseEvent }>()

const attrs = useAttrs()
const passThrough = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const rootClass = computed(() =>
  cn(
    // 520 × 720 in Figma. The ratio is carried rather than the pixels, so the
    // card can shrink on a narrow screen without the artwork inside it
    // re-composing — every layer below is placed as a percentage of this box.
    "relative aspect-[520/720] w-full max-w-[520px] shrink-0 overflow-hidden",
    "rounded-glass bg-[radial-gradient(circle_at_117%_-2%,#c3ae86_0%,#4f4332_100%)]",
    attrs.class as string | undefined,
  ),
)

const prefersReducedMotion = useReducedMotion()

// Reduced motion collapses the TRANSITION and leaves the tree alone. Both sides
// render the same `initial`, and a zero-length tween lands the layers at rest
// before the first paint.
//
// `repeat: 0` is what actually stops the loop; the duration is zeroed too so
// there is not even a single pass to see.
const drift = computed(() =>
  prefersReducedMotion.value
    ? { duration: 0, repeat: 0 }
    : {
        duration: DRIFT,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror" as const,
        ease: "easeInOut" as const,
      },
)

// Where both layers sit when the card is off screen — their design values, so a
// card that has never been looked at is the still design exactly.
const rest = { duration: 0 }

const viewport = { once: false, amount: 0.35 } as const

/**
 * The four-digit year out of a formatted range like "Oct 12 - Oct 15, 2026".
 *
 * The last match, not the first: a range that straddles New Year carries two,
 * and the card should wear the year the event finishes in. Falls back to an
 * empty string, so a label the API formats differently leaves the wordmark
 * reading "DWF" rather than printing a fragment of the date.
 */
const eventYear = computed(
  () => props.event.dateLabel.match(/\d{4}/g)?.at(-1) ?? "",
)
</script>

<template>
  <div v-bind="passThrough" :class="rootClass">
    <!-- The federation mark ghosted into the panel — node `52:3042`. Decorative:
         the emblem is already spelled out by the logo in the navbar, so naming
         it here would only repeat it (RULES §7).

         The export already carries Figma's 8% IN ITS ALPHA CHANNEL — the PNG's
         peak alpha is 20/255 ≈ 0.078, measured, not assumed — so an
         `opacity-[0.08]` class on top of it multiplied out to ~0.6% and the mark
         disappeared, which is what it was doing. The layer stays fully opaque
         and lets the asset's own alpha do the work; no filter, so the mark keeps
         its own pale tone against the gold. -->
    <Motion
      as="div"
      aria-hidden="true"
      class="absolute top-[14.9%] left-[16.3%] h-[55%] w-[70.2%]"
      :initial="{ scale: 1 }"
      :animate="{ scale: 1, transition: rest }"
      :while-in-view="{ scale: WATERMARK_MAX, transition: drift }"
      :in-view-options="viewport"
      :style="{ willChange: 'transform' }"
    >
      <NuxtImg
        src="/assets/global/logo-dwf-watermark.png"
        alt=""
        :sizes='imageSizes({ xs: "60vw", lg: "27vw" })'
        class="absolute inset-0 size-full object-contain"
      />
    </Motion>

    <!-- The trophy — node `52:3046`. Figma stretches a 1792 × 2400 photograph
         into a 402 × 720 slot and crops it horizontally to the middle 75%
         (`cropTransform` x-scale 0.747, offset 0.126), which is what centres the
         trophy in the frame. `object-cover` on a box of the slot's own ratio
         reproduces that: the height fills and the sides are what get trimmed. -->
    <Motion
      as="div"
      class="absolute inset-y-0 left-[11.3%] w-[77.3%]"
      :initial="{ y: '0%' }"
      :animate="{ y: '0%', transition: rest }"
      :while-in-view="{ y: `${TROPHY_RISE}%`, transition: drift }"
      :in-view-options="viewport"
      :style="{ willChange: 'transform' }"
    >
      <NuxtImg
        :src="event.imageUrl"
        :alt="event.imageAlt"
        :sizes='imageSizes({ xs: "70vw", lg: "30vw" })'
        :quality="90"
        class="absolute inset-0 size-full object-cover object-top"
      />
    </Motion>

    <!-- "DWF2026" across the foot — node `52:3047`, Bebas 164 with a tight
         -4.88% tracking. The brand half is copy; the year is the event's, read
         off `dateLabel`, which is the only field in the contract that carries
         one. Hard-coding it would pin every card in the pager to the design's
         single year — and the design's own card is a 2024 event wearing a 2026
         mark, so there is no one right constant to pick.

         The size is a clamp on `vw` rather than Figma's 164px: the card is a
         fraction of the viewport at every breakpoint, so a fixed size would
         outgrow a narrow card. -->
    <span
      aria-hidden="true"
      class="font-display absolute bottom-[7.5%] left-0 w-full text-center text-[length:clamp(3rem,8.5vw,10.25rem)] leading-none tracking-[-0.0488em] text-white"
    >{{ FEATURED_EVENT_COPY.watermark }}{{ eventYear }}</span>

    <!-- Light streaks over the whole composition — node `52:3048`, drawn well
         outside the card and clipped by its `overflow-hidden`. Figma composites
         them with `plus-lighter`, which is `screen`-like: the SVG's own fills
         already carry the 25% opacity, so the blend is all that is needed to
         keep them additive rather than painting grey over the gold.

         A plain `<img>`: an SVG passes through the image pipeline unchanged
         (RULES §7), and positioning it directly keeps the -20%/-16.3%/166.5%
         overhang on one element instead of splitting the same geometry across a
         wrapper and its child. -->
    <img
      src="/assets/home/decor-card-streaks.svg"
      alt=""
      aria-hidden="true"
      width="946"
      height="756"
      class="pointer-events-none absolute top-[-20%] left-[-16.3%] w-[166.5%] max-w-none mix-blend-plus-lighter"
    >
  </div>
</template>
