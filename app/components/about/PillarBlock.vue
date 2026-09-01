<script setup lang="ts">
import type { Pillar } from "~/content/about/pillars"

/** The design's resting opacity for a block waiting its turn (`566:13556`). */
const IDLE = 0.5

/**
 * One of the three pillars.
 *
 * The block knows whether it is the one in the focused slot, and two things
 * follow from it. The whole block dims to 50% when it is not — Figma draws the
 * third block at exactly that (`566:13556`) — and its sentence only reads itself
 * while it IS, so the reading front is always in the slot the reader is looking
 * at rather than running invisibly at the top of the column.
 *
 * The duplicate's headings stay out of the document outline — otherwise the page
 * reports six `<h3>`s where the design has three, and heading navigation walks
 * the same list twice.
 */
const props = withDefaults(
  defineProps<{
    pillar: Pillar
    duplicate: boolean
    focused?: boolean
    /**
     * Whether the sentence should be reading itself right now.
     *
     * Separate from `focused`, and it has to be. `focused` is true from mount
     * for whichever block starts in the slot, so a sentence keyed to it alone
     * read itself while the section was still several screens below the fold —
     * measured at a full `16/16` words lit before the reader had ever scrolled
     * there, which meant arriving at a block that was already finished and
     * waiting a whole turn to see the effect at all. The column supplies this
     * from its own on-screen state instead.
     */
    reading?: boolean
  }>(),
  { focused: false, reading: false },
)

const headingTag = computed(() => (props.duplicate ? "p" : "h3"))

const prefersReducedMotion = useReducedMotion()

// Reduced motion collapses the TRANSITION, never the tree (RULES §12).
const dim = computed(() =>
  prefersReducedMotion.value
    ? { duration: 0 }
    : { duration: DURATION, ease: EASE },
)
</script>

<template>
  <Motion
    as="div"
    class="flex flex-col gap-3"
    :initial="{ opacity: IDLE }"
    :animate="{ opacity: focused ? 1 : IDLE, transition: dim }"
    :style="{ willChange: 'opacity' }"
  >
    <p
      class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white/40 uppercase"
    >
      {{ pillar.eyebrow }}
    </p>

    <!-- Bebas 72/64 — a heading set tighter than its own font size, which is how
         the design stacks the two-word titles. -->
    <component
      :is="headingTag"
      class="font-display text-[length:var(--text-display-pillar)] leading-[0.89] text-white uppercase"
    >
      {{ pillar.title }}
    </component>

    <!-- The sentence reads itself while the block holds the slot AND the reader
         is there to see it.

         `reading` alone, with no `!duplicate` beside it. That guard stood here
         to stop two copies of the same words lighting up in different places at
         once — which cannot happen: the column sets `reading` from `i === index`
         and exactly one cell satisfies that. What it did instead was silence the
         third turn entirely. The track holds the list twice and the cycle runs
         index 1 → 2 → 3, so the block that lands in the slot on the last turn is
         `cells[3]` — the SECOND copy of the first pillar. Olympic Stage was
         therefore the one block that never read itself, every lap. -->
    <p
      class="font-sans mt-7 text-[length:var(--text-body-lg)] leading-[1.56]"
    >
      <MotionReadingText :text="pillar.body" :active="reading" />
    </p>
  </Motion>
</template>
