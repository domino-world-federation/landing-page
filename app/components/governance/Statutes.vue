<script setup lang="ts">
import { getSectionResources } from "~/lib/api/client"
import { DOCUMENT_SECTION } from "~/lib/api/categories"
import { GOVERNANCE_COPY } from "~/content/governance"

/**
 * Governance Documents — Figma node `613:25154`.
 *
 * A gold heading and a sentence on the left, the documents on the right in two
 * columns. The design stacks them one to a row in a 560px column; the
 * federation's revision (2026-09-28) asks for 2 × 3, and folds the Governance
 * Repository below it into this shelf, since both drew the same category.
 *
 * So the layout is the repository's, which was already a 2 × 3 grid: a 434 /
 * 1136 split written as growth factors (D14), and a real grid with
 * `auto-rows-fr` rather than a wrapping flex row, because `grow` on a wrapping
 * row stretches an odd last card across the full width. `#0E0E0E` behind it,
 * which is the page background.
 *
 * The cards are `ui/ResourceCard`. `outlined` is NOT set — these sit on the dark
 * page, where a white card separates itself from its ground without an edge.
 */
const { data: documents } = await useAsyncData(
  "governance-statutes",
  () => getSectionResources(DOCUMENT_SECTION.governanceStatutes),
  { default: () => [] },
)
</script>

<template>
  <section
    v-if="documents.length > 0"
    aria-labelledby="statutes-heading"
    class="bg-bg flex snap-screen flex-col justify-center px-5 pt-28 pb-16 md:px-10 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[5.73vw]"
  >
    <div class="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-[8.33vw]">
      <div
        class="flex flex-col gap-6 lg:shrink-0 lg:grow-[434] lg:basis-0 lg:gap-9"
      >
        <MotionReveal :y="40">
          <h2
            id="statutes-heading"
            class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
          >
            {{ GOVERNANCE_COPY.statutes.heading }}
          </h2>
        </MotionReveal>

        <p
          class="font-sans text-[length:var(--text-heading-card)] leading-[1.22] text-white"
        >
          {{ GOVERNANCE_COPY.statutes.intro }}
        </p>
      </div>

      <div class="lg:grow-[1136] lg:basis-0">
        <!-- 2-up only from `menu-lg`: the pill inside each card is a fixed
             160px, so what governs is how much of the card is left for the
             title, and below 1600 a two-column row takes titles to three
             lines. -->
        <div class="grid auto-rows-fr gap-4 menu-lg:grid-cols-2">
          <MotionReveal
            v-for="(document, i) in documents"
            :key="document.id"
            :y="24"
            :delay="i * 0.06"
            class="h-full [&>*]:h-full"
          >
            <UiResourceCard
              :doc="document"
              :meta="
                document.publishedAt
                  ? `Published on ${formatLongDate(document.publishedAt)}`
                  : document.category
              "
              :download-label="GOVERNANCE_COPY.downloadLabel"
            />
          </MotionReveal>
        </div>
      </div>
    </div>
  </section>
</template>
