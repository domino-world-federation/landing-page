<script setup lang="ts">
import { getResources } from "~/lib/api/client"
import { GOVERNANCE_COPY } from "~/content/governance"

/**
 * Statutes & Constitution — Figma node `613:25154`.
 *
 * A gold heading and a sentence on the left (920 of the design's 1920), the two
 * founding documents on the right (560). `#0E0E0E` behind it, which is the page
 * background — the band is marked out by its padding rather than by a fill.
 *
 * The cards are `ui/ResourceCard`: this is the site's document card and this is
 * its fifth user. `outlined` is NOT set — these sit on the dark page, where a
 * white card separates itself from its ground without an edge.
 */
const { data: documents } = await useAsyncData(
  "governance-statutes",
  () => getResources(GOVERNANCE_COPY.statutes.category),
  { default: () => [] },
)
</script>

<template>
  <section
    v-if="documents.length > 0"
    aria-labelledby="statutes-heading"
    class="bg-bg flex snap-screen flex-col justify-center gap-10 px-5 pt-28 pb-16 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[5.73vw]"
  >
    <div class="flex flex-col gap-6 lg:w-[47.92%] lg:gap-9">
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

    <!-- 560 of 1920 is 29.17%. `auto-rows-fr` so the pair match whatever their
         titles do. -->
    <div class="grid auto-rows-fr gap-4 lg:w-[29.17%]">
      <MotionReveal
        v-for="(document, i) in documents"
        :key="document.id"
        :y="24"
        :delay="i * 0.08"
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
  </section>
</template>
