<script setup lang="ts">
import { GOVERNANCE_COPY, STRATEGY_MILESTONES } from "~/content/governance"

/**
 * Strategic Plan 2026–2029 — Figma node `613:25116`.
 *
 * A centred gold heading over four years on a dotted rail. Structurally the same
 * block as the members page's application process, and drawn the same way for
 * the same reasons: the rule runs BETWEEN markers rather than under them, so the
 * row does not open and close with a connector joining an end year to nothing,
 * and it fades at both ends so the dots read as the things being connected.
 *
 * An ordered list, because a plan is a sequence and the order is the meaning.
 */
const COPY = GOVERNANCE_COPY.strategy

/** Mapped onto `ui/StepRail`'s shape: the rail's `marker` is a year here and a
 *  step number on the other two pages that use it. */
const steps = STRATEGY_MILESTONES.map((m) => ({
  id: m.id,
  marker: m.year,
  title: m.title,
  detail: m.detail,
}))
</script>

<template>
  <section
    aria-labelledby="strategy-heading"
    class="flex snap-screen flex-col items-center justify-center gap-10 px-5 pt-28 pb-16 text-center md:px-10 lg:gap-16 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[3.13vw]"
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

    <UiStepRail :label="COPY.label" :steps="steps" />
  </section>
</template>
