<script setup lang="ts">
import type { Pillar } from "~/content/about/pillars"

/**
 * One of the three pillars.
 *
 * The duplicate's headings stay out of the document outline — otherwise the page
 * reports six `<h3>`s where the design has three, and heading navigation walks
 * the same list twice.
 */
const props = defineProps<{ pillar: Pillar; duplicate: boolean }>()

const headingTag = computed(() => (props.duplicate ? "p" : "h3"))
</script>

<template>
  <div class="flex flex-col gap-3">
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

    <p
      class="font-sans mt-7 text-[length:var(--text-body-lg)] leading-[1.56] text-white/70"
    >
      {{ pillar.body }}
    </p>
  </div>
</template>
