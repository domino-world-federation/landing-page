<script setup lang="ts">
import { INTEGRITY_COPY } from "~/content/integrity"

/**
 * The Integrity header band — Figma node `601:17846`.
 *
 * The same band About, Domino, Development and Governance open with: 530px tall,
 * content bottom-aligned, title left and the small print right.
 *
 * Figma gives the heading `filter: blur(7.5px)` (`601:17847`) — the state it
 * starts from, cleared left to right by `SharpeningHeadline` as an opacity
 * cross-fade between two static-blur copies, never as an animated `filter`
 * (RULES §11).
 */
</script>

<template>
  <section
    class="flex min-h-[420px] flex-col justify-end gap-10 px-5 pt-32 pb-14 md:px-10 lg:min-h-[27.6vw] lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-20 lg:pb-[5.2vw]"
  >
    <h1
      class="font-sans w-full text-[length:var(--text-page-title)] leading-[1.1] font-medium text-white lg:max-w-[824px]"
    >
      <MotionSharpeningHeadline :lines="INTEGRITY_COPY.headerTitle" />
    </h1>

    <div class="flex w-full flex-col gap-5 lg:max-w-[480px]">
      <p
        class="font-sans text-[length:var(--text-display-caption)] leading-[1.25] text-white"
      >
        {{ INTEGRITY_COPY.headerEyebrow }}
      </p>
      <p class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
        {{ INTEGRITY_COPY.headerIntro }}
      </p>
    </div>
  </section>
</template>
