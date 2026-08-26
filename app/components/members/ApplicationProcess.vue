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
</script>

<template>
  <section
    aria-labelledby="process-heading"
    class="flex flex-col items-center gap-10 px-5 py-10 md:px-10 lg:gap-16 lg:px-20 lg:py-[3.125vw]"
  >
    <div class="flex max-w-[1760px] flex-col items-center gap-6 lg:gap-9">
      <h2
        id="process-heading"
        class="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-center text-[length:var(--text-display-statement)] leading-[1.08] text-transparent uppercase"
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

    <ol
      class="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-13"
    >
      <li
        v-for="step in APPLICATION_STEPS"
        :key="step.id"
        class="flex flex-col items-center gap-5"
      >
        <!-- The marker and the dashes it sits on. The rule is drawn as a
             background on this row rather than as a sibling element, so it
             cannot fall out of step with the marker above it. -->
        <div class="relative flex h-8 w-full items-center justify-center">
          <span
            aria-hidden
            class="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-[repeating-linear-gradient(to_right,#323232_0_8px,transparent_8px_12px)]"
          />
          <!-- `406:355` — a 12px white dot inside 16px of padding. The ring of
               page background is what makes it sit ON the rule rather than
               beside it. -->
          <span
            aria-hidden
            class="bg-bg relative flex size-11 items-center justify-center rounded-full"
          >
            <span class="size-3 rounded-full bg-white" />
          </span>
        </div>

        <div class="flex flex-col items-center gap-1">
          <!-- Bebas 32/40 in solid gold — a step label, not a heading. -->
          <p
            class="font-display text-gold text-[length:var(--text-display-caption)] leading-[1.25]"
          >
            {{ step.number }}
          </p>
          <!-- Inter SemiBold 40/48. -->
          <h3
            class="font-sans text-center text-[length:var(--text-heading-card)] leading-[1.2] font-semibold text-white"
          >
            {{ step.title }}
          </h3>
        </div>

        <!-- Inter Regular 24/36 at 40%. -->
        <p
          class="font-sans text-center text-[length:var(--text-body-sm)] leading-[1.5] text-white/40"
        >
          {{ step.body }}
        </p>
      </li>
    </ol>
  </section>
</template>
