<script setup lang="ts">
import type { TournamentDetail } from "~/lib/api/types"
import { TOURNAMENT_DETAIL_COPY } from "~/content/tournaments/detail"

/**
 * The white document panel — Figma node `517:2044`.
 *
 * Everything a reader would go to a tournament's page FOR, set as a document
 * rather than as a row of bands: the overview, who may enter, when things
 * happen, how it is played, and the papers that govern it. Five blocks divided
 * by 4px `#DADADA` rules, all on one white 20px-radius panel.
 *
 * **The blocks are conditional and the rules follow them.** A tournament with no
 * schedule filed should not show a "Schedule" heading over nothing, and it
 * should not leave a divider hanging where the block would have been either —
 * so the sections are collected first and the rule is drawn *between* whatever
 * survives, never as part of a block.
 *
 * The summary is one field split on blank lines. Figma types two paragraphs
 * (`517:2047`); storing them as an array would make the API decide where the
 * paragraph breaks go, and storing the newlines and printing them raw would set
 * both paragraphs as one wall.
 */
const props = defineProps<{ tournament: TournamentDetail }>()

const COPY = TOURNAMENT_DETAIL_COPY.overview

const paragraphs = computed(() =>
  props.tournament.summary
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean),
)

/**
 * Which blocks this tournament actually has, in the design's order.
 *
 * A list rather than five `v-if`s in the template, because the dividers depend
 * on what is present: the rule goes between neighbours, and only a list knows
 * who its neighbours turned out to be.
 */
const blocks = computed(() =>
  (
    [
      { id: "overview", heading: COPY.heading, show: paragraphs.value.length > 0 },
      {
        id: "eligibility",
        heading: COPY.eligibility,
        show: (props.tournament.eligibility?.length ?? 0) > 0,
      },
      {
        id: "schedule",
        heading: COPY.schedule,
        show: (props.tournament.schedule?.length ?? 0) > 0,
      },
      {
        id: "format",
        heading: COPY.format,
        show: (props.tournament.format?.length ?? 0) > 0,
      },
      {
        id: "regulations",
        heading: COPY.regulations,
        show: (props.tournament.regulations?.length ?? 0) > 0,
      },
    ] as const
  ).filter((block) => block.show),
)

const HEADING =
  "font-display text-[length:var(--text-display-sm)] leading-[0.95] text-black uppercase"
/** The two fact blocks wrap two 710s inside 1600, which is a 2×2 stated as a
 *  wrapping row — written as a real grid for the reason the document shelves
 *  are: `grow` on a wrapping row stretches an odd last card across the width. */
const FACT_GRID = "grid auto-rows-fr gap-5 menu-lg:grid-cols-2"
</script>

<template>
  <section
    v-if="blocks.length > 0"
    class="px-5 py-16 md:px-10 lg:px-20 lg:pt-[4.17vw] lg:pb-0"
  >
    <div
      class="flex flex-col gap-8 rounded-[var(--radius-card)] bg-white px-5 py-10 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] md:px-10 lg:gap-12 lg:px-[8.33vw] lg:py-[3.13vw]"
    >
      <template v-for="(block, i) in blocks" :key="block.id">
        <!-- The 4px rule, between blocks and never inside one (`517:2048`). -->
        <hr v-if="i > 0" class="h-1 border-0 bg-[#DADADA]" >

        <div class="flex flex-col gap-8">
          <MotionReveal :y="24">
            <h2 :class="HEADING">{{ block.heading }}</h2>
          </MotionReveal>

          <template v-if="block.id === 'overview'">
            <p
              v-for="paragraph in paragraphs"
              :key="paragraph"
              class="font-sans text-[length:var(--text-display-caption)] leading-[1.5] text-[#616161]"
            >
              {{ paragraph }}
            </p>
          </template>

          <div v-else-if="block.id === 'eligibility'" :class="FACT_GRID">
            <TournamentsDetailFactCard
              v-for="fact in tournament.eligibility"
              :key="fact.id"
              :fact="fact"
            />
          </div>

          <TournamentsDetailSchedule
            v-else-if="block.id === 'schedule'"
            :entries="tournament.schedule ?? []"
          />

          <div v-else-if="block.id === 'format'" :class="FACT_GRID">
            <TournamentsDetailFactCard
              v-for="fact in tournament.format"
              :key="fact.id"
              :fact="fact"
            />
          </div>

          <!-- The regulations shelf (`517:2153`). `ui/ResourceCard` is the site's
               document card and this is its fourth user — the one difference is
               the outline, which it needs because these sit on white rather than
               on the dark page the other three are drawn on. -->
          <div v-else :class="FACT_GRID">
            <UiResourceCard
              v-for="document in tournament.regulations"
              :key="document.id"
              :doc="document"
              outlined
              :meta="
                document.publishedAt
                  ? COPY.publishedOn.replace(
                      '%s',
                      formatLongDate(document.publishedAt),
                    )
                  : document.category
              "
              :download-label="COPY.downloadLabel"
            />
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
