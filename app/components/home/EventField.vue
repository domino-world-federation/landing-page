<script setup lang="ts">
/** A label above its value — Figma's `item` frame (`52:3032`). */
defineProps<{ label: string; value: string; all: string[] }>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <dt
      class="font-sans text-xl leading-7 font-medium text-[var(--color-label-muted)]"
    >
      {{ label }}
    </dt>
    <HomeEventReserved
      as="dd"
      :all="all"
      class="font-sans text-xl leading-7 font-medium text-[var(--color-ink-body)]"
    >
      <span class="col-start-1 row-start-1">{{ value }}</span>
    </HomeEventReserved>
  </div>
</template>
