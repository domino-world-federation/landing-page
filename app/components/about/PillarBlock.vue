<script setup lang="ts">
import type { Pillar } from "~/content/about/pillars"

/** The design's resting opacity for a block waiting its turn (`566:13556`). */
const IDLE = 0.5

/**
 * One of the three pillars.
 *
 * The block knows whether it is the one holding the light, and dims to 50% when
 * it is not — Figma draws the third block at exactly that (`566:13556`).
 *
 * **The sentence reads itself when the block becomes current**, which is what
 * the reference this section is drawn after does. It was briefly tied to the
 * scroll position instead; see `MotionReadingText` for why that came back.
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
     * Separate from `focused`, and it has to be: `focused` is true from mount
     * for whichever block starts current, so a line keyed to it alone read
     * itself while the section was still screens below the fold — arriving at a
     * block that had already finished. The column supplies this from its own
     * on-screen state as well.
     */
    reading?: boolean
    /**
     * How far the reader has scrolled through this block, 0 to 1. Handed to the
     * sentence, which lights itself from it — see `MotionReadingText`.
     */
    progress?: number
  }>(),
  { focused: false, reading: false, progress: undefined },
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
    class="column-block flex flex-col gap-3"
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

    <!-- The sentence reads itself while the block is current AND the reader is
         there to see it. -->
    <p
      class="font-sans mt-7 text-[length:var(--text-body-lg)] leading-[1.56]"
    >
      <MotionReadingText
        :text="pillar.body"
        :active="reading"
        :progress="progress"
      />
    </p>
  </Motion>
</template>
