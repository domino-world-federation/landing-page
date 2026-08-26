<script setup lang="ts">
import { DEVELOPMENT_CTA_COPY } from "~/content/development/cta"

/**
 * The page's closing call to action — Figma node `207:15320`.
 *
 * The same shape S13 closes the landing page with, and the same button: Bebas at
 * the display step over one paragraph of prose, then the silver pill. It stands
 * on the shine rather than on a fill of its own, which is why the button's focus
 * ring keeps its transparent offset (see `SilverCta`).
 */
</script>

<template>
  <section
    aria-labelledby="development-cta-heading"
    class="flex flex-col items-center gap-8 px-5 py-20 text-center md:px-10 lg:gap-9 lg:px-20 lg:py-[5.21vw]"
  >
    <div class="flex flex-col items-center gap-5 lg:gap-6">
      <!-- 1135 of the design's 1920 — narrow enough that the headline breaks
           into the two lines Figma sets it on rather than running the width of a
           wide monitor.

           No `blurFrom`: it renders its children twice, which would put this
           heading's `id` in the document twice and leave `aria-labelledby`
           pointing at the `aria-hidden` copy. -->
      <MotionReveal :y="48" class="lg:max-w-[59.11vw]">
        <h2
          id="development-cta-heading"
          class="font-display text-[length:var(--text-display-md)] leading-[1.05] text-white uppercase"
        >
          {{ DEVELOPMENT_CTA_COPY.heading }}
        </h2>
      </MotionReveal>

      <!-- 1087, a shade narrower than the headline above it, so the paragraph
           sits inside the block rather than reaching past it. -->
      <MotionReveal :y="32" :delay="STAGGER" class="lg:max-w-[56.61vw]">
        <p class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
          {{ DEVELOPMENT_CTA_COPY.body }}
        </p>
      </MotionReveal>
    </div>

    <MotionReveal :y="24" :delay="STAGGER * 2">
      <UiSilverCta :href="DEVELOPMENT_CTA_COPY.ctaHref">
        {{ DEVELOPMENT_CTA_COPY.cta }}
      </UiSilverCta>
    </MotionReveal>
  </section>
</template>
