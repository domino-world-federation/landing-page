<script setup lang="ts">
import type { TournamentFact } from "~/lib/api/types"

/**
 * One labelled fact inside the overview card — `517:2052` (with a glyph) and
 * `517:2137` (without).
 *
 * A white card with a 2px `#DADADA` edge, and the edge is doing work: this sits
 * ON the white overview panel, where a borderless card would have nothing to
 * separate it from its ground. That is why it is not `ui/ResourceCard`, which is
 * the same shape drawn on a dark page and therefore needs no line.
 *
 * The gold tile appears only where the fact carries a glyph. Eligibility &
 * Registration draws four; Tournament Format draws none and gets the same card
 * with the row collapsed to the text alone.
 */
defineProps<{ fact: TournamentFact }>()
</script>

<template>
  <div
    class="flex min-h-[172px] items-center gap-6 rounded-3xl border-2 border-[#DADADA] bg-white p-6"
  >
    <UiGoldTile v-if="fact.iconUrl" :src="fact.iconUrl" />

    <div class="flex min-w-0 flex-col gap-3">
      <!-- Inter Medium 20/28 in `#999999`, capitalised by the card rather than
           by the string (D40). -->
      <p
        class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-[#999999] uppercase"
      >
        {{ fact.label }}
      </p>
      <p
        class="font-sans text-[length:var(--text-display-caption)] leading-[1.25] font-medium text-black"
      >
        {{ fact.value }}
      </p>
    </div>
  </div>
</template>
