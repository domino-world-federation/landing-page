<script setup lang="ts">
import { PILLARS } from "~/content/about/pillars"

/**
 * One pass of the three blocks. Split out because the marquee needs it verbatim
 * twice, and two hand-written copies would be two places to change.
 *
 * The duplicate is `aria-hidden`: it exists so the loop has somewhere to land,
 * and a screen reader should hear the federation's three pillars once.
 */
withDefaults(defineProps<{ duplicate?: boolean }>(), { duplicate: false })
</script>

<template>
  <div
    :aria-hidden="duplicate || undefined"
    class="flex shrink-0 flex-col gap-12 pb-12 lg:gap-[8.54vw] lg:pb-[8.54vw]"
  >
    <AboutPillarBlock
      v-for="pillar in PILLARS"
      :key="pillar.id"
      :pillar="pillar"
      :duplicate="duplicate"
    />
  </div>
</template>
