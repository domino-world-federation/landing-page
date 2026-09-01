<script setup lang="ts">
/**
 * The full-bleed photograph that is pinned and then covered — About's
 * `112:3550`, Domino's `131:4818`, Development's `190:13660`, Governance's
 * `613:24893` and Integrity's `601:17851`.
 *
 * **Five components, one band.** Each page had its own copy of this file and
 * they were the same file: the same 44.27vw frame, the same 8% parallax, the
 * same `-inset-y-[6%]`, the same `sticky top-0 z-0`. What differed was the
 * `src`, the `alt`, and on one of them an opacity. Five copies of a construction
 * this fiddly is five places for it to drift — and it had already started to,
 * since only some of them carried `preload`.
 *
 * **`sticky`, not `relative`.** The picture holds the top of the screen while
 * the band below climbs over it, so it is revealed and then covered rather than
 * scrolled away. How far it stays is bounded by the wrapper the PAGE puts around
 * this and the section that covers it — sticky against `<main>` would leave the
 * picture pinned behind the whole document.
 *
 * The position utility lives here rather than being passed in as a class:
 * `relative` and `sticky` are both position utilities in the same Tailwind
 * layer, so which one won would be decided by their order in the generated sheet
 * rather than by the order they were written in.
 *
 * The wrapper is height-locked rather than sized by the image: the parallax
 * child is `absolute inset-0` and taller than its frame, so an auto-height
 * wrapper would collapse to nothing and the section would jump once the layer
 * mounted (RULES §12).
 */
withDefaults(
  defineProps<{
    src: string
    /** Never empty. These bands are not decoration — the heading above each one
     *  makes a claim and the picture is that claim happening. */
    alt: string
    /**
     * Development's band carries Figma's own `opacity: 0.8` (`190:13661`), which
     * sits it back from the header above it. Drawn as opacity rather than a
     * black wash on top for the reason S4 and S7 record about their baked
     * composites: a second layer would have to be positioned, and it would
     * darken the shadows twice while leaving the highlights where they were.
     */
    dim?: boolean
  }>(),
  { dim: false },
)
</script>

<template>
  <div class="sticky top-0 z-0 h-[56vw] overflow-hidden lg:h-[44.27vw]">
    <!-- Slow — 8% of its own height, the rate every band on this site trails the
         page at. A backdrop that keeps pace with the copy stops reading as being
         behind it. The layer is taller than the frame so there is something to
         travel into: at 8% the picture would otherwise pull its own bottom edge
         up into view.

         `priority`: each of these sits immediately below the fold and is the
         largest image on its page, so it is what LCP lands on for anyone who
         scrolls at all. -->
    <MotionParallaxLayer :speed="8" class="absolute inset-x-0 -inset-y-[6%]">
      <NuxtImg
        :src="src"
        :alt="alt"
        :sizes="SIZES_FULL_BLEED"
        preload
        loading="eager"
        fetchpriority="high"
        :quality="85"
        :class="cn('absolute inset-0 size-full object-cover', dim && 'opacity-80')"
      />
    </MotionParallaxLayer>
  </div>
</template>
