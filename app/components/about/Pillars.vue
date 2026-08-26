<script setup lang="ts">
import { PILLARS_ALT } from "~/content/about/pillars"

/**
 * Seconds for one full pass of the column. Longer than Heritage's because each
 * block is a heading plus three lines rather than a card at a glance, and it is
 * the reading that sets the pace.
 */
const MARQUEE_SECONDS = 30

/**
 * Pillars — Figma node `107:2847`.
 *
 * The section's whole idea is the mask. Figma wraps the three blocks in a group
 * (`106:2846`) whose rectangle is transparent → white → white → transparent, so
 * the column fades out at both ends and only the middle is fully lit.
 *
 * It is a `mask-image` rather than two gradient overlays, and that is the only
 * version that works here: the page behind this is `--color-bg` in some places
 * and Vision's vignette in others, so an overlay would have to know what colour
 * it is covering. A mask removes the type instead of painting over it.
 *
 * The blocks then ride upward through that fixed window on a loop, so each one
 * lights as it reaches the middle and dissolves as it leaves the top. The mask
 * does not move; the column does — and it keeps going, so the three read as a
 * cycle rather than a list that ends.
 *
 * One CSS animation and a mask, no state and no listener.
 * `prefers-reduced-motion` is handled globally in `main.css` — the track lands
 * on -50%, where the second copy stands exactly where the first began, so a
 * reader who reduces motion sees a still column and not a half-scrolled one.
 */
const COLUMN_MASK =
  "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)"
</script>

<template>
  <section
    class="flex flex-col items-center gap-12 px-5 py-16 md:px-10 lg:flex-row lg:justify-between lg:gap-16 lg:px-20 lg:py-[4.17vw]"
  >
    <!-- The mask is on the OUTER element and the movement on the inner one.
         Reversed, the window would travel with the blocks and never fade
         anything — the point is that one is fixed and the other is not.

         The height is a fixed frame rather than the content's own, because the
         mask needs somewhere to fade: at `auto` the window is exactly as tall as
         the blocks and the falloff lands on their outer edges instead of
         part-way through them. 56.25vw is 1080/1920, the design's group.

         `group` so the column stops while the pointer is over it — three
         paragraphs sliding out from under someone reading them is the one real
         cost of a marquee. -->
    <div
      class="group h-[520px] w-full overflow-hidden lg:h-[56.25vw] lg:max-h-[1080px] lg:w-[42.71%]"
      :style="{ maskImage: COLUMN_MASK, WebkitMaskImage: COLUMN_MASK }"
    >
      <div
        class="flex flex-col group-hover:[animation-play-state:paused]"
        :style="{
          animation: `marquee-y ${MARQUEE_SECONDS}s linear infinite`,
          willChange: 'transform',
        }"
      >
        <!-- Twice, travelling -50%: at the end of the pass the second copy is
             standing where the first started, so the restart is invisible. Each
             copy carries its own trailing gap as padding — a gap placed between
             the two would make the halves unequal and the seam would show once
             per pass. -->
        <AboutPillarColumn />
        <AboutPillarColumn duplicate />
      </div>
    </div>

    <!-- 760 × 960 in Figma — a portrait frame, not the photograph's own 3:2, so
         it is `object-cover` and the crop is deliberate. 39.58vw is 760/1920. -->
    <div
      class="relative aspect-[3/4] w-full overflow-hidden rounded-[20px] lg:aspect-auto lg:h-[50vw] lg:max-h-[960px] lg:w-[39.58%]"
    >
      <NuxtImg
        src="/assets/about/pillars-olympic-rings.png"
        :alt="PILLARS_ALT.photo"
        :sizes="imageSizes({ xs: '100vw', lg: '40vw' })"
        :quality="85"
        class="absolute inset-0 size-full object-cover"
      />
    </div>
  </section>
</template>
