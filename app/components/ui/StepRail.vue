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
 *
 * ── Below `lg` it turns, and it had to ──
 *
 * The rail was drawn horizontally at every width while the grid dropped to one
 * column on a phone. The result was a dash reaching sideways out of each dot
 * into the margin, joining nothing — a connector between steps that were no
 * longer beside each other. The two-column step at `sm` had the same fault for
 * the third and fourth steps, so that breakpoint is gone too: below `lg` this
 * is one column, and the rail runs DOWN it.
 *
 * Turned, it becomes the shape a parcel-tracking list uses, which is what the
 * federation asked for: the dot in a gutter on the left, the step's words
 * beside it rather than under it, and one continuous line down the column. Text
 * goes left-aligned with it — centred text against a left-hand rail leaves a
 * ragged edge facing the very thing meant to line up with it.
 *
 * Both rules follow the same two principles above. The vertical run is drawn
 * from each dot DOWN to the next rather than up from each dot to the last, which
 * is the same n−1 count reached from the other end: it is skipped on the final
 * step instead of the first, and it reaches exactly the row gap below itself.
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
    class="grid w-full list-none grid-cols-1 gap-10 text-left lg:grid-cols-4 lg:gap-13 lg:text-center"
  >
    <li
      v-for="(step, i) in steps"
      :key="step.id"
      class="flex gap-4 lg:flex-col lg:items-center lg:gap-5"
    >
      <!-- The marker's own column. A fixed 44px gutter below `lg` so every
           step's words start on the same left edge whatever the dot is doing;
           the full row above it, where the rail is horizontal. -->
      <div
        class="relative flex w-11 shrink-0 justify-center lg:h-8 lg:w-full lg:items-center"
      >
        <!-- Down the column, below `lg`. `-bottom-10` is the grid's own
             `gap-10`, so the run ends exactly where the next dot begins rather
             than at this step's last line of text — which would make the rail
             as ragged as the copy. Skipped on the LAST step: n−1 runs again,
             counted from the other end. -->
        <span
          v-if="i < steps.length - 1"
          aria-hidden
          class="absolute top-11 -bottom-10 left-1/2 w-0.5 -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,#5a5a5a_0_2px,transparent_2px_8px)] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_38%,#000_62%,transparent_100%)] lg:hidden"
        />
        <span
          v-if="i > 0"
          aria-hidden
          class="absolute top-1/2 right-1/2 left-[-50%] hidden h-0.5 -translate-y-1/2 bg-[repeating-linear-gradient(to_right,#5a5a5a_0_2px,transparent_2px_8px)] [mask-image:linear-gradient(to_right,transparent_0%,#000_38%,#000_62%,transparent_100%)] lg:block"
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

      <div class="flex flex-col gap-1 pb-2 lg:items-center lg:pb-0">
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
