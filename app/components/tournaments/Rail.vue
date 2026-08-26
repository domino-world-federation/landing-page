<script setup lang="ts">
import { getTournaments } from "~/lib/api/client"
import { TOURNAMENTS_COPY } from "~/content/tournaments"

/**
 * All Tournaments — Figma node `373:17419`.
 *
 * A gold heading with the rail's arrows and a "View all" button beside it, four
 * cards below, and the hand-drawn scrollbar under those. The band fades from
 * `#262626` to nothing, which is what joins it to the white block above.
 *
 * The cards are handed to `CardRail` through its slot, so only the scroller's
 * position is ever re-read (RULES §5).
 */
const { data: tournaments } = await useAsyncData(
  "tournaments-rail",
  () => getTournaments(),
  { default: () => [] },
)
</script>

<template>
  <section
    v-if="tournaments.length > 0"
    aria-labelledby="tournament-rail-heading"
    class="bg-linear-to-b from-[var(--color-surface-dark)] to-transparent px-5 py-16 md:px-10 lg:px-20 lg:py-[4.17vw]"
  >
    <div class="flex flex-col gap-10 lg:gap-[3.125vw]">
      <!-- The heading row. The arrows live inside `CardRail` because they act on
           the scroller; this row carries the name and the button, and the two sit
           on one line at the design width. -->
      <div class="flex flex-wrap items-center justify-between gap-6">
        <MotionReveal :y="24">
          <!-- Bebas 100/108 — `--text-display-statement`, the step the
               Development page's own 100px heading already measured. -->
          <h2
            id="tournament-rail-heading"
            class="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-statement)] leading-[1.08] text-transparent uppercase"
          >
            {{ TOURNAMENTS_COPY.rail.heading }}
          </h2>
        </MotionReveal>

        <NuxtLink
          :to="TOURNAMENTS_COPY.rail.viewAllHref"
          class="font-display focus-visible:ring-gold flex h-16 items-center justify-center rounded-[var(--radius-btn)] bg-white/20 px-5 text-[length:var(--text-display-caption)] leading-[1.25] text-white uppercase transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:outline-none"
        >
          {{ TOURNAMENTS_COPY.rail.viewAll }}
        </NuxtLink>
      </div>

      <TournamentsCardRail :label="TOURNAMENTS_COPY.rail.label" show-progress>
        <TournamentsTournamentCard
          v-for="tournament in tournaments"
          :key="tournament.id"
          :tournament="tournament"
        />
      </TournamentsCardRail>
    </div>
  </section>
</template>
