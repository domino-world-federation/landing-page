<script setup lang="ts">
/**
 * The primary gold pill — Figma node `31:1117`, 340 × 72 at the 1920 canvas.
 *
 * Four things are gradients rather than colours, so none of them can be a plain
 * CSS property: the radial fill, the conic stroke, the label's vertical fall,
 * and the sheen. The stroke is the awkward one — `border-image` is the only
 * property that would take it, and it stops applying the moment `border-radius`
 * rounds the box. It is drawn by `.gold-cta-stroke` instead.
 *
 * Figma also parks a blurred white ellipse near the right edge (`56:4052`). That
 * is this button's highlight; here it travels instead of sitting still, which is
 * the same read with movement added.
 *
 * Only `transform` animates (RULES §11): the sheen is a static gradient on a
 * span that slides, not an animated `background-position`, which would repaint
 * the button every frame.
 */
defineOptions({ inheritAttrs: false })

defineProps<{ href: string }>()

const attrs = useAttrs()
const passThrough = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const rootClass = computed(() =>
  cn(
    // `h-16` below `lg`: the design's 72px comes from a 44px line box plus
    // 2 × 16px padding, but that arithmetic only holds at the 36px label. Once
    // the label steps down on a phone the same padding leaves the pill taller
    // than the design (76px measured), so the height is set directly and the
    // label centres inside it.
    "gold-cta-stroke rounded-pill shadow-glow font-display focus-visible:ring-gold relative flex h-16 items-center justify-center overflow-hidden bg-[image:var(--gradient-gold-cta-fill)] px-5 text-[length:var(--text-display-cta)] leading-none focus-visible:ring-2 focus-visible:outline-none lg:h-18",
    attrs.class as string | undefined,
  ),
)

const prefersReducedMotion = useReducedMotion()

// The sheen renders in both cases and is only held still when motion is reduced.
// Omitting the span outright was the earlier version and it breaks hydration:
// the preference is `false` during SSR and `true` on a reducing client, so the
// server would send the span and the client would not — a difference in the tree
// rather than in a value.
const sheenAnimate = computed(() =>
  prefersReducedMotion.value ? { x: 0 } : { x: ["0%", "400%"] },
)

const sheenTransition = computed(() =>
  prefersReducedMotion.value
    ? { duration: 0 }
    : {
        duration: 1.1,
        ease: "easeInOut" as const,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        repeatDelay: 0.4,
      },
)
</script>

<template>
  <NuxtLink :to="href" v-bind="passThrough" :class="rootClass">
    <!-- Parked off-canvas at `-left-1/2`, so a still sheen is invisible rather
         than a bright band across the pill. -->
    <Motion
      as="span"
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-white/55 to-transparent"
      :initial="{ x: 0 }"
      :animate="sheenAnimate"
      :transition="sheenTransition"
    />
    <!-- The label is a gradient too, so it is painted through the text and the
         glyphs themselves are transparent. -->
    <span
      class="relative bg-[image:var(--gradient-gold-cta-ink)] bg-clip-text text-transparent"
    >
      <slot />
    </span>
  </NuxtLink>
</template>
