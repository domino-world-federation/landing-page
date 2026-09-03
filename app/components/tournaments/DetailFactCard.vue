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
 * The gold tile appears only where the fact HAS a glyph. Eligibility &
 * Registration draws four; Tournament Format draws none and gets the same card
 * with the row collapsed to the text alone.
 */
const props = defineProps<{ fact: TournamentFact }>()

/**
 * The four glyphs Eligibility & Registration is drawn with (`517:2052`).
 *
 * **The design decides these, not the data.** They were only ever coming from
 * `fact.iconUrl`, which the mock fills and a real API need not: served from the
 * CMS the same four facts arrived with the field empty and the section rendered
 * as four lines of text with no tiles at all. Which glyph belongs beside
 * "Registration period" is not something an editor should have to know or be
 * able to get wrong — it is part of the design of the block, so it is stated
 * here and the field becomes an override rather than the source.
 *
 * Keyed on the fact's `id` and, failing that, on its label flattened to letters,
 * because those are the two things both sources agree on: the mock ids are
 * `period`, `dwf-id`, `eligibility`, `method`, and any backend at least prints
 * the same four labels the design does.
 */
const GLYPHS: Record<string, string> = {
  period: "/assets/tournaments/icon-fact-period.svg",
  registrationperiod: "/assets/tournaments/icon-fact-period.svg",
  "dwf-id": "/assets/tournaments/icon-fact-id.svg",
  dwfid: "/assets/tournaments/icon-fact-id.svg",
  dwfidrequirement: "/assets/tournaments/icon-fact-id.svg",
  eligibility: "/assets/tournaments/icon-fact-eligibility.svg",
  method: "/assets/tournaments/icon-fact-method.svg",
  registrationmethod: "/assets/tournaments/icon-fact-method.svg",
}

/** Letters and digits only, so spacing and punctuation cannot miss a match. */
function flatten(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

const iconUrl = computed(
  () =>
    props.fact.iconUrl ??
    GLYPHS[props.fact.id] ??
    GLYPHS[flatten(props.fact.id)] ??
    GLYPHS[flatten(props.fact.label)],
)
</script>

<template>
  <div
    class="flex min-h-[172px] items-center gap-6 rounded-3xl border-2 border-[#DADADA] bg-white p-6"
  >
    <UiGoldTile v-if="iconUrl" :src="iconUrl" />

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
