<script setup lang="ts">
import type { ShowcaseEvent } from "~/lib/api/types"
import { FEATURED_EVENT_COPY } from "~/content/home/featured-event"

/**
 * The left column — the event's name, its date and place, and the pager.
 *
 * Bebas 76/72 in Figma (`52:3030`), which is the `display-sm` step. The name is
 * an `<h3>` under the section's own heading: it is the subject of the band, and
 * a screen reader moving by heading should land on it.
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
  <div class="flex flex-col gap-8 lg:gap-12">
    <!-- The whole column is one live region rather than just the pager's count:
         pressing an arrow changes the name, the date and the place together, and
         announcing only "2 of 6" would tell a screen-reader user that something
         moved without saying what it moved to. -->
    <div aria-live="polite" class="flex flex-col gap-8 lg:gap-12">
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
      <HomeEventReserved
        :all="names"
        class="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-balance uppercase"
      >
        <h3 class="col-start-1 row-start-1 text-black">{{ event.name }}</h3>
      </HomeEventReserved>

      <!-- 258px wide in Figma (`52:3031`), not the column's full 380 — the two
           fields are short and the design lets the line break early. -->
      <dl class="flex w-full flex-col gap-5 lg:w-[258px]">
        <HomeEventField
          :label="FEATURED_EVENT_COPY.dateLabel"
          :value="event.dateLabel"
          :all="dates"
        />
        <HomeEventField
          :label="FEATURED_EVENT_COPY.locationLabel"
          :value="event.location"
          :all="locations"
        />
      </dl>

      <p class="sr-only">
        {{ FEATURED_EVENT_COPY.pagerPosition(current, total) }}
      </p>
    </div>

    <HomeEventPager
      :current="current"
      :total="total"
      @step="(delta) => emit('step', delta)"
    />
  </div>
</template>
