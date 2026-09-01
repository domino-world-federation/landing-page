<script setup lang="ts">
import { getResources } from "~/lib/api/client"
import { GOVERNANCE_COPY } from "~/content/governance"

/**
 * The Governance Repository — Figma node `613:24958`.
 *
 * A 434px heading column on the left, the library wrapping in a 1136 block on
 * the right. Structurally S10's shelf and `/development`'s library again, and
 * built the same way: a real 2×3 grid with `auto-rows-fr` rather than a wrapping
 * flex row, because `grow` on a wrapping row stretches an odd last card across
 * the full width.
 */
const COPY = GOVERNANCE_COPY.repository

const { data: documents } = await useAsyncData(
  "governance-repository",
  () => getResources(COPY.category),
  { default: () => [] },
)
</script>

<template>
  <section
    v-if="documents.length > 0"
    aria-labelledby="repository-heading"
    class="flex snap-screen flex-col justify-center px-5 pt-28 pb-16 md:px-10 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[3.13vw]"
  >
    <!-- 434 / 1136 at the design width, written as growth factors rather than
         pixels (D14): holding the heading at 434 while the grid shrinks gives it
         a wider measure than the cards beside it at every width under 1920. -->
    <div class="flex flex-col gap-10 lg:flex-row lg:gap-[8.33vw]">
      <div
        class="flex flex-col gap-6 lg:shrink-0 lg:grow-[434] lg:basis-0 lg:gap-9"
      >
        <MotionReveal :y="32">
          <p
            class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white uppercase"
          >
            {{ COPY.eyebrow }}
          </p>
        </MotionReveal>

        <MotionReveal :y="40" :delay="STAGGER">
          <h2
            id="repository-heading"
            class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
          >
            {{ COPY.heading }}
          </h2>
        </MotionReveal>
      </div>

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
            :delay="i * 0.06"
            class="h-full [&>*]:h-full"
          >
            <UiResourceCard
              :doc="document"
              :meta="
                document.publishedAt
                  ? formatLongDate(document.publishedAt)
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
