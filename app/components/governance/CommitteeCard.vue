<script setup lang="ts">
import type { StandingCommittee } from "~/lib/api/types"

/**
 * One standing committee — Figma node `613:24909`.
 *
 * A 20px-radius card on the same white 12%→4% fall the tournament winners' cards
 * use, a 72px gold tile with the committee's glyph, its name in Inter SemiBold
 * 36, and its remit as chips.
 *
 * The chips are a `<ul>` because that is what they are — a list of the things
 * this body answers for, not a sentence broken into boxes.
 */
defineProps<{ committee: StandingCommittee }>()
</script>

<template>
  <article
    class="flex h-full flex-col gap-7 rounded-[var(--radius-card)] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_100%)] p-7"
  >
    <!-- 72px tile in the gold fall at 135°, the 56px glyph centred in it
         (`613:24911`). Absent where a committee has filed no icon — a blank gold
         square says less than no square at all. -->
    <UiGoldTile v-if="committee.iconUrl" :src="committee.iconUrl" />

    <div class="flex flex-col gap-3">
      <h3
        class="font-sans text-[length:var(--text-heading-card)] leading-[1.22] font-semibold text-white"
      >
        {{ committee.name }}
      </h3>

      <ul class="flex list-none flex-wrap gap-3">
        <li
          v-for="item in committee.remit"
          :key="item"
          class="font-sans rounded-[var(--radius-btn)] bg-white/12 px-3 py-1 text-[length:var(--text-eyebrow)] leading-8 text-white/60"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </article>
</template>
