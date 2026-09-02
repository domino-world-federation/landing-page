<script setup lang="ts">
import { DOMINO_HEADER_ALT } from "~/content/domino/header"

/**
 * `/domino` — Figma screen `119:4737`, plus the wireframe `119:4474` for the two
 * blocks the hi-fi never drew.
 *
 * **Five sections, not eight.** The hi-fi now draws "The Rulebook" (`277:15676`,
 * tabbed) between FormatSplit and Regulations, plus hi-fi for the two blocks
 * below it that were built from the greyscale wireframe. None of that existed
 * when this page was written — it arrived with the `(NEW)` Figma file (D59), so
 * the missing block and the two extrapolated ones are still open as risk R12.
 *
 * Same shell as About, deliberately: two pages of one site that open differently
 * for no reason a reader could name is a defect, not a variation.
 */
useSeoMeta({
  title: "Domino | Domino World Federation",
  description:
    "The rules, formats and regulations of sanctioned dominoes — singles and doubles play, referee guidelines, and the federation's official rulebook.",
})

/**
 * Domino scrolls section by section, like About and the landing page.
 *
 * The class rides on `<html>` because that is the document's scrollport —
 * `scroll-snap-type` on `<body>` is ignored. Declared here rather than in the
 * `default` layout because that layout serves eleven routes and only two of them
 * snap; unhead takes the attribute off again on route change, so the rest are
 * untouched.
 *
 * `snap-children` on `<main>` then makes every direct child a stop — the rule is
 * in `main.css`. The band-and-formats pair below counts as ONE child, which is
 * what lets the picture stay put while the formats climb over it instead of the
 * two fighting for the same stop.
 */
useHead({ htmlAttrs: { class: "snap-sections" } })
</script>

<template>
  <main class="relative z-10 snap-children">
    <DominoHeader />

    <!-- **Two stops a screen apart: the picture, then the composite** — About's
         arrangement minus its third beat, on the repo owner's call. The picture
         pins and holds the first screen alone; over the next screen the formats
         climb out of the fold and come to rest across its lower three quarters,
         with the photograph still behind them. They do not go on to cover it:
         About's cover exists because its overview is a short band that would
         otherwise sit on the picture for a whole screen of scroll, and the
         formats are three quarters of the frame already.

         **The numbers are this section's, not About's.** The wrapper is exactly
         two screens and the picture is `sticky` and one screen tall, so it stays
         pinned across the whole of the first — through the beat that needs it
         behind. The formats are held to `74dvh`, which is what they measure at
         the design width (their own `max(560px, 35.42vw)` plus the section's
         padding), and pinned to the wrapper's FOOT: at the second beat that puts
         their head exactly 74dvh above the bottom of the screen, so no number
         here decides where they rest — the two screens and their own height do.

         No `sticky` on the formats and no panel behind them, both of which the
         third beat needed: the ground only has to keep rising after the copy
         stops if there is somewhere further for it to go.

         **`snap-pass` because the wrapper is two screens tall.** A snap area
         taller than the screen is a band the reader may rest anywhere inside
         rather than a position, and `scroll-snap-stop: always` cannot forbid
         passing through a region you are allowed to stop in — `main.css` records
         the rule. The markers are the stops instead.

         No `overflow-hidden` here: clipping on any ancestor of a sticky element
         cancels the sticking. -->
    <div class="snap-pass relative lg:h-[200dvh]">
      <!-- Markers rather than stops on the elements themselves — the picture is
           `sticky` and the formats are `absolute`, so neither one's box is where
           it appears to be, and a snap position attached to either would travel
           with the reader. Both are absolutely positioned, add no layout, and
           never move. -->
      <div
        aria-hidden="true"
        class="snap-stop pointer-events-none absolute inset-x-0 top-0 hidden h-px lg:block"
      />
      <div
        aria-hidden="true"
        class="snap-stop pointer-events-none absolute inset-x-0 top-[100dvh] hidden h-px lg:block"
      />

      <!-- `snap-screen` rather than a height: the band's own `44.27vw` and a
           `height: 100%` would be the same property fighting over stylesheet
           order, where a minimum simply takes the larger. -->
      <UiStickyBand
        class="lg:snap-screen"
        src="/assets/domino/band-table-match.png"
        :alt="DOMINO_HEADER_ALT.band"
      />

      <!-- `z-10` over the picture's `z-0` decides which covers which. The
           formats carry their own opaque gradient, so they hide the photograph
           where they land rather than veiling it. -->
      <div class="relative z-10 lg:absolute lg:inset-x-0 lg:bottom-0">
        <DominoFormatSplit class="min-h-[74dvh] lg:h-[74dvh]" />
      </div>
    </div>

    <DominoRulebook />
    <DominoRegulations />
    <DominoFaq />
  </main>
</template>
