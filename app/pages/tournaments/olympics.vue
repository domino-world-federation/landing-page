<script setup lang="ts">
import { getOlympicResults } from "~/lib/api/client"
import { OLYMPICS_COPY } from "~/content/tournaments/olympics"

/**
 * `/tournaments/olympics` — Figma screen `648:30473`.
 *
 * Every Olympic result the federation has recorded: a period column on the
 * left, the table on the right with each row opening to its own facts and the
 * champion's photograph, five rows to a page.
 *
 * **Where the "More Olympic Results" button has always pointed.** The button
 * under the table on `/tournaments` had `href="#"` — the silent no-op D28 rules
 * out — because there was nowhere for it to go. This is that page.
 *
 * **The period and the page ride in the URL** (D50), like every other filter on
 * this site: the tabs are links, the filtering happens during SSR, nothing has
 * to hydrate for it, and "2024, page 2" is an address somebody can send.
 *
 * **Filtered and sliced here, not by the API.** `/olympic-results` returns the
 * table, and the backoffice caps it at a hundred rows — small enough that one
 * request answers every tab and every page, and a reader who changes period
 * gets the answer without a round trip. This is the exception RULES §8 allows
 * where the whole set is small and bounded, not the general rule.
 */
useSeoMeta({
  title: "More Olympic Results | Domino World Federation",
  description: OLYMPICS_COPY.description,
})

const route = useRoute()

const { data: results } = await useAsyncData(
  "olympic-results",
  () => getOlympicResults(),
  { default: () => [] },
)

const period = computed(() =>
  typeof route.query.period === "string" ? route.query.period : undefined,
)

/**
 * The years to draw tabs for, newest first.
 *
 * Derived from the results rather than written down: a hard-coded 2022–2026
 * would print tabs that filter to nothing the year the federation files
 * nothing, and hide the year it files something in 2027. Sorted as strings
 * descending, which is what `year` is — the column holds "2024–25" as readily
 * as "2024", and neither is a number this page does arithmetic on.
 */
const periods = computed(() =>
  [...new Set(results.value.map((result) => result.year))].sort((a, b) =>
    b.localeCompare(a),
  ),
)

const filtered = computed(() =>
  period.value === undefined
    ? results.value
    : results.value.filter((result) => result.year === period.value),
)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / OLYMPICS_COPY.perPage)),
)

/**
 * The page being read, clamped.
 *
 * `?page=99` on a two-page table is a URL somebody typed or a link that went
 * stale, and either way the honest answer is the last page rather than an empty
 * table under a pager that says there is more.
 */
const page = computed(() => {
  const asked = Number.parseInt(String(route.query.page ?? "1"), 10)
  if (!Number.isFinite(asked)) return 1
  return Math.min(Math.max(asked, 1), totalPages.value)
})

const shown = computed(() => {
  const start = (page.value - 1) * OLYMPICS_COPY.perPage
  return filtered.value.slice(start, start + OLYMPICS_COPY.perPage)
})

function hrefFor(target: number): string {
  const query = new URLSearchParams()
  if (period.value !== undefined) query.set("period", period.value)
  if (target > 1) query.set("page", String(target))

  const suffix = query.toString()
  return suffix === "" ? "/tournaments/olympics" : `/tournaments/olympics?${suffix}`
}

function periodHref(value?: string): string {
  // Never carrying `?page=` across: page 3 of every period is a page that
  // usually does not exist, and landing on it clamped reads as the tab having
  // silently taken you somewhere else.
  return value === undefined
    ? "/tournaments/olympics"
    : `/tournaments/olympics?period=${encodeURIComponent(value)}`
}

/**
 * Which row is open — one at a time, and none on arrival.
 *
 * Figma draws exactly one row expanded (`648:30585`) with a plus/minus rather
 * than a chevron, which is the affordance of a single-select accordion. Unlike
 * the FAQ list, none opens by default: a table's rows are readable closed, so
 * one hanging open would be a row the page had chosen to single out.
 */
const openId = ref("")

// A new page of rows is a new set of rows; leaving the old id set would open
// whichever row happened to share it, which is none of them.
watch([page, period], () => {
  openId.value = ""
})
</script>

<template>
  <main>
    <UiPageHeader
      :title="OLYMPICS_COPY.title"
      :back="{ label: OLYMPICS_COPY.back, href: OLYMPICS_COPY.backHref }"
    />

    <UiSideTabLayout sticky>
      <template #sidebar>
        <UiSideTabList :label="OLYMPICS_COPY.filterLabel">
          <UiSideTab :href="periodHref()" :active="period === undefined">
            {{ OLYMPICS_COPY.allPeriods }}
          </UiSideTab>
          <UiSideTab
            v-for="year in periods"
            :key="year"
            :href="periodHref(year)"
            :active="period === year"
          >
            {{ year }}
          </UiSideTab>
        </UiSideTabList>
      </template>

      <template #sidebarFooter>
        <UiSupportCard />
      </template>

      <div class="flex flex-col gap-12">
        <p
          v-if="shown.length === 0"
          class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60"
        >
          {{ OLYMPICS_COPY.empty }}
        </p>

        <template v-else>
          <!-- The column headings (`648:30575`). A row of labels rather than a
               `<thead>`, because the rows below are disclosures and not table
               rows: a real table cannot hold a panel that opens under one of
               its cells without the panel becoming a cell of its own. The
               headings are hidden from assistive tech for the same reason —
               each row's button already names its own year, event and
               category, so a screen reader reading these as well would hear the
               column titles once and then never again. -->
          <div
            aria-hidden="true"
            class="hidden items-center gap-4 px-6 md:flex"
          >
            <span
              class="font-display text-muted w-[124px] shrink-0 text-[length:var(--text-display-label)] leading-[1.22] uppercase"
            >
              {{ OLYMPICS_COPY.columns.year }}
            </span>
            <span
              class="font-display text-muted flex-1 text-[length:var(--text-display-label)] leading-[1.22] uppercase"
            >
              {{ OLYMPICS_COPY.columns.event }}
            </span>
            <span
              class="font-display text-muted hidden w-[290px] shrink-0 text-[length:var(--text-display-label)] leading-[1.22] uppercase lg:block"
            >
              {{ OLYMPICS_COPY.columns.category }}
            </span>
            <span class="size-8 shrink-0 lg:size-16" />
          </div>

          <ul class="flex flex-col gap-2">
            <TournamentsOlympicRow
              v-for="result in shown"
              :key="result.id"
              :result="result"
              :open="openId === result.id"
              @update:open="openId = $event ? result.id : ''"
            />
          </ul>
        </template>

        <TournamentsPager
          :page="page"
          :total-pages="totalPages"
          :href-for="hrefFor"
          :label="OLYMPICS_COPY.listLabel"
        />
      </div>
    </UiSideTabLayout>
  </main>
</template>
