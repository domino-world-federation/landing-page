<script setup lang="ts">
import { INTEGRITY_COPY, INTEGRITY_FLOW } from "~/content/integrity"

/**
 * Integrity in Action — Figma node `601:17929`, drawn there as "Procedural
 * Flow".
 *
 * What everyone involved does to keep the game fair, as four steps on a dotted
 * rail. The design has a heading only; the paragraph under it is the
 * federation's revision, set the way Technical sets its own.
 *
 * The same block the members page's application process and governance's
 * strategic plan are, drawn the same way: the rule runs BETWEEN markers rather
 * than under them, and fades at both ends so the dots read as the things being
 * connected rather than as terminals.
 *
 * An ordered list, because the order is the meaning — knowing the rules comes
 * before competing by them.
 */
const COPY = INTEGRITY_COPY.flow

/** Mapped onto `ui/StepRail`'s shape. */
const steps = INTEGRITY_FLOW.map((step) => ({
  id: step.id,
  marker: step.number,
  title: step.title,
  detail: step.detail,
}))
</script>

<template>
  <section
    aria-labelledby="flow-heading"
    class="flex snap-screen flex-col items-center justify-center gap-10 px-5 pt-28 pb-16 md:px-10 lg:gap-16 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[4.17vw]"
  >
    <div class="flex w-full max-w-[1760px] flex-col gap-6 lg:gap-9">
      <MotionReveal :y="40">
        <h2
          id="flow-heading"
          class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
        >
          {{ COPY.heading }}
        </h2>
      </MotionReveal>

      <!-- 1094 of the design's 1920, Technical's measure. -->
      <p
        class="font-sans max-w-[1094px] text-[length:var(--text-heading-card)] leading-[1.22] text-white"
      >
        {{ COPY.intro }}
      </p>
    </div>

    <UiStepRail :label="COPY.label" :steps="steps" />
  </section>
</template>
