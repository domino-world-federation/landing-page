<script setup lang="ts">
import { MEMBERS_COPY } from "~/content/members"

/**
 * The closing call to action — Figma node `406:479`.
 *
 * Bebas 126 over a line of small print and the silver pill — the same shape the
 * Development page closes with (`207:15320`), and deliberately so: two pages
 * that end with a pitch should end the same way.
 *
 * It stands over the page shine, which the page declares through
 * `definePageMeta` and the layout mounts behind `<main>`.
 */
</script>

<template>
  <section
    class="flex flex-col items-center gap-9 px-5 py-16 md:px-10 lg:px-20 lg:py-[5.2vw]"
  >
    <div class="flex flex-col items-center gap-6">
      <!-- Bebas 126/132, 1135 of the design's 1920. `uppercase` is the
           heading's, not the string's (D40). -->
      <h2
        class="font-display max-w-[1135px] text-center text-[length:var(--text-display-md)] leading-[1.05] text-white uppercase"
      >
        {{ MEMBERS_COPY.ctaHeading }}
      </h2>
      <p
        class="font-sans max-w-[784px] text-center text-[length:var(--text-eyebrow)] leading-8 text-white/70"
      >
        {{ MEMBERS_COPY.ctaIntro }}
      </p>
    </div>

    <UiSilverCta :href="MEMBERS_COPY.ctaHref">
      {{ MEMBERS_COPY.ctaButton }}
    </UiSilverCta>
  </section>
</template>
