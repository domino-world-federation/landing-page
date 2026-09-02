<script setup lang="ts">
import { PLAYER_MEMBERSHIP_COPY } from "~/content/player-membership"

/**
 * The closing call — Figma `629:28647`, 1920 × 1080.
 *
 * The landing page's own S13 word for word, at this screen's larger type: Bebas
 * **126/132** here against the landing page's 126/132 as well, so the two agree
 * — `--text-display-md` is that size exactly and is what both take.
 *
 * It is NOT `HomeJoin`, and the difference is the button: this one goes to
 * Contact where the landing page's goes to its own membership call. Reusing the
 * section would mean making its destination a prop to share four lines of
 * markup, which is the trade D57 rules against.
 */
const COPY = PLAYER_MEMBERSHIP_COPY.cta
</script>

<template>
  <section
    aria-labelledby="player-cta-heading"
    class="relative flex snap-screen flex-col items-center justify-center gap-8 px-5 py-20 text-center md:px-10 lg:gap-[3.33vw] lg:px-20 lg:py-[5.21vw]"
  >
    <div class="flex w-full flex-col items-center gap-6 lg:gap-[1.25vw]">
      <MotionReveal :y="40" class="w-full">
        <h2
          id="player-cta-heading"
          class="font-display mx-auto max-w-[65.83vw] text-[length:var(--text-display-md)] leading-[1.0476] text-white uppercase max-lg:max-w-none"
        >
          <!-- A block per line so the design's break survives without a `<br>`
               a translation would have to carry (RULES §9). -->
          <span
            v-for="line in COPY.headline"
            :key="line"
            class="block"
          >{{ line }}</span>
        </h2>
      </MotionReveal>

      <MotionReveal :y="32" :delay="STAGGER" class="w-full">
        <p
          class="font-sans mx-auto max-w-[40.83vw] text-base leading-8 text-white/70 text-balance max-lg:max-w-none lg:text-xl"
        >
          {{ COPY.body }}
        </p>
      </MotionReveal>
    </div>

    <MotionReveal
      :y="24"
      :delay="STAGGER * 2"
      class="w-fit max-w-full min-w-[min(100%,13.75vw)]"
    >
      <UiSilverCta :href="COPY.ctaUrl">{{ COPY.cta }}</UiSilverCta>
    </MotionReveal>
  </section>
</template>
