<script setup lang="ts">
import type { ShowcaseEvent } from "~/lib/api/types"
import { FEATURED_EVENT_COPY } from "~/content/event-showcase"

/**
 * The left column — the event's name, its date and place, and the pager.
 *
 * Bebas 76/72 in Figma (`561:13285`), which is the `display-sm` step. The name is
 * an `<h3>` under the section's own heading: it is the subject of the band, and
 * a screen reader moving by heading should land on it.
 *
 * The three blocks are the same three the design has always had. What the
 * revision changed is how they are spaced: they used to sit on a flat 48px gap
 * and now they are distributed down a fixed 540 with `space-between`, which is
 * what puts the pager on the picture's bottom edge rather than wherever the name
 * happened to leave it.
 */
defineProps<{
  event: ShowcaseEvent
  names: string[]
  dates: string[]
  locations: string[]
  current: number
  total: number
}>()

const emit = defineEmits<{ step: [delta: number] }>()
</script>

<template>
  <!-- The whole column is one live region rather than just the pager's count:
       pressing an arrow changes the name, the date and the place together, and
       announcing only "2 of 6" would tell a screen-reader user that something
       moved without saying what it moved to. It is the OUTER element now, which
       is what lets the three blocks be siblings — see below.

       `561:13284` distributes name, fields and pager down a 540-tall column with
       `space-between`, so the three have to be siblings of one flex container:
       nesting two of them inside a wrapper would make the browser distribute two
       items rather than three and drop the fields to the pager's shoulder.
       Measured against the design, that difference is 64px.

       Below `menu-lg` there is no 540 to distribute — the column has stacked and
       takes its height from its contents — so it falls back to a flat gap. -->
  <div
    aria-live="polite"
    class="flex h-full flex-col gap-8 lg:gap-12 menu-lg:justify-between menu-lg:gap-0"
  >
    <!-- The names run one to three lines, so the block reserves the height of
           the TALLEST of them and the pager below stops moving. Measured:
           without this the arrows shifted up to 100px between events at 1920,
           which is a control jumping out from under the cursor that just pressed
           it.

           `text-balance` is what reproduces Figma's own line break. The design
           writes the name out as three lines — "CARIBBEAN / DOMINO / OPEN 2024"
           — and plain wrapping gives "CARIBBEAN / DOMINO OPEN / 2024" instead,
           because it fills each line before moving on. Balancing evens the lines
           out and lands on the design's break exactly. Done here rather than as
           newlines in the data: a hard break would have to be authored per event
           and would still be wrong on a narrow screen, where the column is no
           longer 380px. Measured across all six names — only this one wraps
           differently under balancing. -->
    <UiEventReserved
      :all="names"
      class="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-balance uppercase"
    >
      <h3 class="col-start-1 row-start-1 text-black">{{ event.name }}</h3>
    </UiEventReserved>

    <!-- 258px wide in Figma (`561:13286`), not the column's full 380 — the two
           fields are short and the design lets the line break early. -->
    <dl class="flex w-full flex-col gap-5 lg:w-[258px]">
      <UiEventField
        :label="FEATURED_EVENT_COPY.dateLabel"
        :value="event.dateLabel"
        :all="dates"
      />
      <UiEventField
        :label="FEATURED_EVENT_COPY.locationLabel"
        :value="event.location"
        :all="locations"
      />
    </dl>

    <!-- Both are dropped for a single event, and not merely hidden: "1 of 1"
         beside two arrows that cannot go anywhere is the silent no-op D28 rules
         out. The tournaments page renders this showcase with one highlighted
         event, so the case is real rather than defensive.

         `sr-only` is `position: absolute`, so the announcement takes no part in
         the `space-between` above it and cannot become a fourth block to
         distribute. -->
    <template v-if="total > 1">
      <p class="sr-only">
        {{ FEATURED_EVENT_COPY.pagerPosition(current, total) }}
      </p>

      <UiEventPager
        :current="current"
        :total="total"
        @step="(delta) => emit('step', delta)"
      />
    </template>
  </div>
</template>
