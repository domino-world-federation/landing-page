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
 * **The sentence is lit by the scroll, not by a clock.** It used to be told when
 * to start reading itself, which needed an on-screen gate as well as the focus
 * flag: a timer keyed to focus alone ran the whole line while the section was
 * still screens below the fold, so the reader arrived at a block that had
 * already finished. A progress figure needs neither — at the top of the track it
 * is zero, so an unread block is simply unread.
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
     * How far the reader has scrolled through this block, 0 to 1. Handed
     * straight to the sentence, which lights itself from it instead of from a
     * clock — see `MotionReadingText`.
     */
    progress?: number
  }>(),
  { focused: false, progress: undefined },
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

    <!-- The sentence lights from the reader's own scroll through this block —
         see `MotionReadingText`. -->
    <p
      class="font-sans mt-7 text-[length:var(--text-body-lg)] leading-[1.56]"
    >
      <MotionReadingText :text="pillar.body" :progress="progress" />
    </p>
  </Motion>
</template>
