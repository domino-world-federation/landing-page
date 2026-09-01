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

    <!-- The photograph is PINNED and the formats slide over it — the same
         arrangement About uses for its leadership band. `sticky` needs a
         containing block that outlives the sticky element, so the two are
         wrapped: the picture holds the top of the screen for as long as this
         wrapper is on it, and lets go the moment the formats' foot passes.
         Wrapping exactly these two is also what bounds it — sticky against
         `<main>` would leave the picture pinned behind the whole page.

         `z-0` on the band against `z-10` on the formats decides which covers
         which; the formats carry the design's own opaque gradient, so they hide
         the picture completely rather than veiling it. -->
    <div class="relative">
      <UiStickyBand
        src="/assets/domino/band-table-match.png"
        :alt="DOMINO_HEADER_ALT.band"
      />
      <DominoFormatSplit />
    </div>
    <DominoRulebook />
    <DominoRegulations />
    <DominoFaq />
  </main>
</template>
