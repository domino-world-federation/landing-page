<script setup lang="ts">
import type { MemberFederation } from "~/lib/api/types"
import { MEMBERS_COPY } from "~/content/members"

/**
 * One federation in the directory list — `405:28404`.
 *
 * A flag, the body's own name, the country beside it, and a chevron that opens
 * the record in the card alongside. Figma sets these in DM Sans, a face the
 * project does not load — it ships Inter and Bebas only (DESIGN-TOKENS §1) — so
 * the row is set in Inter at the same size, the same call `SupportCard` makes
 * about Inter Display.
 *
 * **The whole row is the button, not just the chevron.** The design draws the
 * chevron as the affordance and it stays as the visual cue, but a 40px target on
 * a 1000px row is a needle: the row is the control and the chevron rides inside
 * it. One tab stop, one hit area, and the pointer says the same thing everywhere
 * along it.
 */
defineProps<{ federation: MemberFederation; active: boolean }>()

const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <li>
    <!-- The selected row takes the gold wash and a gold edge (`405:28410`).

         **The wash runs dark-to-gold, left to right.** It was the other way
         round at first — bright at the flag, fading out toward the chevron —
         which put the emphasis on the placeholder square and let the row trail
         off exactly where its control is. The design brightens INTO the chevron,
         so the light lands on the thing that acts.

         **The edge fades with the wash.** It was a flat `ring` all the way round,
         which boxed the row and made the outline the loudest thing on it. The
         design's outline is solid at the right and gone by the left — it arrives
         with the light rather than framing the whole shape. A gradient edge is
         not something `ring` or `border` can hold, so it is drawn as
         `.row-gold-edge`; see `main.css`.

         Either way it is painted INSIDE the box rather than added to it: a real
         border would change the row's size and shift every unselected neighbour
         as the selection moved. -->
    <button
      type="button"
      :aria-pressed="active"
      :aria-label="MEMBERS_COPY.directoryOpenLabel.replace('%s', federation.name)"
      :class="
        cn(
          'focus-visible:ring-gold relative flex w-full items-center gap-4 rounded-[var(--radius-glass)] p-2 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none',
          active
            ? 'row-gold-edge bg-[linear-gradient(90deg,rgba(225,183,98,0.02)_0%,rgba(225,183,98,0.10)_45%,rgba(225,183,98,0.30)_100%)]'
            : 'bg-white/[0.07] hover:bg-white/12',
        )
      "
      @click="emit('open')"
    >
      <!-- 84 × 84 in Figma, drawn as a flat `#3E3E3E` square on every row — a
           placeholder for artwork the federation has not supplied. Where a flag
           exists it takes the slot; where it does not, the placeholder is the
           design as drawn rather than a gap. -->
      <span
        class="relative size-14 shrink-0 overflow-hidden rounded-[var(--radius-btn)] bg-[#3e3e3e] lg:size-16"
      >
        <!-- Empty alt: the country is printed in the row beside it, so naming
             the flag would announce it twice. -->
        <NuxtImg
          v-if="federation.flagUrl"
          :src="federation.flagUrl"
          alt=""
          :sizes="imageSizes({ xs: '84px' })"
          class="absolute inset-0 size-full object-cover"
        />
      </span>

      <span class="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-4 gap-y-1">
        <span
          class="font-sans text-[length:var(--text-body-sm)] leading-8 font-medium text-white"
        >
          {{ federation.name }}
        </span>
        <span
          class="font-sans text-[length:var(--text-eyebrow)] leading-8 font-medium text-white/50"
        >
          {{ federation.country }}
        </span>
      </span>

      <!-- Decorative: the button around it already carries the accessible name,
           and a second focusable control pointing at the same record would give
           every row two tab stops.

           On the selected row it goes gold-on-dark, not dark-on-gold: the wash
           behind it is already at its brightest there, and a filled gold square
           on top of that is one bright shape swallowing another. -->
      <span
        aria-hidden
        :class="
          cn(
            'flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-btn)] transition-colors',
            active ? 'bg-black/60 text-[#e1b762]' : 'bg-black/50 text-white',
          )
        "
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 3.5 L10.5 8 L6 12.5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </button>
  </li>
</template>
