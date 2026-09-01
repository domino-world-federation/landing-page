<script setup lang="ts">
import { getTournaments } from "~/lib/api/client"
import type { Tournament, TournamentRegistration } from "~/lib/api/types"
import {
  ALL_TOURNAMENTS_COPY,
  TOURNAMENT_FILTERS,
} from "~/content/tournaments/all"

/**
 * `/tournaments/all` — Figma screen `517:2487`.
 *
 * The archive the landing rail's "View all" leads to: a 530px header carrying a
 * back link, the title and a search field, then a 468px filter column beside a
 * two-up grid of the same `TournamentCard` the rail draws (`517:2528` is that
 * card, unchanged), ending on a pager.
 *
 * **Everything the reader can change lives in the URL** — `?status=`, `?q=` and
 * `?page=`. That is the call D50 records for the news archive and D50's reasons
 * hold here three times over: the list renders on the server, nothing has to
 * hydrate before it is right, and a filtered, searched, paged view is an address
 * somebody can send. It also means Back works: pressing it steps through the
 * filters a reader tried rather than leaving the page.
 *
 * **This page does NOT snap.** `/tournaments` scrolls section by section because
 * every one of its bands is a screen; this is a list of unknown length, and
 * mandatory snapping over a grid that grows with the feed would fight the reader
 * rather than pace them.
 *
 * The filter runs in `getTournaments` — the real endpoint takes
 * `?registration=`, and a page slicing the full feed itself would keep
 * downloading every tournament to show four. The search runs here, because there
 * is no `?q=` on the endpoint yet and inventing one in the client would be
 * writing the backend's contract from the wrong end.
 */
useSeoMeta({
  title: "All Tournaments | Domino World Federation",
  description:
    "Every sanctioned Domino World Federation tournament — open, upcoming, under way and completed — with dates, venues and entry states.",
})

const route = useRoute()

/** `undefined` for "All", and for a `?status=` naming a row that does not
 *  exist — a made-up query should show the whole list, not an empty one. */
const status = computed(() => {
  const raw = route.query.status
  if (typeof raw !== "string") return undefined
  return TOURNAMENT_FILTERS.some((f) => f.value === raw) ? raw : undefined
})

const query = computed(() =>
  typeof route.query.q === "string" && route.query.q.trim()
    ? route.query.q.trim()
    : undefined,
)

const page = computed(() => {
  const raw = Number(route.query.page)
  return Number.isInteger(raw) && raw > 0 ? raw : 1
})

/**
 * "Ended" is the one row that is not a registration state — see the note on
 * `TOURNAMENT_FILTERS`. It asks the API for everything and narrows on `status`,
 * because whether a tournament has been PLAYED is a different question from
 * whether its entries are open.
 */
const registration = computed<TournamentRegistration | undefined>(() =>
  status.value && status.value !== "ended"
    ? (status.value as TournamentRegistration)
    : undefined,
)

const { data: fetched } = await useAsyncData(
  "tournaments-all",
  () => getTournaments(registration.value),
  { watch: [registration], default: () => [] },
)

/** Matched against the fields a reader would type: the name, where it is, and
 *  what kind of event it is. Case-insensitive — nobody types "Montego Bay"
 *  with the capitals. */
function matches(tournament: Tournament, term: string) {
  const haystack =
    `${tournament.name} ${tournament.location} ${tournament.category}`.toLowerCase()
  return haystack.includes(term.toLowerCase())
}

const filtered = computed(() => {
  const list =
    status.value === "ended"
      ? fetched.value.filter((t) => t.status === "completed")
      : fetched.value

  return query.value ? list.filter((t) => matches(t, query.value!)) : list
})

/** Six to a page, which is what `517:2527` draws — two columns of three. */
const PER_PAGE = 6

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / PER_PAGE)),
)

/**
 * Clamped rather than trusted. `?page=99` on a two-page list would otherwise
 * render an empty grid under a pager saying "99 of 2" — which reads as the feed
 * having broken rather than as the URL being wrong.
 */
const currentPage = computed(() => Math.min(page.value, totalPages.value))

const shown = computed(() =>
  filtered.value.slice(
    (currentPage.value - 1) * PER_PAGE,
    currentPage.value * PER_PAGE,
  ),
)

/** One place that knows what this page's query looks like, so the pager does
 *  not have to carry the filter and the search around with it. */
function hrefForPage(target: number) {
  const search = new URLSearchParams()
  if (status.value) search.set("status", status.value)
  if (query.value) search.set("q", query.value)
  if (target > 1) search.set("page", String(target))

  return search.size > 0 ? `/tournaments/all?${search}` : "/tournaments/all"
}
</script>

<template>
  <main>
    <UiPageHeader
      :title="ALL_TOURNAMENTS_COPY.title"
      :back="ALL_TOURNAMENTS_COPY.back"
    >
      <template #aside>
        <TournamentsAllSearch :query="query" :status="status" />
      </template>
    </UiPageHeader>

    <!-- 468 + 1452 at the design width. The filter column comes SECOND in the
         source and is pulled back with `order` above `lg`, so a reader on a
         phone — and a screen reader on any width — meets the tournaments before
         the index of them. The same construction `/gallery` uses. -->
    <div
      class="flex flex-col gap-10 px-5 pb-16 md:px-10 lg:flex-row lg:items-start lg:gap-12 lg:px-20 lg:pb-24"
    >
      <div class="lg:order-first lg:w-[340px] lg:shrink-0">
        <!-- Sticky, because the grid is taller than the window and a filter
             column that scrolls away is one the reader has to go back up for.
             `top` clears the fixed navbar. -->
        <div
          class="lg:sticky lg:top-32 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto"
        >
          <TournamentsAllFilters :active="status" :query="query" />
        </div>
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-12">
        <p
          v-if="shown.length === 0"
          class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60"
        >
          {{ ALL_TOURNAMENTS_COPY.empty }}
        </p>

        <!-- `auto-rows-fr` so two cards on a row are the same height whatever
             their names do — the buttons sit on the card's foot via `mt-auto`,
             so equal heights are what keeps them on one line across the row.

             2-up only from `menu-lg`: the card is 676 wide in the design and
             carries a 620-wide picture, so below ~1600 a two-column row leaves
             each card too narrow for its own tabs. -->
        <ul
          v-else
          :aria-label="ALL_TOURNAMENTS_COPY.listLabel"
          class="grid auto-rows-fr list-none gap-5 menu-lg:grid-cols-2"
        >
          <li v-for="(tournament, i) in shown" :key="tournament.id">
            <MotionReveal :y="24" :delay="i * 0.06" class="h-full [&>*]:h-full">
              <TournamentsTournamentCard :tournament="tournament" fluid />
            </MotionReveal>
          </li>
        </ul>

        <TournamentsPager
          :page="currentPage"
          :total-pages="totalPages"
          :href-for="hrefForPage"
        />
      </div>
    </div>
  </main>
</template>
