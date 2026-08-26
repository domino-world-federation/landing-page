<script setup lang="ts">
import type { ShowcaseEvent } from "~/lib/api/types"

/**
 * The three columns of S6 and the pager that steps them — Figma `52:3027`.
 *
 * All three columns change together when the event does — the name and
 * particulars on the left, the card in the middle, the summary and the two
 * buttons on the right — so the state that selects the event has to sit above
 * all three. Splitting it any deeper would mean putting the index into a
 * provide/inject pair and subscribing three separate branches to it, which is
 * more moving parts for the same render (RULES §5).
 *
 * The section shell around it — the band, the eyebrow, the heading — is markup
 * with nothing to hydrate, and so is the fetch above it.
 *
 * Every event wears the same card: one gold-lit panel with the federation
 * watermark, the trophy and the event's own year across the foot. The year is
 * the only part of the card that is data, so the six read as one series rather
 * than six unrelated posters.
 *
 * Switching is a plain swap, not a transition. The band is dense with type — a
 * name, two fields, a paragraph, a pager and two buttons — and fading or sliding
 * all of it on every press would put the whole section in motion each time the
 * reader steps forward. The drift inside the card is the only movement here, and
 * it keeps running across a swap because the card itself never unmounts.
 */
const props = defineProps<{ events: ShowcaseEvent[] }>()

const index = ref(0)
const event = computed(() => props.events[index.value])

const names = computed(() => props.events.map((e) => e.name))
const dates = computed(() => props.events.map((e) => e.dateLabel))
const locations = computed(() => props.events.map((e) => e.location))

// Wraps in both directions, so neither arrow is ever a dead end. With the
// position spelled out as "n of 6" there is no ambiguity about where the wrap
// lands, and an always-live control beats one that greys out at the ends.
function step(delta: number) {
  const total = props.events.length
  if (total === 0) return
  index.value = (index.value + delta + total) % total
}
</script>

<template>
  <!-- Figma's own 100px gutter between the columns, as a fraction of the design
       width so it narrows with the window instead of squeezing the columns.

       The row starts at `menu` (1400), not `lg`, and the widths inside it are
       proportional rather than fixed — both for the same measured reason. Three
       columns at Figma's literal 380 + 520 + 380 plus two 100px gutters, the
       eyebrow beside them and the section's own 80px padding, need 1772px of
       window before they fit. At `lg` they did not: the row overflowed the
       viewport and the WHOLE PAGE scrolled sideways from 1024 all the way to
       ~1700 (measured `scrollWidth` 1614 at 1024, 1657 at 1440, 1674 at 1600).
       The section had only ever been checked at 1920, where it fits.

       Two changes make it fit at 1400 instead. The card is sized as a fraction
       of the window (27.08vw = 520/1920, capped at its design size), so it gives
       ground with the window as everything else here already does; and the side
       columns take what is left rather than demanding 380 — `flex-1 basis-0`
       with the design width as a ceiling, so 1920 still lays out exactly as
       before and narrower windows split the remainder evenly. At 1400 that
       leaves 284px a column, which the name and the two fields carry without
       wrapping differently.

       Below `menu` the three stack in reading order — name, card, summary —
       which is what they already did below `lg`. -->
  <div
    v-if="event"
    class="flex flex-col items-start gap-10 menu:flex-row menu:gap-[5.2vw]"
  >
    <div class="w-full menu:max-w-[380px] menu:flex-1 menu:basis-0">
      <HomeEventDetails
        :event="event"
        :names="names"
        :dates="dates"
        :locations="locations"
        :current="index + 1"
        :total="events.length"
        @step="step"
      />
    </div>

    <!-- 27.08vw is 520/1920, so the design width renders the card at exactly its
         Figma size and narrower windows scale it down with them. -->
    <HomeEventCard :event="event" class="mx-auto menu:mx-0 menu:w-[27.08vw]" />

    <div class="w-full menu:max-w-[380px] menu:flex-1 menu:basis-0">
      <HomeEventActions :event="event" />
    </div>
  </div>
</template>
