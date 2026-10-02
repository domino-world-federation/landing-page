<script setup lang="ts">
import { PLAYER_MEMBERSHIP_COPY } from "~/content/player-membership"

/**
 * The closing call — Figma `629:28647`, 1920 × 1080.
 *
 * The landing page's own S13 word for word, at this screen's larger type: Bebas
 * **126/132** here against the landing page's 126/132 as well, so the two agree
 * — `--text-display-md` is that size exactly and is what both take.
 *
 * It is NOT `HomeJoin`: since 2026-10-02 it has no button at all — the
 * federation removed this page's "Contact us" — so it closes on its paragraph.
 */
const COPY = PLAYER_MEMBERSHIP_COPY.cta

// Editable in the backoffice's page editor; the constants are the fallback.
const copy = usePageCopy("player-membership")
</script>

<template>
  <section
    aria-labelledby="player-cta-heading"
    class="relative flex flex-col items-center lg:snap-screen justify-center gap-8 px-5 py-20 text-center md:px-10 lg:gap-[3.33vw] lg:px-20 lg:py-[5.21vw]"
  >
    <div class="flex w-full flex-col items-center gap-6 lg:gap-[1.25vw]">
      <MotionReveal :y="40" class="w-full">
        <h2
          id="player-cta-heading"
          v-cms="'cta.headline'"
          class="font-display mx-auto max-w-[65.83vw] text-[length:var(--text-display-md)] leading-[1.0476] text-white uppercase max-lg:max-w-none"
        >
          <!-- A block per line so the design's break survives without a `<br>`
               a translation would have to carry (RULES §9). -->
          <span
            v-for="line in copy.lines('cta.headline', COPY.headline)"
            :key="line"
            class="block"
          >{{ line }}</span>
        </h2>
      </MotionReveal>

      <MotionReveal :y="32" :delay="STAGGER" class="w-full">
        <p
          v-cms="'cta.body'"
          class="font-sans mx-auto max-w-[40.83vw] text-base leading-8 text-white/70 text-balance max-lg:max-w-none lg:text-xl"
        >
          {{ copy.text('cta.body', COPY.body) }}
        </p>
      </MotionReveal>
    </div>

  </section>
</template>
