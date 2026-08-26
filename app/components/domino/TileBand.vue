<script setup lang="ts">
import { DOMINO_HEADER_ALT } from "~/content/domino/header"

/**
 * The full-bleed band under the header — Figma node `131:4824`.
 *
 * Structurally identical to `AuthorityBand`, and for the same reasons: the
 * wrapper is height-locked (44.27vw is 850/1920) because the parallax child is
 * `absolute inset-0` and taller than its frame, so an auto-height wrapper would
 * collapse to nothing and the section would jump once the layer mounted
 * (RULES §12). The negative vertical inset is the travel room — at 8% the
 * picture would otherwise pull its own bottom edge into view.
 *
 * Not decorative. The header claims dominoes is a sport of calculation and this
 * is two people calculating; a reader who cannot see it is told so.
 *
 * `priority`: it sits immediately below the fold and is the largest image on the
 * page, so it is what LCP lands on for anyone who scrolls at all.
 */
</script>

<template>
  <div class="relative h-[56vw] overflow-hidden lg:h-[44.27vw]">
    <MotionParallaxLayer :speed="8" class="absolute inset-x-0 -inset-y-[6%]">
      <NuxtImg
        src="/assets/domino/band-table-match.png"
        :alt="DOMINO_HEADER_ALT.band"
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
