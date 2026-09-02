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
 * Every event wears the same card, and after the redraw (`561:13301`) that card
 * is one flattened landscape picture rather than the layered gold panel it was.
 *
 * **The year on it no longer follows the event.** The old panel set the event's
 * own year as live text across its foot, read off `dateLabel`, precisely so the
 * six would read as one series rather than as six copies of the same poster.
 * The redraw bakes "DWF2026" into the raster, so every event in the pager now
 * wears 2026 — including "World Championship 2027" at position six. Recorded
 * here rather than quietly worked around: getting it back means either six
 * exports or rebuilding the composition in layers at the new 810 × 540, and
 * neither is something to decide inside a component.
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
  <!-- `space-between`, not a gutter: `561:13283` gives the row three FIXED
       widths — 380, 810, 380 — inside the section's 1760 content box and lets
       the 190px left over fall into the two gaps, 95 each. Writing it as a gap
       would fix the wrong number; writing the columns as fractions and spacing
       them apart keeps Figma's proportions and lets the gaps give way first as
       the window narrows, which is the right thing to lose.

       Every width is a fraction of the design width, capped at the literal it
       comes from: 19.79vw is 380/1920 and 42.19vw is 810/1920. At 1920 the row
       lays out at Figma's exact numbers; narrower windows scale all three
       together instead of squeezing one.

       **The row waits for `menu-lg` (1600) rather than `menu` (1400).** Three
       columns at 380 + 810 + 380 plus the section's own 80px padding come to
       1650 before a single pixel of gap — the design width has only 190 spare,
       where the old 520-wide layout had 162 of slack AND 100px gutters it could
       give back. At 1600 the columns measure 317/676/317 with 47px gaps, which
       still carries the name and the two fields without rewrapping.

       The height is the row's, not each column's: `561:13284`, `561:13301` and
       `561:13317` are all exactly 540 tall, and the two side columns distribute
       their contents down it. Setting it once here and letting the children
       stretch is what keeps the three in register — see `EventDetails` and
       `EventActions`, which both spend it with `justify-between`.

       Below `menu-lg` the three stack in reading order — name, card, summary. -->
  <div
    v-if="event"
    class="flex flex-col items-start gap-10 menu-lg:h-[min(540px,28.125vw)] menu-lg:flex-row menu-lg:items-stretch menu-lg:justify-between menu-lg:gap-0"
  >
    <div class="w-full menu-lg:w-[19.79vw] menu-lg:max-w-[380px]">
      <UiEventDetails
        :event="event"
        :names="names"
        :dates="dates"
        :locations="locations"
        :current="index + 1"
        :total="events.length"
        @step="step"
      />
    </div>

    <UiEventCard
      :event="event"
      class="mx-auto menu-lg:mx-0 menu-lg:w-[42.19vw] menu-lg:max-w-[810px]"
    />

    <div class="w-full menu-lg:w-[19.79vw] menu-lg:max-w-[380px]">
      <UiEventActions :event="event" />
    </div>
  </div>
</template>
