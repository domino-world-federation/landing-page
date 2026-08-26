<script setup lang="ts">
/** Seconds. Slower than the copy beside it — it is the larger object. */
const SETTLE = DURATION * 1.4

/**
 * One panel's figure — `272:15631` on the silver side, `272:15635` on the gold.
 *
 * **The numbers are fractions of a panel.** The section is 1920 padded 80 each
 * side, so each panel is 880 × 680. Figma puts the singles silhouette at x514
 * y80 sized 376 × 600, and the doubles pair at x−25 y80 sized 405 × 600 — the
 * second hanging off its panel's left edge so the two lean toward the join from
 * either side. Stated as percentages they hold that relationship as the panels
 * shrink; in pixels they would drift the moment the window left 1920.
 *
 * Figma stretches both to their boxes (`objectFit: fill`) rather than covering,
 * and the exports match those aspect ratios to three decimals, so `object-fill`
 * distorts nothing.
 *
 * The 40% opacity is Figma's. It is what keeps a full-height photograph behind a
 * paragraph readable, so it belongs on the layer rather than being something the
 * image was baked with — the asset is a clean silhouette and stays reusable.
 *
 * `max-lg:hidden` rather than a conditional render — the markup is identical on
 * both sides of the breakpoint, so nothing here can disagree between server and
 * client (RULES §12). The `xs` step in `sizes` is a single pixel for the same
 * reason: a `display:none` image is still a candidate the browser may fetch, and
 * naming a one-pixel width is how it is told not to bother below `lg`.
 */
defineOptions({ inheritAttrs: false })

defineProps<{ src: string; alt: string }>()

const attrs = useAttrs()
const rootClass = computed(() =>
  cn(
    "absolute bottom-0 opacity-40 max-lg:hidden",
    attrs.class as string | undefined,
  ),
)
</script>

<template>
  <div :class="rootClass">
    <!-- `SofteningImage` renders two stacked copies of its image, so an `alt` on
         it would be announced twice. The line below says the thing once — the
         same fix `Vision` uses. It cross-fades two static blurs rather than
         animating `filter` (RULES §12), and it moves nothing, which is why it
         can stay on a figure that has to keep its feet on the floor. -->
    <span class="sr-only">{{ alt }}</span>
    <MotionSofteningImage
      :src="src"
      alt=""
      from="10px"
      to="0px"
      :duration="SETTLE"
      fill
      :sizes="imageSizes({ xs: '1px', lg: '24vw' })"
      image-class-name="object-fill"
    />
  </div>
</template>
