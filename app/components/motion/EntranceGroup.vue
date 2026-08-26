<script setup lang="ts">
/**
 * Drives several layers' entrances from ONE viewport trigger.
 *
 * This exists because a composition is not the sum of its layers. Each layer
 * could watch itself — `Reveal` does, and for a single block of copy that is
 * right — but the hero's layers are three parts of one move, spread from the
 * top of the section to the bottom. Letting each one arm itself means the lower
 * rock, which is nearest the reader coming up from S3, crosses its own
 * threshold first and starts retreating while the tile above is still off
 * screen. The composition would then assemble bottom-up on a return visit and
 * top-down on load — the same three animations in a different order, which
 * reads as a different design.
 *
 * One ref, one `useInView`, one boolean handed down: every layer leaves at the
 * same instant and keeps the relative delays the design gives them.
 *
 * `useInView` is `false` on the server and on the client's first render, so both
 * sides paint the same starting state and the entrance begins after hydration —
 * the hydration-safe path RULES §12 requires. Nothing here branches the tree.
 */
const props = withDefaults(
  defineProps<{
    /**
     * How much of the group must be on screen before the entrance plays — and,
     * below it, the point the group counts as gone and rearms.
     */
    amount?: number
    /** Play once and stay. The default rearms on every return. */
    once?: boolean
  }>(),
  { amount: 0.5, once: false },
)

const root = useTemplateRef<HTMLDivElement>("root")

const inView = useInView(root, { amount: props.amount, once: props.once })

provideEntrance(inView)
</script>

<template>
  <!-- `class` is not declared as a prop: Vue merges a caller's class onto the
       single root element on its own, which is the behaviour the React build
       got by threading `className` through by hand. -->
  <div ref="root">
    <slot />
  </div>
</template>
