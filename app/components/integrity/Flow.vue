<script setup lang="ts">
import { INTEGRITY_COPY, INTEGRITY_FLOW } from "~/content/integrity"

/**
 * Procedural Flow — Figma node `601:17929`.
 *
 * What happens to a report once it is filed, as four steps on a dotted rail.
 * The same block the members page's application process and governance's
 * strategic plan are, drawn the same way: the rule runs BETWEEN markers rather
 * than under them, and fades at both ends so the dots read as the things being
 * connected rather than as terminals.
 *
 * An ordered list, because the order is the meaning — a reader needs to know
 * that the tribunal comes after the inquiry.
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
    <MotionReveal :y="40" class="w-full max-w-[1760px]">
      <h2
        id="flow-heading"
        class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
      >
        {{ COPY.heading }}
      </h2>
    </MotionReveal>

    <UiStepRail :label="COPY.label" :steps="steps" />
  </section>
</template>
