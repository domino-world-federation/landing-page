<script setup lang="ts">
import { getChampions } from "~/lib/api/client"
import { TOURNAMENTS_COPY } from "~/content/tournaments"

/**
 * Champions Hall — Figma node `381:17633`.
 *
 * Four 540 × 700 cards on the page's own rail, each a portrait with the event
 * over the winner's name in a fall to black.
 *
 * **The photographs are the design's; the names are not.** Figma fills these
 * cards with pictures of real, identifiable public figures and types their real
 * names underneath as champions of this federation. The pictures go in on the
 * repo owner's decision — this is a prototype, and the design's assets go in as
 * drawn — while the names stay placeholders: every card is an identity claim,
 * and a real name under a real face states that a particular living person won a
 * title that does not exist. R16 carries both halves, and closes when real
 * champions and portraits the federation may publish arrive.
 *
 * `Champion.portraitUrl` is optional all the same, and the card renders either
 * way: a record without one falls back to the gold panel the file itself uses
 * for an artwork placeholder (`371:17267` and its siblings, three of which sit
 * loose beside this screen).
 */
const { data: champions } = await useAsyncData(
  "tournaments-champions",
  () => getChampions(),
  { default: () => [] },
)
</script>

<template>
  <section
    v-if="champions.length > 0"
    aria-labelledby="champions-heading"
    class="bg-bg px-5 py-16 md:px-10 lg:px-20 lg:py-[4.17vw]"
  >
    <div class="flex flex-col gap-10 lg:gap-[3.33vw]">
      <!-- Bebas 76/72 in white — no gold here, unlike the rail above it
           (`381:17635`). -->
      <h2
        id="champions-heading"
        class="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-white uppercase"
      >
        {{ TOURNAMENTS_COPY.champions.heading }}
      </h2>

      <TournamentsCardRail :label="TOURNAMENTS_COPY.champions.label">
        <TournamentsChampionCard
          v-for="champion in champions"
          :key="champion.id"
          :champion="champion"
        />
      </TournamentsCardRail>
    </div>
  </section>
</template>
