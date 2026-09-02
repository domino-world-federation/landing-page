<script setup lang="ts">
import { getShowcaseEvents } from "~/lib/api/client"

definePageMeta({ layout: "home" })

/**
 * `<main>` carries `relative z-10` so the page's content sits above the shine
 * the `home` layout lays behind its foot. The shine's own `-z-10` only orders it
 * inside its wrapper — `isolate` seals that context shut, so from the outside
 * the wrapper is one opaque-ordered unit and, being a LATER sibling, it painted
 * over everything here. The layer reaches the FAQ's head (S12) — the whole
 * section, since the shine was widened to the redraw's 2695 — and without this
 * its dark wash fell across the white card. Figma has the same overlap and the
 * same answer: the card is opaque and the beams run behind it.
 */
/**
 * S6's six events. Fetched here rather than inside the band, which is now shared
 * with `/tournaments` and takes its list as a prop — a component that fetched
 * could only ever show one page's list. `useAsyncData` is what keeps it on the
 * server: it runs during SSR and hands the result to the client in the payload.
 */
const { data: showcaseEvents } = await useAsyncData(
  "home-showcase-events",
  () => getShowcaseEvents(),
  { default: () => [] },
)

useSeoMeta({
  title: "Domino World Federation",
  description:
    "The global governing body for domino — tournaments, rankings, and official federation resources.",
})
</script>

<template>
  <main class="relative z-10">
    <HomeHero />

    <!-- S3 overlaps the hero in Figma (`y:768` of a 1080-tall frame) and, in
         the redraw, stops 20px SHORT of its foot — where it used to hang ~150px
         past it, across the head of S4. Taking that overhang out is half a fix
         in the card, which is 140px shorter now, and half here.

         The pull is no longer a percentage of the width. `-mt-[13.3%]` placed
         the card's TOP at the design's `y`, which keeps the card inside the hero
         only while the card is exactly as tall as it was when the number was
         worked out: the same margin against the redraw's 292px card still left
         37px of it below the hero at 1920, and an event whose name wrapped to a
         second line would push more of it through again.

         So the height is not guessed at all. The wrapper collapses to `h-0` —
         its line sits on the hero's bottom edge — and `items-end` hangs the card
         off that line, which puts the card's foot there whatever the card
         measures. `-translate-y-5` then lifts it the design's 20px clear.
         Because the lift is a transform and the wrapper is already zero-height,
         S4 starts exactly at the hero's bottom edge either way: the card cannot
         push it down and cannot pull it up.

         `items-end` is doing two jobs, and the second is why `items-start` is
         not enough — a stretched flex item in a zero-height line is zero-height
         too, and the card renders as a 498px sliver of its own border.

         The overlap waits for `menu` (1400) rather than starting at `lg`,
         because pulling the card up puts it *through* the hero's last row, where
         Figma sets the mission copy hard left and the accountability block hard
         right. The card is a fixed 498px and centred, so that row needs
         80 + 288 + 498 + 316 + 80 — it first fits at 1290px, and below that the
         card ate the end of "…and setting fair global standards" on the left and
         the "Official Rules" button on the right (measured: 41px and 5px of bite
         at 1440 and 1280 before the mission cap, 105/133 at 1024). `menu` is the
         measured token nearest that threshold and leaves margin. Below it the
         card simply follows the hero, which is what it already did below `lg`.

         The snap point is the other half of that split, and it switches at the
         same breakpoint. Below `menu` the card is a band of its own between the
         hero and S4, and section snapping would fly straight over it — the hero
         fills the screen, the next snap position is S4's head, and the card is
         never on screen at rest. From `menu` up it is pulled INTO the hero and
         has no head of its own to stop at: snapping to it would park the
         viewport partway down the hero, cutting the artwork in half. So it is a
         snap point exactly while it is a band, and `snap-align-none` from
         `menu`, where it goes back to being part of S2. -->
    <div
      class="relative z-40 flex snap-start snap-always justify-center px-5 py-12 lg:px-20 menu:h-0 menu:-translate-y-5 menu:items-end menu:snap-align-none menu:py-0"
    >
      <HomeCountdown />
    </div>

    <HomeFeatureHq />
    <HomeStats />
    <UiFeaturedEvent :events="showcaseEvents" />
    <!-- One section, not two: the photograph, the sentence over it and the card
         strip are a single 1920 × 1080 frame in the redraw (`53:3067`), so the
         `UiNewsIntro` that used to stand here is inside `UiNews` now. -->
    <UiNews />
    <!-- One snap unit, two regions. The partners band is ~250px of logos under a
         single line of heading; as a stop of its own it parked the reader in
         front of a mostly empty screen, with the navbar — 112px of fixed bar —
         sitting across the only words in it. Merged with the library below, the
         stop lands on a band with something in it, and the bar overlays
         `--nav-clearance` of padding instead of 100px of it.

         The wrapper rather than a merged component, unlike the S7/S8 merge two
         sections up: Figma still draws these as two frames (`56:4541` at 5404,
         `56:4554` at 5848) and each still names its own region, so what is being
         joined here is the SCROLL, not the content. Both keep their own padding;
         only the snap moved out. -->
    <div class="snap-start snap-always">
      <HomePartners />
      <HomeResources />
    </div>
    <HomeFaq />
  </main>
</template>
