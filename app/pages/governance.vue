<script setup lang="ts">
import { GOVERNANCE_COPY } from "~/content/governance"

/**
 * `/governance` — Figma screen `613:24831`.
 *
 * The tenth page, and the first of the two navbar entries that were still `#`.
 * Seven blocks in the design's order: the header, the assembly photograph, the
 * white Overview band, the standing committees, the statutes, the strategic
 * plan, and the governance repository.
 *
 * **The shell is About's, Domino's and Development's**, and deliberately: a
 * header band under the `fixed` navbar, a full-bleed photograph that is pinned
 * and then covered by the one white section, then the page's own sections. Four
 * pages of one site that open differently for no reason a reader could name is a
 * defect rather than a variation.
 *
 * **It scrolls section by section**, like the five pages before it. The class
 * rides on `<html>` because that is the document's scrollport —
 * `scroll-snap-type` on `<body>` is ignored — and is declared here rather than
 * in the `default` layout because that layout serves twelve routes and only
 * seven of them snap. Unhead takes the attribute off again on route change, and
 * `plugins/snap-release.client.ts` takes it off a frame earlier than that when a
 * navigation starts.
 *
 * The shine is declared here and rendered by the `default` layout, which also
 * supplies the `isolate` that keeps its `-z-10` from sliding behind the page
 * background; `<main>` sits above it at `z-10` and the footer paints between the
 * two. Figma starts the artwork at `y:2904` — where the strategic plan begins —
 * and runs it 1919px to the foot of the document, so anchoring to the bottom
 * reproduces both ends without measuring a section whose height depends on how
 * its copy wraps.
 */
definePageMeta({
  shine: { aspectClass: "aspect-[1920/1919]" },
})

useHead({ htmlAttrs: { class: "snap-sections" } })

useSeoMeta({
  title: "Governance | Domino World Federation",
  description:
    "How the Domino World Federation is run — its mandate and mission, standing committees, statutes and constitution, the 2026–2029 strategic plan, and the public governance repository.",
})
</script>

<template>
  <main class="snap-children relative z-10">
    <GovernanceHeader />

    <!-- The photograph is PINNED and the white band slides over it. `sticky`
         needs a containing block that outlives the sticky element, so the two
         are wrapped: the picture holds the top of the screen for as long as this
         wrapper is on it, and lets go the moment Overview's foot passes.
         Wrapping exactly these two is also what bounds it — sticky against
         `<main>` would leave the picture pinned behind the whole page.

         `z-0` against Overview's own `z-10` decides which one covers which. That
         section is the one white ground on this page and fully opaque, so it
         hides the picture completely as it arrives rather than veiling it. -->
    <div class="relative">
      <UiStickyBand
        src="/assets/governance/band-governance-assembly.png"
        :alt="GOVERNANCE_COPY.bandAlt"
      />
      <GovernanceOverview />
    </div>

    <GovernanceCommittees />
    <GovernanceStatutes />
    <GovernanceStrategy />
    <GovernanceRepository />
  </main>
</template>
