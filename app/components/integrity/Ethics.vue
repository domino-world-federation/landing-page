<script setup lang="ts">
import { INTEGRITY_COPY } from "~/content/integrity"

/**
 * Code of Ethics — Figma node `613:25987`.
 *
 * A gold Bebas 100 over two photographs side by side, 820 and 760 of the
 * design's 1760. No prose: the block is the federation's ethics stated as two
 * pictures of the thing itself — a handshake and a referee watching a hand — and
 * the heading is what names them.
 *
 * Both keep real `alt` text. They are the section's whole content, so a reader
 * who cannot see them would otherwise get a heading and nothing at all.
 */
const COPY = INTEGRITY_COPY
</script>

<template>
  <section
    aria-labelledby="ethics-heading"
    class="flex snap-screen flex-col justify-center gap-8 px-5 pt-28 pb-16 md:px-10 lg:gap-9 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[3.13vw]"
  >
    <MotionReveal :y="40">
      <h2
        id="ethics-heading"
        class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
      >
        {{ COPY.ethicsHeading }}
      </h2>
    </MotionReveal>

    <!-- 820 / 760 of 1760 — 46.6% and 43.2%, with the design's 180px between
         them falling out of `justify-between`.

         The row is given a HEIGHT rather than left to the pictures. Figma draws
         them 860 tall, and 860 plus the clearance, the heading and this
         section's own padding comes to 1176 in a 1080 window — a snap stop that
         does not fit its own stop. What is left of the screen is the height they
         get; `object-cover` means the crop tightens rather than the pictures
         distorting. -->
    <div
      class="flex min-h-0 flex-1 flex-col gap-5 lg:h-[calc(100dvh-var(--nav-clearance)-13rem)] lg:flex-none lg:flex-row lg:justify-between"
    >
      <MotionReveal
        :y="32"
        class="min-h-0 flex-1 overflow-hidden rounded-[var(--radius-card)] lg:h-full lg:w-[46.6%] lg:flex-none"
      >
        <NuxtImg
          src="/assets/integrity/ethics-cover.png"
          :alt="COPY.ethicsAlt[0]"
          :sizes="imageSizes({ xs: '100vw', lg: '820px' })"
          :quality="88"
          class="size-full object-cover"
        />
      </MotionReveal>

      <MotionReveal
        :y="32"
        :delay="STAGGER"
        class="min-h-0 flex-1 overflow-hidden rounded-[var(--radius-card)] lg:h-full lg:w-[43.2%] lg:flex-none"
      >
        <NuxtImg
          src="/assets/integrity/ethics-panel.png"
          :alt="COPY.ethicsAlt[1]"
          :sizes="imageSizes({ xs: '100vw', lg: '760px' })"
          :quality="88"
          class="size-full object-cover"
        />
      </MotionReveal>
    </div>
  </section>
</template>
