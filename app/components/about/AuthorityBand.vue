<script setup lang="ts">
import { ABOUT_HEADER_ALT } from "~/content/about/header"

/**
 * The full-bleed band under the header — Figma node `79:616`.
 *
 * Not decorative, so it keeps a real `alt` and the layer is NOT `decorative`:
 * the heading above claims a global authority and this is the people who hold
 * it. A reader who cannot see it is told what it is.
 *
 * The wrapper is height-locked (44.27vw is 850/1920) rather than sized by the
 * image. The parallax child is `absolute inset-0` and taller than its frame, so
 * an auto-height wrapper would collapse to nothing and the section would jump
 * once the layer mounted (RULES §12).
 *
 * `priority`: it sits immediately below the fold and is the largest image on the
 * page, so it is what LCP lands on for anyone who scrolls at all.
 */
</script>

<template>
  <div class="relative h-[56vw] overflow-hidden lg:h-[44.27vw]">
    <!-- Slow — 8% of its own height, the same rate S4's building trails the page
         at. A backdrop that keeps pace with the copy stops reading as being
         behind it.

         The layer is taller than the frame so there is something to travel into:
         at 8% the picture would otherwise pull its own bottom edge up into
         view. -->
    <MotionParallaxLayer :speed="8" class="absolute inset-x-0 -inset-y-[6%]">
      <NuxtImg
        src="/assets/about/authority-leadership-group.png"
        :alt="ABOUT_HEADER_ALT.band"
        :sizes="SIZES_FULL_BLEED"
        preload
        loading="eager"
        fetchpriority="high"
        :quality="85"
        class="absolute inset-0 size-full object-cover"
      />
    </MotionParallaxLayer>
  </div>
</template>
