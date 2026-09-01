<script setup lang="ts">
import { INTEGRITY_COPY } from "~/content/integrity"

/**
 * `/integrity` — Figma screen `601:17703`.
 *
 * The eleventh page, and the last of the two navbar entries that were `#`. Seven
 * blocks in the design's order: the header, the hall photograph, the white Core
 * Principles band, the Code of Ethics pictures, the technical overview, the
 * procedural flow, and the report form.
 *
 * **The shell is the one five pages before it use** — a header band under the
 * `fixed` navbar, a full-bleed photograph pinned and then covered by the one
 * white section, then the page's own sections.
 *
 * **It scrolls section by section.** The class rides on `<html>` because that is
 * the document's scrollport; declared here rather than in the `default` layout
 * because that layout serves twelve routes and only seven snap. Unhead removes
 * it on route change, and `plugins/snap-release.client.ts` removes it a frame
 * earlier when a navigation starts.
 *
 * The shine is declared here and rendered by the `default` layout. Figma starts
 * the artwork at `y:4010` — where the procedural flow begins — and runs it
 * 2103px to the foot of the document, so anchoring to the bottom reproduces both
 * ends without measuring a section whose height depends on how its copy wraps.
 */
definePageMeta({
  shine: { aspectClass: "aspect-[1920/2103]" },
})

useHead({ htmlAttrs: { class: "snap-sections" } })

useSeoMeta({
  title: "Integrity | Domino World Federation",
  description:
    "The federation's zero-tolerance policy on competitive integrity — core principles, the code of ethics, how the Tile-Trace engine detects manipulation, how a report is handled, and how to file one.",
})
</script>

<template>
  <main class="snap-children relative z-10">
    <IntegrityHeader />

    <!-- The photograph is PINNED and the white band slides over it. `sticky`
         needs a containing block that outlives the sticky element, so the two
         are wrapped: the picture holds the top of the screen for as long as this
         wrapper is on it, and lets go the moment Core Principles' foot passes.
         Wrapping exactly these two is what bounds it — sticky against `<main>`
         would leave the picture pinned behind the whole page.

         `z-0` against Core Principles' own `z-10` decides which covers which. -->
    <div class="relative">
      <UiStickyBand
        src="/assets/integrity/band-integrity-hall.png"
        :alt="INTEGRITY_COPY.bandAlt"
      />
      <IntegrityPrinciples />
    </div>

    <IntegrityEthics />
    <IntegrityTechnical />
    <IntegrityFlow />
    <IntegrityReport />
  </main>
</template>
