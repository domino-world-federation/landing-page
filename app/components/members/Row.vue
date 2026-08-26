<script setup lang="ts">
import type { MemberFederation } from "~/lib/api/types"

/**
 * One federation — `405:28404`.
 *
 * A flag, the body's own name, then the country at half opacity. Figma sets
 * these in DM Sans, a face the project does not load — it ships Inter and Bebas
 * only (DESIGN-TOKENS §1) — so the row is set in Inter at the same size, the
 * same call `SupportCard` makes about Inter Display.
 */
defineProps<{ federation: MemberFederation }>()
</script>

<template>
  <li class="flex items-center gap-6 rounded-[var(--radius-glass)] bg-white/12 p-2">
    <!-- 84 × 84 in Figma, drawn as a flat `#3E3E3E` square on every row — a
         placeholder for artwork the federation has not supplied. Where a flag
         exists it takes the slot; where it does not, the placeholder is the
         design as drawn rather than a gap. -->
    <div
      class="relative size-16 shrink-0 overflow-hidden rounded-[var(--radius-btn)] bg-[#3e3e3e] lg:size-21"
    >
      <!-- Empty alt: the country is printed in the row beside it, so naming the
           flag would announce it twice. -->
      <NuxtImg
        v-if="federation.flagUrl"
        :src="federation.flagUrl"
        alt=""
        :sizes="imageSizes({ xs: '84px' })"
        class="absolute inset-0 size-full object-cover"
      />
    </div>

    <div class="flex min-w-0 flex-wrap items-baseline gap-x-6 gap-y-1">
      <p
        class="font-sans text-[length:var(--text-body-sm)] leading-8 font-medium text-white"
      >
        {{ federation.name }}
      </p>
      <p
        class="font-sans text-[length:var(--text-body-sm)] leading-8 font-medium text-white/50"
      >
        {{ federation.country }}
      </p>
    </div>
  </li>
</template>
