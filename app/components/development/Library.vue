<script setup lang="ts">
import { getResources } from "~/lib/api/client"
import { LIBRARY_COPY } from "~/content/development/library"

/**
 * Educational Resources — Figma node `192:14833`.
 *
 * Structurally S10 again: a 356px heading column, 268px of air, and a 1136px
 * block of four document cards in a 2×2. The widths are Figma's and are written
 * as fractions rather than pixels for the reason D14 records — holding the left
 * column at 356 while the grid shrinks gives the heading a wider measure than
 * the cards beside it at every width under 1920.
 *
 * The cards are `ui/ResourceCard`, the same component S10 draws, promoted out of
 * `home/` when this section turned out to want it (D43). It differs in one line:
 * S10 prints the document's category above the title and this prints its date,
 * so the line is a prop. The date is formatted here rather than stored formatted
 * — see `formatLongDate` for why the time zone is pinned.
 */
const { data: documents } = await useAsyncData(
  "development-library",
  () => getResources("Development"),
  { default: () => [] },
)
</script>

<template>
  <section
    aria-labelledby="library-heading"
    class="px-5 py-16 md:px-10 lg:px-20 lg:py-[3.13vw]"
  >
    <div class="flex flex-col gap-10 lg:flex-row lg:gap-[13.96vw]">
      <div
        class="flex flex-col gap-6 lg:shrink-0 lg:grow-[356] lg:basis-0 lg:gap-9"
      >
        <MotionReveal :y="32">
          <p
            class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white uppercase"
          >
            {{ LIBRARY_COPY.eyebrow }}
          </p>
        </MotionReveal>

        <MotionReveal :y="40" :delay="STAGGER">
          <h2
            id="library-heading"
            class="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-sm)] leading-[0.95] text-transparent uppercase"
          >
            {{ LIBRARY_COPY.heading }}
          </h2>
        </MotionReveal>
      </div>

      <div class="lg:grow-[1136] lg:basis-0">
        <!-- Figma wraps four fixed 560px cards inside 1136, which is a 2×2
             stated as a wrapping row. Written as a real grid, and 2-up only from
             `menu-lg` for the reason S10 measured: the pill inside each card is
             a fixed 160px, so what governs is how much of the card is left for
             the title, and below 1600 a two-column row takes these titles to
             three lines against the design's one. -->
        <div class="grid auto-rows-fr gap-4 menu-lg:grid-cols-2">
          <MotionReveal
            v-for="(doc, i) in documents"
            :key="doc.id"
            :y="24"
            :delay="i * 0.08"
            class="h-full [&>*]:h-full"
          >
            <!-- `publishedAt` is optional on the type — most documents in the
                 library have none, and only this section prints one. Falling
                 back to the category rather than to an empty line keeps the
                 card's shape if a document arrives undated. -->
            <UiResourceCard
              :doc="doc"
              :meta="doc.publishedAt ? formatLongDate(doc.publishedAt) : doc.category"
              :download-label="LIBRARY_COPY.downloadLabel"
            />
          </MotionReveal>
        </div>
      </div>
    </div>
  </section>
</template>
