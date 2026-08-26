<script setup lang="ts">
import { ABOUT_HEADER_COPY } from "~/content/about/header"

/**
 * About's header band — Figma node `119:4799`.
 *
 * The landing page never needed one of these: there the navbar overlays a hero
 * that is 1040px of artwork, so the bar has something to sit on. Here the first
 * element is type on the page background, and `NavShell` is `fixed` — so this
 * band has to reserve the bar's height itself or the `<h1>` renders underneath
 * it. The top padding is that reservation (the bar measures ~112px at `lg`:
 * 36 + 60 + 16), not a design number.
 *
 * Figma gives the heading `filter: blur(7.5px)`. That is the state it starts
 * from, not how it sits — a headline is not shipped out of focus. It clears from
 * the left, word by word, so the opening claim comes into focus in the order it
 * is read; `SharpeningHeadline` does that as an opacity cross-fade between two
 * static-blur copies rather than an animated `filter` (RULES §11).
 *
 * The intro beside it does not move at all. Two things arriving means neither is
 * the arrival — the sweep across the headline is the whole gesture here, and the
 * small print's job is to be already there when the eye drops to it.
 */
</script>

<template>
  <!-- 530px tall in Figma, bottom-aligned with 100px of padding under the
       content. `min-h` rather than a height so a longer translation grows the
       band instead of overflowing it; 27.6vw is 530/1920, so the design width
       reproduces the band exactly and narrower windows fall back to the floor. -->
  <section
    class="flex min-h-[420px] flex-col justify-end gap-10 px-5 pt-32 pb-14 md:px-10 lg:min-h-[27.6vw] lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-20 lg:pb-[5.2vw]"
  >
    <!-- 824px of the design's 1920 — the sentence is meant to break after
         "authority", and a wider column would set it on two long lines. -->
    <h1
      class="font-sans w-full text-[length:var(--text-page-title)] leading-[1.1] font-medium text-white lg:max-w-[824px]"
    >
      <MotionSharpeningHeadline :lines="ABOUT_HEADER_COPY.title" />
    </h1>

    <!-- 480px, and 20/32 against the heading's 84 — the small print beside the
         claim. Deliberately still. -->
    <p
      class="font-sans w-full text-[length:var(--text-eyebrow)] leading-8 text-white/60 lg:max-w-[480px]"
    >
      {{ ABOUT_HEADER_COPY.intro }}
    </p>
  </section>
</template>
