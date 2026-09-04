<script setup lang="ts">
import { getTournament } from "~/lib/api/client"
import { TOURNAMENTS_COPY } from "~/content/tournaments"
import { TOURNAMENT_DETAIL_COPY } from "~/content/tournaments/detail"

/**
 * `/tournaments/[slug]` — Figma screen `517:1895`.
 *
 * One tournament, set as a document: the header names it and states what it is,
 * the band under it shows the hall and the two facts a reader came for, and the
 * blocks below answer the rest — where, what it pays, who to ask, who is
 * refereeing, who won, and the papers that govern it.
 *
 * **The order is the design's, and one part of it is worth stating.** Results &
 * Winners sits ABOVE the white overview panel (`517:2177` at y=3017, `517:2043`
 * at y=3695) rather than at the end, which reads oddly for a tournament that has
 * not been played — but it is the right order for one that has, which is the
 * only case where the block exists at all. So it stays where Figma puts it.
 *
 * **This page does not snap.** `/tournaments` scrolls section by section because
 * each of its bands is a screen; here the overview panel alone is three, and
 * mandatory snapping over a document is a reader fighting the page.
 *
 * A slug naming nothing is a real 404 rather than an empty page — `createError`
 * with `fatal` so the error page renders instead of a header over nothing.
 */
const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: tournament } = await useAsyncData(
  () => `tournament-${slug.value}`,
  () => getTournament(slug.value),
  { watch: [slug] },
)

if (!tournament.value) {
  throw createError({
    statusCode: 404,
    statusMessage: TOURNAMENT_DETAIL_COPY.notFound,
    fatal: true,
  })
}

// Non-null from here: the guard above throws, and `useSeoMeta` and the template
// both read the record. `computed` rather than `tournament.value!` at each use.
const event = computed(() => tournament.value!)

/*
 * Sama seperti `/news/[slug]`: rute dinamis tidak punya baris di "SEO &
 * Social", jadi `useCmsSeo()` tidak menyentuhnya dan tag bagikannya ditulis
 * dari record-nya sendiri.
 */
useSeoMeta({
  title: () => `${event.value.name} | Domino World Federation`,
  description: () =>
    `${event.value.dateLabel} — ${event.value.location}. ${event.value.formatLabel}.`,

  ogTitle: () => event.value.name,
  ogDescription: () =>
    `${event.value.dateLabel} — ${event.value.location}. ${event.value.formatLabel}.`,
  ogImage: () => event.value.imageUrl,
  ogType: "website",

  twitterCard: () => (event.value.imageUrl ? "summary_large_image" : "summary"),
  twitterTitle: () => event.value.name,
  twitterDescription: () =>
    `${event.value.dateLabel} — ${event.value.location}.`,
  twitterImage: () => event.value.imageUrl,
})
</script>

<template>
  <main>
    <!-- The header band (`517:1896`): the back link and the name on the left,
         what kind of event it is on the right. `UiPageHeader`'s `aside` slot is
         where the other five pages put a search field or a date — here it is the
         event's own summary line. -->
    <UiPageHeader
      :title="[event.name]"
      :back="TOURNAMENT_DETAIL_COPY.back"
    >
      <template #aside>
        <div class="flex flex-col gap-4 lg:items-end lg:text-right">
          <p
            class="font-display text-[length:var(--text-display-caption)] leading-[1.25] text-white/50 uppercase"
          >
            {{ event.category }}
          </p>

          <div class="flex flex-wrap items-center gap-4 lg:justify-end">
            <!-- The same two pills the card carries, so a reader arriving from
                 the rail meets the state in the same colours it was in. -->
            <span
              :class="
                cn(
                  'font-sans rounded-[5px] px-3 py-1 text-[length:var(--text-eyebrow)] leading-8 font-bold text-white uppercase',
                  {
                    open: 'bg-[#609f6f]',
                    upcoming: 'bg-[#dc8223]',
                    ongoing: 'bg-[#2383ff]',
                    closed: 'bg-[#8a8a8a]',
                  }[event.registration],
                )
              "
            >
              {{ TOURNAMENTS_COPY.rail.registration[event.registration] }}
            </span>
            <span
              class="font-sans rounded-[var(--radius-glass)] bg-white/12 px-3 py-1 text-[length:var(--text-eyebrow)] leading-8 font-medium text-white uppercase"
            >
              {{ event.attendance }}
            </span>
          </div>

          <p
            class="font-sans text-[length:var(--text-body-sm)] leading-8 text-[#8A8A8A] lg:max-w-[252px]"
          >
            {{ event.formatLabel }}
          </p>
        </div>
      </template>
    </UiPageHeader>

    <TournamentsDetailHero :tournament="event" />
    <TournamentsDetailPlaces :tournament="event" />
    <TournamentsDetailSupport :tournament="event" />

    <TournamentsDetailWinners
      v-if="event.winners?.length"
      :winners="event.winners"
    />

    <TournamentsDetailOverview :tournament="event" />

    <!-- The page closes on the picture desk (`586:15695`), under this page's own
         gold heading — the same collage `/news` and `/tournaments` draw. -->
    <NewsMediaGallery heading-tone="gold" />
  </main>
</template>
