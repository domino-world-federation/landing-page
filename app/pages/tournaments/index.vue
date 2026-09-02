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
 * rail of all tournaments, the regulations shelf, Executive Boards, the media
 * gallery, the Olympic results table, the FAQ, and the footer.
 *
 * **Three blocks are other pages' components, unchanged in substance.** The
 * media collage is the news page's `MediaGallery` — the same picture desk
 * reading the same endpoint — with a prop for the heading's colour; the
 * regulations shelf is built on `ui/DocumentCard`, which the news press shelf
 * drew first; Executive Boards is About's strip under a gold heading. All three
 * moved on their second user, never on the guess that there would be one
 * (D32/D43).
 *
 * **The hero and the highlighted band print one record**,
 * `getHighlightedTournament()`. Figma names the event twice with two different
 * years; a page that contradicts itself about which tournament it is opening
 * with is a defect rather than a variation.
 *
 * **Champions Hall is back and Executive Boards is gone**, which is the reverse
 * of the swap made earlier. Champions Hall came out as the page's one open
 * identity risk — R16, real faces under real names claiming titles that do not
 * exist — and Executive Boards was built to take its place. The repo owner has
 * asked for the reverse; what makes it safe is that the data no longer carries
 * the claim (see `ChampionsHall`). `TournamentsExecutiveBoards` is still in the
 * repo and nothing renders it — the About page draws the same board from the
 * same endpoint, so the officers are still on the site.
 */
useSeoMeta({
  title: "Tournaments | Domino World Federation",
  description:
    "Sanctioned domino tournaments — the season's highlighted event, the full calendar, competition regulations, past champions and Olympic results.",
})

/**
 * Tournaments scrolls section by section, like the landing page, About and
 * Domino.
 *
 * The class rides on `<html>` because that is the document's scrollport —
 * `scroll-snap-type` on `<body>` is ignored. Declared here rather than in the
 * `default` layout because that layout serves eleven routes and only three of
 * them snap; unhead takes the attribute off again on route change.
 *
 * `snap-children` on `<main>` then makes every direct child a stop — the rule is
 * in `main.css`.
 */
useHead({ htmlAttrs: { class: "snap-sections" } })

const { data: highlighted } = await useAsyncData(
  "tournaments-highlighted",
  () => getHighlightedTournament(),
)
</script>

<template>
  <main class="snap-children">
    <!-- The two event blocks are absent rather than empty when the feed has
         nothing highlighted: a hero with no tournament in it is a band of
         gradient, and the page still has eight blocks that stand alone. -->
    <template v-if="highlighted">
      <TournamentsHero :event="highlighted" />
      <!-- The landing page's featured-event band, given the one event this page
           highlights. It is the same component on both, which is what the block
           looked like it should be all along: two pages showing the same kind of
           thing in two shapes is the reader's cost, not ours. `EventDetails`
           drops its pager for a single event rather than printing "1 of 1"
           beside two dead arrows. -->
      <UiFeaturedEvent :events="[highlighted]" />
    </template>
    <!-- The page still needs a name when its `<h1>` is the hero's. -->
    <h1 v-else class="sr-only">{{ TOURNAMENTS_COPY.pageTitle }}</h1>

    <TournamentsRail />
    <TournamentsRegulations />
    <TournamentsChampionsHall />
    <NewsMediaGallery heading-tone="gold" snap />
    <TournamentsOlympicResults />
    <TournamentsFaq />
  </main>
</template>
