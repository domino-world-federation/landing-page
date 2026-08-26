<script setup lang="ts">
import { getOlympicResults } from "~/lib/api/client"
import { TOURNAMENTS_COPY } from "~/content/tournaments"

/**
 * Olympic Results — Figma node `385:17860`.
 *
 * A gold heading over five columns of results and a silver button under them.
 *
 * **A real `<table>`, not a grid of divs.** The design draws a header row over
 * data rows, each cell answering the same question down the column — which is
 * what a table is, and what lets a screen reader say "Category, Doubles" rather
 * than reading five loose words. The row backgrounds are on the cells so a row
 * still reads as one band once the columns stack.
 *
 * Below `lg` the table scrolls sideways inside its own box rather than
 * collapsing into cards: five short columns stay legible at 720px, and a
 * horizontal scroller keeps the header attached to its data.
 *
 * The design sets the rows in DM Sans, which the site does not load — it ships
 * Inter and Bebas (DESIGN-TOKENS §1) — so they are Inter at the same size, the
 * same substitution `SupportCard` makes for Inter Display.
 */
const { data: results } = await useAsyncData(
  "tournaments-olympic-results",
  () => getOlympicResults(),
  { default: () => [] },
)

const columns = TOURNAMENTS_COPY.results.columns

// Bebas 36/44 in `#616161` (`381:17797`). The header row has no fill in the
// design, unlike the rows under it.
const TH =
  "font-display text-muted px-6 py-4 text-[length:var(--text-display-label)] leading-[1.22] font-normal uppercase"
const TD =
  "font-sans bg-white/12 px-6 py-6 align-middle text-[length:var(--text-body-md)] leading-10 text-white"
</script>

<template>
  <section
    v-if="results.length > 0"
    aria-labelledby="olympic-results-heading"
    class="bg-bg flex flex-col items-center gap-10 px-5 py-16 md:px-10 lg:gap-[2.5vw] lg:px-20 lg:py-[3.125vw]"
  >
    <MotionReveal :y="24">
      <h2
        id="olympic-results-heading"
        class="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-center text-[length:var(--text-display-sm)] leading-[0.95] text-transparent uppercase"
      >
        {{ TOURNAMENTS_COPY.results.heading }}
      </h2>
    </MotionReveal>

    <!-- The scroller, not the table, owns the overflow — a table that sets its
         own `overflow` loses its layout algorithm. -->
    <div class="w-full overflow-x-auto">
      <table
        class="w-full min-w-[840px] border-separate border-spacing-y-2 text-left"
      >
        <thead>
          <tr>
            <th scope="col" :class="cn(TH, 'w-[124px]')">{{ columns.year }}</th>
            <th scope="col" :class="cn(TH, 'w-[560px]')">{{ columns.event }}</th>
            <th scope="col" :class="cn(TH, 'w-[240px]')">{{ columns.category }}</th>
            <th scope="col" :class="TH">{{ columns.winners }}</th>
            <th scope="col" :class="cn(TH, 'text-right')">
              {{ columns.federation }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="result in results" :key="result.id">
            <!-- `rounded-l`/`rounded-r` on the end cells: the row's 12px radius
                 belongs to the band, and `border-separate` means the row itself
                 cannot carry a background. -->
            <td :class="cn(TD, 'rounded-l-[var(--radius-glass)]')">
              {{ result.year }}
            </td>
            <td :class="TD">{{ result.event }}</td>
            <td :class="TD">{{ result.category }}</td>
            <td :class="TD">{{ result.winners }}</td>
            <td :class="cn(TD, 'rounded-r-[var(--radius-glass)] text-right')">
              {{ result.federation }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UiSilverCta :href="TOURNAMENTS_COPY.results.moreHref">
      {{ TOURNAMENTS_COPY.results.more }}
    </UiSilverCta>
  </section>
</template>
