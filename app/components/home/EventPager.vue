<script setup lang="ts">
import { FEATURED_EVENT_COPY } from "~/content/home/featured-event"

/**
 * The step-through controls — node `163:8168`.
 *
 * The visible count is `aria-hidden`: it is already spoken as part of the
 * column's live region above, and leaving it exposed here would have a reader
 * announce the position twice on every press.
 *
 * The arrows are one SVG used twice, the forward one flipped — the design's two
 * icons are the same path mirrored.
 */
defineProps<{ current: number; total: number }>()

const emit = defineEmits<{ step: [delta: number] }>()

const BUTTON_CLASS =
  "rounded-btn focus-visible:ring-gold flex size-14 items-center justify-center border border-[var(--color-surface-grey)] bg-white transition-colors hover:bg-[var(--color-surface-grey)] focus-visible:ring-2 focus-visible:outline-none"
</script>

<template>
  <div class="flex items-center gap-6">
    <button
      type="button"
      :aria-label="FEATURED_EVENT_COPY.previous"
      :class="BUTTON_CLASS"
      @click="emit('step', -1)"
    >
      <img
        src="/assets/global/icon-arrow-left.svg"
        alt=""
        width="32"
        height="32"
        class="size-8"
      >
    </button>

    <span
      aria-hidden="true"
      class="font-display text-[length:var(--text-display-btn)] leading-8 text-black"
    >
      {{ FEATURED_EVENT_COPY.pagerPosition(current, total) }}
    </span>

    <button
      type="button"
      :aria-label="FEATURED_EVENT_COPY.next"
      :class="BUTTON_CLASS"
      @click="emit('step', 1)"
    >
      <img
        src="/assets/global/icon-arrow-left.svg"
        alt=""
        width="32"
        height="32"
        class="size-8 rotate-180"
      >
    </button>
  </div>
</template>
