<script setup lang="ts">
import { DEVELOPMENT_HEADER_ALT } from "~/content/development/header"

/**
 * The full-bleed band under the header — Figma node `190:13660`.
 *
 * Not decorative, so it keeps a real `alt` and the layer is NOT `decorative`:
 * the heading above says the federation is growing the game and this is that
 * work happening. A reader who cannot see it is told what it is.
 *
 * The wrapper is height-locked (44.27vw is 850/1920) rather than sized by the
 * image. The parallax child is `absolute inset-0` and taller than its frame, so
 * an auto-height wrapper would collapse to nothing and the section would jump
 * once the layer mounted (RULES §12).
 *
 * **The 80% is Figma's, and it is on the picture rather than over it.** Node
 * `190:13661` carries `opacity: 0.8` with the page background showing through,
 * so the band sits back from the header above it. Drawn as opacity rather than
 * as a black wash on top for the reason S4 and S7 record about their baked
 * composites: a second layer would have to be positioned, and it would darken
 * the shadows twice while leaving the highlights where they were.
 *
 * `priority`: it sits immediately below the fold and is the largest image on the
 * page, so it is what LCP lands on for anyone who scrolls at all.
 */
</script>

<template>
  <div class="relative h-[56vw] overflow-hidden lg:h-[44.27vw]">
    <!-- Slow — 8% of its own height, the same rate S4's building and About's
         authority band trail the page at. A backdrop that keeps pace with the
         copy stops reading as being behind it.

         The layer is taller than the frame so there is something to travel into:
         at 8% the picture would otherwise pull its own bottom edge up into
         view. -->
    <MotionParallaxLayer :speed="8" class="absolute inset-x-0 -inset-y-[6%]">
      <NuxtImg
        src="/assets/development/band-classroom-session.png"
        :alt="DEVELOPMENT_HEADER_ALT.band"
        :sizes="SIZES_FULL_BLEED"
        preload
        loading="eager"
        fetchpriority="high"
        :quality="85"
        class="absolute inset-0 size-full object-cover opacity-80"
      />
    </MotionParallaxLayer>
  </div>
</template>
