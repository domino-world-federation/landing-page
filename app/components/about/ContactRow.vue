<script setup lang="ts">
import type { ContactLine } from "~/content/about/headquarters"

/**
 * One way to reach the office — Figma `117:4277` and its two siblings.
 *
 * The address is plain text and the other two are links, which is what the data
 * says rather than a styling choice: an email and a number can be acted on, a
 * building cannot. They look identical because the design draws them identically
 * — the underline appears on hover, so the row does not read as three links when
 * only two are.
 */
defineProps<{ line: ContactLine }>()
</script>

<template>
  <li
    class="font-sans flex items-center gap-3 text-[length:var(--text-eyebrow)] leading-7 text-white"
  >
    <component
      :is="line.href ? 'a' : 'span'"
      :href="line.href || undefined"
      :class="
        line.href
          ? 'focus-visible:ring-gold flex items-center gap-3 rounded-[4px] hover:underline focus-visible:ring-2 focus-visible:outline-none'
          : 'flex items-center gap-3'
      "
    >
      <!-- 36 × 36 in Figma. `alt=""` — the icon repeats what the line beside it
           already says, and naming it would have a reader announce each row
           twice. -->
      <img
        :src="line.icon"
        alt=""
        width="36"
        height="36"
        class="size-7 shrink-0 lg:size-[min(1.875vw,36px)]"
      >
      <span>{{ line.label }}</span>
    </component>
  </li>
</template>
