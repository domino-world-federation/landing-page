<script setup lang="ts">
import { GOVERNANCE_COPY } from "~/content/governance"

/**
 * `/governance` — Figma screen `613:24831`.
 *
 * The tenth page, and the first of the two navbar entries that were still `#`.
 * Six blocks: the header, the assembly photograph, the white Overview band, the
 * institutional commitments, the governance documents, and the strategic plan.
 * The design's seventh, the Governance Repository, was folded into the
 * documents shelf by the federation's revision (2026-09-28) — both drew the
 * same category.
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
 * two. Figma starts the artwork where the strategic plan begins and runs it to
 * the foot of the document, so anchoring the layer to the bottom reproduces
 * both ends without measuring a section whose height depends on how its copy
 * wraps.
 *
 * **1699 is the strategic plan plus the footer** — 1080 + 619 at the design
 * width. The design's 2779 also covered the Governance Repository, a second
 * 1080 screen; with that section gone the old ratio would start the beam's head
 * a screen above the plan, over the documents shelf.
 *
 * **The floor is not decoration.** The ratio is measured against the viewport's
 * WIDTH and the section it has to cover is measured in `dvh`, so the two agree
 * only at 16:9. `100dvh` is that section exactly, and `32.24vw` is the design's
 * own footer (619 of 1920) — so the minimum is the same measurement the ratio
 * makes, taken in the units the page is actually built in. Whichever is larger
 * wins.
 */
definePageMeta({
  shine: { aspectClass: "aspect-[1920/1699] min-h-[calc(100dvh+32.24vw)]" },
})

useHead({ htmlAttrs: { class: "snap-sections" } })

useSeoMeta({
  title: "Governance | Domino World Federation",
  description:
    "How the Domino World Federation is run — its role and commitments, governance documents, and the Domino Agenda 2030 Strategic Plan.",
})
</script>

<template>
  <main class="snap-children relative z-10">
    <GovernanceHeader />

    <!-- **Three stops a screen apart: the picture, the composite, the cover** —
         About's leadership band, on this page's own photograph, and the same
         arrangement Development carries.

         **The numbers are this section's.** `613:24895` is a 540-tall white
         band in a 1080 frame, so the Overview is held to `50dvh`; the wrapper is
         three screens; the picture is `sticky` and one screen tall, so it stays
         pinned until the last of them, through both beats that need it behind.
         The panel runs from `150dvh` to the wrapper's foot — 200 minus the
         band's own 50 — which at the second beat puts the band's head exactly
         `50dvh` above the bottom of the screen, and at the third has it at the
         top. `top-[25dvh]` is `(100 - 50) / 2`, the offset that pins it centred
         once the white covers.

         The band is `sticky` inside its panel because the ground has to keep
         rising after the copy has stopped; without it the third beat is a blank
         white screen with the words scrolled off it. The threshold does the
         second beat's work for free: there the band sits 50dvh down, below 25
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
        src="/assets/governance/band-governance-assembly.webp"
        :alt="GOVERNANCE_COPY.bandAlt"
      />

      <!-- The panel is the GROUND and the section inside it is the copy: two
           elements because the ground has to keep rising after the copy stops.
           `bg-white` because that is what Overview itself is — this page's one
           white ground, and the two have to meet invisibly. Overview keeps the
           `z-10` it carries itself, which decides that it covers the picture. -->
      <div class="relative z-10 bg-white lg:absolute lg:inset-x-0 lg:top-[150dvh] lg:bottom-0">
        <GovernanceOverview
          class="min-h-[50dvh] lg:sticky lg:top-[25dvh] lg:h-[50dvh]"
        />
      </div>
    </div>

    <GovernanceCommittees />
    <GovernanceStatutes />
    <GovernanceStrategy />
  </main>
</template>
