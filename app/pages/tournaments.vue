<script setup lang="ts">
import { getHighlightedTournament } from "~/lib/api/client"
import { TOURNAMENTS_COPY } from "~/content/tournaments"

/**
 * `/tournaments` — Figma screen `366:17181`.
 *
 * The twelfth page, and the first drawn only in the `(NEW)` Figma file (D59):
 * until it arrived, "Tournaments" was one of the four navbar items pointing at
 * `#`. It is now a real destination, and the footer's entry follows it.
 *
 * Nine blocks, in the design's order: the hero, the highlighted tournament, the
 * rail of all tournaments, the regulations shelf, Champions Hall, the media
 * gallery, the Olympic results table, the FAQ, and the footer.
 *
 * **Two blocks are other pages' components, unchanged in substance.** The media
 * collage is the news page's `MediaGallery` — the same picture desk reading the
 * same endpoint — with a prop for the heading's colour; the regulations shelf is
 * built on `ui/DocumentCard`, which the news press shelf drew first. Both moved
 * on their second user, never on the guess that there would be one (D32/D43).
 *
 * **The hero and the highlighted band print one record**,
 * `getHighlightedTournament()`. Figma names the event twice with two different
 * years; a page that contradicts itself about which tournament it is opening
 * with is a defect rather than a variation.
 *
 * Champions Hall ships without portraits — see the component, and R16.
 */
useSeoMeta({
  title: "Tournaments | Domino World Federation",
  description:
    "Sanctioned domino tournaments — the season's highlighted event, the full calendar, competition regulations, past champions and Olympic results.",
})

const { data: highlighted } = await useAsyncData(
  "tournaments-highlighted",
  () => getHighlightedTournament(),
)
</script>

<template>
  <main>
    <!-- The two event blocks are absent rather than empty when the feed has
         nothing highlighted: a hero with no tournament in it is a band of
         gradient, and the page still has eight blocks that stand alone. -->
    <template v-if="highlighted">
      <TournamentsHero :event="highlighted" />
      <TournamentsHighlightedTournament :event="highlighted" />
    </template>
    <!-- The page still needs a name when its `<h1>` is the hero's. -->
    <h1 v-else class="sr-only">{{ TOURNAMENTS_COPY.pageTitle }}</h1>

    <TournamentsRail />
    <TournamentsRegulations />
    <TournamentsChampionsHall />
    <NewsMediaGallery heading-tone="gold" />
    <TournamentsOlympicResults />
    <TournamentsFaq />
  </main>
</template>
