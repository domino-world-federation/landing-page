<script setup lang="ts">
import { getResources } from "~/lib/api/client"
import { DOCUMENT_CATEGORY } from "~/lib/api/categories"
import { TOURNAMENTS_COPY } from "~/content/tournaments"

/**
 * Tournament Regulations — Figma node `381:17589`.
 *
 * A gold heading on the left, the documents in a 1136 column on the right.
 *
 * **Built as S10's and `/development`'s shelf, not as the news one.** It drew
 * `ui/DocumentCard` in a wrapping flex row before, and that is what put it out of
 * step with the rest of the site: `grow` on a wrapping row means the last card
 * takes whatever the row has left, so three documents came out as two cards over
 * one stretched across the full width. The other two shelves are a real 2×2 grid
 * with `auto-rows-fr`, so the cards are the same size whatever the count and the
 * third one keeps its column. Same layout here, same `ui/ResourceCard` in it —
 * this is the third page to file documents under a gold heading, and three of
 * them looking alike is the point (D32/D43).
 *
 * Asked for by category rather than by count: this is a shelf holding however
 * many documents the federation files under it, unlike S10's 2×2 grid which had
 * to state a number because its four documents share no shelf (D45).
 *
 * A snap stop with its own navbar clearance, like the rest of the page: the gold
 * heading sits at the top of the band and the bar is fixed over the first 112px,
 * so without the clearance the section arrives with its title behind it.
 */
const { data: documents } = await useAsyncData(
  "tournament-regulations",
  /*
   * TWO categories, concatenated. The tournament page is the only place that
   * shows both: the federation's standing rules (which apply to every event)
   * and the paperwork for running one (schedules, participant guides, results).
   * They are separate categories because they appear in different places —
   * `Rules & Regulations` is also on `/domino`, `Tournament Documents` is here
   * and nowhere else — but a reader on this page wants one shelf, not two.
   *
   * Rules first, then the event paperwork: the order is the argument, same as
   * everywhere else on this site.
   */
  async () => {
    const [rules, documents] = await Promise.all([
      getResources(DOCUMENT_CATEGORY.rules),
      getResources(DOCUMENT_CATEGORY.tournament),
    ])
    return [...rules, ...documents]
  },
  { default: () => [] },
)
</script>

<template>
  <section
    v-if="documents.length > 0"
    aria-labelledby="tournament-regulations-heading"
    class="bg-bg flex flex-col px-5 pt-28 pb-16 md:px-10 lg:px-20 lg:pt-[max(var(--nav-clearance),7.29vw)] lg:pb-[3.125vw]"
  >
    <!-- The 356 / 268 / 1136 split the other two shelves use, written as growth
         factors rather than pixels (D14): holding the heading at 360 while the
         grid shrinks gives it a wider measure than the cards beside it at every
         width under 1920. -->
    <div class="flex flex-col gap-10 lg:flex-row lg:gap-[13.96vw]">
      <MotionReveal :y="40" class="lg:shrink-0 lg:grow-[356] lg:basis-0">
        <!-- Bebas 76/72, held to the left column so it sets as two lines beside
             the shelf (`381:17631`). -->
        <h2
          id="tournament-regulations-heading"
          class="font-display w-fit text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
        >
          {{ TOURNAMENTS_COPY.regulations.heading }}
        </h2>
      </MotionReveal>

      <div class="lg:grow-[1136] lg:basis-0">
        <!-- 2-up only from `menu-lg`, for the reason S10 measured: the pill
             inside each card is a fixed 160px, so what governs is how much of
             the card is left for the title, and below 1600 a two-column row
             takes these titles to three lines against the design's one. -->
        <div class="grid auto-rows-fr gap-4 menu-lg:grid-cols-2">
          <MotionReveal
            v-for="(document, i) in documents"
            :key="document.id"
            :y="24"
            :delay="i * 0.08"
            class="h-full [&>*]:h-full"
          >
            <!-- `publishedAt` is optional on the type, so an undated document
                 falls back to its category rather than leaving the card's meta
                 line blank — the same guard the library shelf carries. -->
            <UiResourceCard
              :doc="document"
              :meta="
                document.publishedAt
                  ? formatLongDate(document.publishedAt)
                  : document.category
              "
              :download-label="TOURNAMENTS_COPY.regulations.downloadLabel"
            />
          </MotionReveal>
        </div>
      </div>
    </div>
  </section>
</template>
