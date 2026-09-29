<script setup lang="ts">
import { getOlympicResults } from "~/lib/api/client"
import { TOURNAMENTS_COPY } from "~/content/tournaments"
import { OLYMPICS_COPY } from "~/content/tournaments/olympics"

// Editable in the backoffice's page editor; the constants are the fallback.
const copy = usePageCopy("tournaments")

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
 * Below `lg` it is cards instead (repo owner's call, 2026-09-28). It used to
 * scroll sideways inside its own box, which kept the header attached to its
 * data but made a phone pan across 840px to read a single row. Both renderings
 * are in the markup and CSS picks one, so nothing differs between server and
 * client.
 *
 * The design sets the rows in DM Sans, which the site does not load — it ships
 * Inter and Bebas (DESIGN-TOKENS §1) — so they are Inter at the same size, the
 * same substitution `SupportCard` makes for Inter Display.
 *
 * A snap stop with its own navbar clearance, like the rest of the page: the gold
 * heading sits at the top of the band and the bar is fixed over the first 112px,
 * so without the clearance the section arrives with its title cut in half.
 */
const { data: results } = await useAsyncData(
  "tournaments-olympic-results",
  () => getOlympicResults(),
  { default: () => [] },
)

/**
 * Five rows, and the button under them for the rest.
 *
 * Figma draws five (`385:17838`) and a "More Olympic Results" button, which is
 * a full table on one screen only while the federation has recorded five
 * results. This band is a snap stop a screen tall; the twentieth result would
 * push the button off the bottom of it and the section would scroll inside a
 * page that scrolls by screens.
 *
 * The same number the full table pages by, taken from its copy rather than
 * written twice — five here and five there is one decision.
 */
const shown = computed(() => results.value.slice(0, OLYMPICS_COPY.perPage))

const columns = computed(() => {
  const c = TOURNAMENTS_COPY.results.columns
  return {
    year: copy.text("results.col_year", c.year),
    event: copy.text("results.col_event", c.event),
    category: copy.text("results.col_category", c.category),
    winners: copy.text("results.col_winners", c.winners),
    federation: copy.text("results.col_federation", c.federation),
  }
})

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
    class="bg-bg flex flex-col items-center justify-center gap-10 px-5 pt-16 pb-16 lg:snap-screen md:px-10 lg:gap-[2.5vw] lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[3.125vw]"
  >
    <MotionReveal :y="24">
      <h2
        id="olympic-results-heading"
        v-cms="'results.heading'"
        class="font-display mx-auto w-fit text-gold-gradient text-center text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
      >
        {{ copy.text('results.heading', TOURNAMENTS_COPY.results.heading) }}
      </h2>
    </MotionReveal>

    <!-- Below `lg`: one card per result. The table needed 840px and a phone
         had to pan sideways through every row to read one; a card puts the
         whole result in view, and the column names ride along as labels on
         the two values that need them. -->
    <ul class="flex w-full list-none flex-col gap-3 lg:hidden">
      <li
        v-for="result in shown"
        :key="result.id"
        class="flex flex-col gap-3 rounded-[var(--radius-glass)] bg-white/12 p-5"
      >
        <div class="flex items-center justify-between gap-4">
          <span
            class="font-display text-muted text-[length:var(--text-display-label)] leading-none"
          >
            {{ result.year }}
          </span>
          <span
            class="font-sans rounded-btn bg-white/12 px-3 py-1 text-sm leading-6 text-white/80"
          >
            {{ result.category }}
          </span>
        </div>
        <p class="font-sans text-lg leading-[1.4] font-semibold text-white">
          {{ result.event }}
        </p>
        <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm leading-6">
          <dt v-cms="'results.col_winners'" class="font-sans text-white/50">{{ columns.winners }}</dt>
          <dd class="font-sans text-white">{{ result.winners }}</dd>
          <dt v-cms="'results.col_federation'" class="font-sans text-white/50">{{ columns.federation }}</dt>
          <dd class="font-sans text-white">{{ result.federation }}</dd>
        </dl>
      </li>
    </ul>

    <!-- The scroller, not the table, owns the overflow — a table that sets its
         own `overflow` loses its layout algorithm. From `lg` only. -->
    <div class="hidden w-full overflow-x-auto lg:block">
      <table
        class="w-full min-w-[840px] border-separate border-spacing-y-2 text-left"
      >
        <thead>
          <tr>
            <th v-cms="'results.col_year'" scope="col" :class="cn(TH, 'w-[124px]')">{{ columns.year }}</th>
            <th v-cms="'results.col_event'" scope="col" :class="cn(TH, 'w-[560px]')">{{ columns.event }}</th>
            <th v-cms="'results.col_category'" scope="col" :class="cn(TH, 'w-[240px]')">{{ columns.category }}</th>
            <th v-cms="'results.col_winners'" scope="col" :class="TH">{{ columns.winners }}</th>
            <th v-cms="'results.col_federation'" scope="col" :class="cn(TH, 'text-right')">
              {{ columns.federation }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="result in shown" :key="result.id">
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
      <span v-cms="'results.more'">{{ copy.text('results.more', TOURNAMENTS_COPY.results.more) }}</span>
    </UiSilverCta>
  </section>
</template>
