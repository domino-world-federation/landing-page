<script setup lang="ts">
import { CONTACT_COPY } from "~/content/contact"

/**
 * The contact page's header band.
 *
 * Extrapolated, but not freely: it is `DevelopmentHeader` with this page's words
 * in it — the title left, a paragraph of small print bottom-right, the same
 * padding reserving the `fixed` navbar's height. Five pages of one site that
 * begin differently for no reason a reader could name is a defect, and that
 * argument does not stop applying because a sixth screen was never drawn.
 *
 * The intro is the designer's sentence from the terms sidebar (`174:11254`),
 * which is the only copy in the file that describes this page.
 */
</script>

<template>
  <section
    class="flex min-h-[420px] flex-col justify-end gap-10 px-5 pt-32 pb-14 md:px-10 lg:min-h-[27.6vw] lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-20 lg:pb-[5.2vw]"
  >
    <h1
      class="font-sans w-full text-[length:var(--text-page-title)] leading-[1.1] font-medium text-white lg:max-w-[824px]"
    >
      <MotionSharpeningHeadline :lines="CONTACT_COPY.title" />
    </h1>

    <!-- 480px, and 20/32 against the heading's 84 — the small print beside the
         claim. Deliberately still: two things arriving means neither is the
         arrival. -->
    <p
      class="font-sans w-full text-[length:var(--text-eyebrow)] leading-8 text-white/60 lg:max-w-[480px]"
    >
      {{ CONTACT_COPY.intro }}
    </p>
  </section>
</template>
