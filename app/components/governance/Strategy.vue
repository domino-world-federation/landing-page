<script setup lang="ts">
import { GOVERNANCE_COPY } from "~/content/governance"

/**
 * Domino Agenda 2030 Strategic Plan — Figma node `613:25116`.
 *
 * A centred gold heading and a paragraph. The design hangs four years on a
 * dotted rail under them; the federation's revision (2026-09-28) takes the rail
 * out, because the plan now runs to 2030 and is stated as what it focuses on
 * rather than as a year-by-year schedule.
 */
const COPY = GOVERNANCE_COPY.strategy
</script>

<template>
  <section
    aria-labelledby="strategy-heading"
    class="flex flex-col items-center justify-center px-5 pt-16 pb-16 lg:snap-screen text-center md:px-10 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[3.13vw]"
  >
    <div class="flex max-w-[1760px] flex-col items-center gap-6 lg:gap-9">
      <MotionReveal :y="40">
        <h2
          id="strategy-heading"
          class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
        >
          {{ COPY.heading }}
        </h2>
      </MotionReveal>

      <!-- 1094 of the design's 1920. -->
      <p
        class="font-sans max-w-[1094px] text-[length:var(--text-heading-card)] leading-[1.22] text-white"
      >
        {{ COPY.intro }}
      </p>
    </div>
  </section>
</template>
