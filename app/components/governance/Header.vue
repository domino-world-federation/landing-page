<script setup lang="ts">
import { GOVERNANCE_COPY } from "~/content/governance"

/**
 * The Governance header band — Figma node `613:24832`.
 *
 * The same band About, Domino and Development open with: 530px tall, content
 * bottom-aligned, the title on the left and the small print on the right. Three
 * pages of one site that begin differently for no reason a reader could name is
 * a defect, not a variation.
 *
 * Figma gives the heading `filter: blur(7.5px)` (`613:24833`). That is the state
 * it starts from, not how it sits; `SharpeningHeadline` clears it left to right
 * as an opacity cross-fade between two static-blur copies, never as an animated
 * `filter` (RULES §11). The block beside it does not move — two things arriving
 * means neither is the arrival.
 *
 * The top padding reserves the `fixed` navbar (~112px at `lg`: 36 + 60 + 16):
 * the first element here is type on the page background, so without it the
 * `<h1>` renders underneath the bar.
 */
</script>

<template>
  <section
    class="flex min-h-[420px] flex-col justify-end gap-10 px-5 pt-32 pb-14 md:px-10 lg:min-h-[27.6vw] lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-20 lg:pb-[5.2vw]"
  >
    <!-- 824px of the design's 1920. The cap is what keeps the line from
         stretching across a 2560 monitor away from the block it is paired
         with. -->
    <h1
      class="font-sans w-full text-[length:var(--text-page-title)] leading-[1.1] font-medium text-white lg:max-w-[824px]"
    >
      <MotionSharpeningHeadline :lines="GOVERNANCE_COPY.headerTitle" />
    </h1>

    <!-- 480px. Inter 32/40 over Inter 20/32 at 60% — a label and its
         paragraph. -->
    <div class="flex w-full flex-col gap-5 lg:max-w-[480px]">
      <p
        class="font-sans text-[length:var(--text-display-caption)] leading-[1.25] text-white"
      >
        {{ GOVERNANCE_COPY.headerEyebrow }}
      </p>
      <p class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
        {{ GOVERNANCE_COPY.headerIntro }}
      </p>
    </div>
  </section>
</template>
