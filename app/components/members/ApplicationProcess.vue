<script setup lang="ts">
import { APPLICATION_STEPS, MEMBERS_COPY } from "~/content/members"

/**
 * The application process — Figma node `406:453`.
 *
 * A gold heading, a line of prose, then four steps under a dotted rule.
 *
 * **Figma draws this as two stacked rows** — a `line` of dots and dashes
 * (`406:353`), and a `right` row of four text blocks (`406:363`) — which lines
 * up only while every block is the height the designer gave it. That stops being
 * true the moment one body wraps to a different number of lines, which here
 * happens at every width below 1920. So the rule is folded INTO each step: one
 * list, one item per step, each item a marker above its own copy, with the
 * connecting dashes drawn as a background on the item rather than as a separate
 * row. The axis is then built out of the content instead of being measured
 * against it — the same correction the Development page's certification ladder
 * needed.
 */

/**
 * The four steps, mapped onto `ui/StepRail`'s shape.
 *
 * The rail takes `marker` where this page's copy says `number` and `detail`
 * where it says `body` — renaming the copy to match would make three pages'
 * content files answer to one component's vocabulary, which is backwards.
 */
const steps = APPLICATION_STEPS.map((step) => ({
  id: step.id,
  marker: step.number,
  title: step.title,
  detail: step.body,
}))
</script>

<template>
  <section
    aria-labelledby="process-heading"
    class="flex snap-screen flex-col items-center justify-center gap-10 px-5 pt-28 pb-10 md:px-10 lg:gap-16 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[3.125vw]"
  >
    <div class="flex max-w-[1760px] flex-col items-center gap-6 lg:gap-9">
      <h2
        id="process-heading"
        class="font-display text-gold-gradient text-center text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
      >
        {{ MEMBERS_COPY.processHeading }}
      </h2>
      <!-- Inter Regular 36/44, 1094 of the design's 1920. -->
      <p
        class="font-sans max-w-[1094px] text-center text-[length:var(--text-body-lg)] leading-[1.22] text-white"
      >
        {{ MEMBERS_COPY.processIntro }}
      </p>
    </div>

    <UiStepRail :label="MEMBERS_COPY.processHeading" :steps="steps" />
  </section>
</template>
