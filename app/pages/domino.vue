<script setup lang="ts">
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
</script>

<template>
  <main class="relative z-10">
    <DominoHeader />
    <DominoTileBand />
    <DominoFormatSplit />
    <DominoRulebook />
    <DominoRegulations />
    <DominoFaq />
  </main>
</template>
