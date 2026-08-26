<script setup lang="ts">
/**
 * The side-tab column's chrome — Figma nodes `174:11226` (terms) and `173:10082`
 * (gallery).
 *
 * Both pages draw the identical list: rows of Bebas 32/40 separated by 1px
 * hairlines, the current one marked with a 4px gold bar in the margin and gold
 * type. Only the meaning differs — the terms column is a table of contents that
 * jumps within the document, the gallery column filters the page to one event —
 * so what is shared here is the appearance, and each page keeps its own idea of
 * which row is current.
 */
defineProps<{
  /** Names the column for assistive tech. */
  label: string
  /**
   * The small grey line above the list, where a page has one — the terms column
   * is headed "Table of Contents"; the gallery column is not headed at all.
   */
  heading?: string
}>()
</script>

<template>
  <nav :aria-label="label" class="flex flex-col gap-2">
    <p
      v-if="heading"
      class="font-sans text-label-muted text-[length:var(--text-eyebrow)] leading-7 font-medium"
    >
      {{ heading }}
    </p>
    <ol class="flex flex-col">
      <slot />
    </ol>
  </nav>
</template>
