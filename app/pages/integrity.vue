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
 * The shine is declared here and rendered by the `default` layout. Figma puts
 * the artwork at `y:4280` — exactly where the procedural flow begins — and runs
 * it 2779px to `y:7059`, the foot of the document, so anchoring the layer to the
 * bottom reproduces both ends without measuring a section whose height depends
 * on how its copy wraps.
 *
 * **2103 was the earlier draft's number and it stopped short**, the same way
 * Governance's 1919 did: that draft's sections were hug-height, and the redraw
 * makes both the flow and the report a full 1080 each, which takes the block
 * this layer backs from 2103 to 2779. The old ratio left the beam's head inside
 * the report form, so the flow sat on bare `--color-bg`.
 *
 * **The floor is not decoration.** The ratio is measured against the viewport's
 * WIDTH and the two sections it has to cover are measured in `dvh`, so the two
 * agree only at 16:9 — on a 1440 x 900 window the ratio yields 2084px against
 * content standing 2264 tall, and the head lands back inside the flow. `200dvh`
 * is those two sections exactly and `32.24vw` is the design's own footer (619 of
 * 1920), so the minimum states the same measurement in the units the page is
 * actually built in. The larger wins, which keeps Figma's number wherever
 * Figma's number is already enough. Governance carries the identical pair.
 */
definePageMeta({
  shine: { aspectClass: "aspect-[1920/2779] min-h-[calc(200dvh+32.24vw)]" },
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

    <!-- **Three stops a screen apart: the picture, the composite, the cover** —
         the arrangement About opened with and that Domino, Development and
         Governance now carry. Four pages of one site that open differently for
         no reason a reader could name is a defect rather than a variation.

         **The numbers are this section's own.** `601:17853` runs from y1610 to
         the Code of Ethics at y2310 — 700 of a 1080 frame — so Core Principles
         is held to `65dvh`, deeper than Governance's 50 because its right-hand
         frame wraps to two rows of principles rather than sitting on one. The
         wrapper is three screens; the picture is `sticky` and one screen tall,
         so it stays pinned through both beats that need it behind. The panel
         runs from `135dvh` to the wrapper's foot — 200 minus the band's own 65 —
         which at the second beat puts the band's head exactly `65dvh` above the
         bottom of the screen, and at the third has it at the top.
         `top-[17.5dvh]` is `(100 - 65) / 2`, the offset that pins it centred
         once the white covers.

         The band is `sticky` inside its panel because the ground has to keep
         rising after the copy has stopped; without it the third beat is a blank
         white screen with the words scrolled off it. The threshold does the
         second beat's work for free: there the band sits 65dvh down, below 17.5
         and so not yet pinned.

         **`snap-pass` because the wrapper is three screens tall.** A snap area
         taller than the screen is a band the reader may rest ANYWHERE inside
         rather than a position, and `scroll-snap-stop: always` cannot forbid
         passing through a region you are allowed to stop in.

         No `overflow-hidden` here: clipping on any ancestor of a sticky element
         cancels the sticking. -->
    <div class="snap-pass relative lg:h-[300dvh]">
      <!-- Markers rather than stops on the elements themselves — the picture is
           `sticky` and the band is `sticky` inside an `absolute` panel, so
           neither one's box is where it appears to be once it moves. -->
      <div
        aria-hidden="true"
        class="snap-stop pointer-events-none absolute inset-x-0 top-0 hidden h-px lg:block"
      />
      <div
        aria-hidden="true"
        class="snap-stop pointer-events-none absolute inset-x-0 top-[100dvh] hidden h-px lg:block"
      />
      <div
        aria-hidden="true"
        class="snap-stop pointer-events-none absolute inset-x-0 top-[200dvh] hidden h-px lg:block"
      />

      <UiStickyBand
        class="lg:snap-screen"
        src="/assets/integrity/band-integrity-hall.webp"
        :alt="INTEGRITY_COPY.bandAlt"
      />

      <!-- The panel is the GROUND and the section inside it is the copy: two
           elements because the ground has to keep rising after the copy stops.
           `bg-white` because that is what Core Principles itself is — this
           page's one white ground, and the two have to meet invisibly. The
           section keeps the `z-10` it carries itself, which decides that it
           covers the picture. -->
      <div class="relative z-10 bg-white lg:absolute lg:inset-x-0 lg:top-[135dvh] lg:bottom-0">
        <IntegrityPrinciples
          class="min-h-[65dvh] lg:sticky lg:top-[17.5dvh] lg:h-[65dvh]"
        />
      </div>
    </div>

    <IntegrityEthics />
    <IntegrityTechnical />
    <IntegrityFlow />
    <IntegrityReport />
  </main>
</template>
