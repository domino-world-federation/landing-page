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
  <!-- One screen: `581:14648` is 1920 × 1080, the second of the two full-frame
       bands the page opens with. See `Hero` for why the height is `dvh` rather
       than the design's ratio. -->
  <section
    v-if="tournaments.length > 0"
    aria-labelledby="tournament-rail-heading"
    class="flex snap-screen flex-col justify-center bg-linear-to-b from-[var(--color-surface-dark)] to-transparent px-5 pt-28 pb-10 md:px-10 lg:px-20 lg:pt-[max(var(--nav-clearance),7.29vw)] lg:pb-0"
  >
    <TournamentsCardRail :label="TOURNAMENTS_COPY.rail.label">
      <!-- The name, the button and the arrows on one line, which is how
           `581:14649` frames them. They used to be two rows — the heading here
           and the arrows inside the rail — and the extra band was most of what
           pushed this section past a screen. -->
      <template #heading>
        <MotionReveal :y="24">
          <!-- Bebas 100/108 — `--text-display-statement`, the step the
               Development page's own 100px heading already measured. -->
          <h2
            id="tournament-rail-heading"
            class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
          >
            {{ TOURNAMENTS_COPY.rail.heading }}
          </h2>
        </MotionReveal>
      </template>

      <!-- Past the arrows, on the far right of the row, which is where
           `581:14655` puts it. It used to sit beside the heading. -->
      <template #trailing>
        <NuxtLink
          :to="TOURNAMENTS_COPY.rail.viewAllHref"
          class="font-display focus-visible:ring-gold flex h-16 items-center justify-center rounded-[var(--radius-btn)] bg-white/20 px-5 text-[length:var(--text-display-caption)] leading-[1.25] whitespace-nowrap text-white uppercase transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:outline-none"
        >
          {{ TOURNAMENTS_COPY.rail.viewAll }}
        </NuxtLink>
      </template>

      <TournamentsTournamentCard
        v-for="tournament in tournaments"
        :key="tournament.id"
        :tournament="tournament"
      />
    </TournamentsCardRail>
  </section>
</template>
