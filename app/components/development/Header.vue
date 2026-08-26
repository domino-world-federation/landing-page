<script setup lang="ts">
import { DEVELOPMENT_HEADER_COPY } from "~/content/development/header"

/**
 * The Development page's header band — Figma node `190:13657`.
 *
 * The same band About and Domino open with, and deliberately so: three pages of
 * one site that begin differently for no reason a reader could name is a defect,
 * not a variation. The top padding reserves the `fixed` navbar's height (~112px
 * at `lg`: 36 + 60 + 16) — here the first element is type on the page
 * background, so without it the `<h1>` renders underneath the bar.
 *
 * Figma gives the heading `filter: blur(7.5px)` (`190:13658`). That is the state
 * it starts from, not how it sits; `SharpeningHeadline` clears it left to right
 * as an opacity cross-fade between two static-blur copies, never as an animated
 * `filter` (RULES §11). The intro beside it does not move at all — two things
 * arriving means neither is the arrival.
 */
</script>

<template>
  <!-- 530px tall in Figma with 100px of padding under the content, bottom
       aligned. `min-h` rather than a height so a longer translation grows the
       band instead of overflowing it; 27.6vw is 530/1920. -->
  <section
    class="flex min-h-[420px] flex-col justify-end gap-10 px-5 pt-32 pb-14 md:px-10 lg:min-h-[27.6vw] lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-20 lg:pb-[5.2vw]"
  >
    <!-- 824px of the design's 1920. Three words at 84px do not need it, but the
         cap is what keeps the line from stretching across a 2560 monitor away
         from the intro it is paired with. -->
    <h1
      class="font-sans w-full text-[length:var(--text-page-title)] leading-[1.1] font-medium text-white lg:max-w-[824px]"
    >
      <MotionSharpeningHeadline :lines="DEVELOPMENT_HEADER_COPY.title" />
    </h1>

    <!-- 480px, and 20/32 against the heading's 84 — the small print beside the
         claim. Deliberately still. -->
    <p
      class="font-sans w-full text-[length:var(--text-eyebrow)] leading-8 text-white/60 lg:max-w-[480px]"
    >
      {{ DEVELOPMENT_HEADER_COPY.intro }}
    </p>
  </section>
</template>
