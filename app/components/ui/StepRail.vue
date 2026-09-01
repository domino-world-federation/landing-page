<script setup lang="ts">
/**
 * A row of numbered steps on a dotted rail — the members page's application
 * process (`406:355`), governance's strategic plan (`613:25120`) and integrity's
 * procedural flow (`601:17932`).
 *
 * **Three pages, one block.** All three draw four steps with a dot each, a
 * dotted connector between them, a gold label, a title and a line of detail.
 * They were three copies, and the two hard-won details in them had to be fixed
 * in three places:
 *
 *  - **The rule runs BETWEEN markers, not under them.** Drawn per cell edge to
 *    edge, the row opens with a connector before the first dot and closes with
 *    one after the last — each joining an end step to nothing. It is drawn on
 *    the left half only and skipped on the first step, which leaves exactly
 *    n−1 runs for n dots.
 *  - **It fades at both ends.** A run that meets each dot at full strength reads
 *    as a wire bolted between them; the design's is strongest mid-span and gone
 *    by the time it arrives, so the dots stay the things being connected rather
 *    than terminals.
 *
 * An `<ol>`, because a sequence is what these are and the order is the meaning —
 * a reader needs to know the tribunal comes after the inquiry.
 */
defineProps<{
  /** Names the sequence for assistive tech. */
  label: string
  steps: readonly {
    id: string
    /** The gold line above the title — a number on two of the three pages, a
     *  year on the other. */
    marker: string
    title: string
    detail: string
  }[]
}>()
</script>

<template>
  <ol
    :aria-label="label"
    class="grid w-full grid-cols-1 list-none gap-10 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-13"
  >
    <li
      v-for="(step, i) in steps"
      :key="step.id"
      class="flex flex-col items-center gap-5"
    >
      <div class="relative flex h-8 w-full items-center justify-center">
        <span
          v-if="i > 0"
          aria-hidden
          class="absolute top-1/2 right-1/2 left-[-50%] h-0.5 -translate-y-1/2 bg-[repeating-linear-gradient(to_right,#5a5a5a_0_2px,transparent_2px_8px)] [mask-image:linear-gradient(to_right,transparent_0%,#000_38%,#000_62%,transparent_100%)]"
        />
        <!-- A 12px white dot inside a ring of page background, which is what
             makes it sit ON the rule rather than beside it. -->
        <span
          aria-hidden
          class="bg-bg relative flex size-11 items-center justify-center rounded-full"
        >
          <span class="size-3 rounded-full bg-white" />
        </span>
      </div>

      <div class="flex flex-col items-center gap-1">
        <p
          class="font-display text-gold text-[length:var(--text-display-caption)] leading-[1.25]"
        >
          {{ step.marker }}
        </p>
        <h3
          class="font-sans text-[length:var(--text-heading-card)] leading-[1.2] font-semibold text-white"
        >
          {{ step.title }}
        </h3>
        <p class="font-sans text-[length:var(--text-body-sm)] leading-[1.5] text-white/40">
          {{ step.detail }}
        </p>
      </div>
    </li>
  </ol>
</template>
