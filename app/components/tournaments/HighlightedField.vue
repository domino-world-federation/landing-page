<script setup lang="ts">
/** A label above its value — Figma's `item` frame (`372:17320`). */
defineProps<{ label: string; value: string }>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <dt
      class="font-sans text-xl leading-7 font-medium text-[var(--color-label-muted)]"
    >
      {{ label }}
    </dt>
    <dd
      class="font-sans text-xl leading-7 font-medium text-[var(--color-ink-body)]"
    >
      {{ value }}
    </dd>
  </div>
</template>
