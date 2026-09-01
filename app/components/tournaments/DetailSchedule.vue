<script setup lang="ts">
import type { TournamentScheduleEntry } from "~/lib/api/types"

/**
 * The schedule timeline inside the overview card — Figma node `517:2088`.
 *
 * A rail of dots joined by a dashed line, with each entry set beside its own
 * dot: the time in Bebas 32/40 grey, the session in Inter SemiBold 40/48 black,
 * and where it happens under that at 40%.
 *
 * **An ordered list, not a stack of divs.** A schedule is a sequence and the
 * order is the meaning — a screen reader saying "list, 5 items" before reading
 * them is the whole point, and it is what a `<div>` per entry throws away.
 *
 * The rail is drawn per ROW rather than as one line down the side: the entries
 * are different heights, so a single absolutely-positioned line would have to be
 * measured against them. Each row owns a dot and the segment below it, and the
 * last row's segment is dropped — which is also why the dash pattern is a
 * repeating gradient rather than a border, since a dashed border cannot fade at
 * its ends the way `517:2092` does.
 */
defineProps<{ entries: TournamentScheduleEntry[] }>()
</script>

<template>
  <ol class="flex list-none flex-col">
    <li
      v-for="(entry, i) in entries"
      :key="entry.id"
      class="flex gap-6 lg:gap-10"
    >
      <!-- The rail column. 116 wide in Figma, which is mostly air; the dot is
           12px and the rest is the gap to the text. -->
      <div class="flex w-6 shrink-0 flex-col items-center pt-4 lg:w-16">
        <span class="size-3 shrink-0 rounded-full bg-black" aria-hidden />
        <!-- The connector: a 2px dashed line in `#323232` fading out at both
             ends. Dropped on the last entry — a line running down from the final
             dot would promise a session that is not there. -->
        <span
          v-if="i < entries.length - 1"
          aria-hidden
          class="w-0.5 flex-1 bg-[repeating-linear-gradient(to_bottom,#323232_0_8px,transparent_8px_12px)] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_19%,#000_80%,transparent_100%)]"
        />
      </div>

      <div class="flex min-w-0 flex-col gap-5 pb-13 last:pb-0">
        <div class="flex flex-col gap-1">
          <p
            class="font-display text-[length:var(--text-display-caption)] leading-[1.25] text-[#999999] uppercase"
          >
            {{ entry.time }}
          </p>
          <p
            class="font-sans text-[length:var(--text-heading-card)] leading-[1.2] font-semibold text-black"
          >
            {{ entry.title }}
          </p>
        </div>

        <!-- The bullets are separators, not words: they sit in `aria-hidden`
             spans so a screen reader reads "Madrid Arena, Main Hall" rather than
             spelling the character between them. -->
        <p
          v-if="entry.places.length"
          class="font-sans flex flex-wrap gap-5 text-[length:var(--text-body-sm)] leading-[1.5] font-medium text-black/40"
        >
          <template v-for="(place, index) in entry.places" :key="place">
            <span v-if="index > 0" aria-hidden>•</span>
            <span>{{ place }}</span>
          </template>
        </p>
      </div>
    </li>
  </ol>
</template>
