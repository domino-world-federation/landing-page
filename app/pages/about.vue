<script setup lang="ts">
import { ABOUT_HEADER_ALT } from "~/content/about/header"

/**
 * `/about` — Figma screen `119:4798`.
 *
 * The first per-page metadata in the repo. `nuxt.config`'s `app.head` keeps the
 * site-wide default and `useSeoMeta` merges over it, so only what actually
 * differs is written here.
 *
 * No `PageShine` and no `Join` — both are landing-page sections, and the About
 * design carries neither. The footer comes from the `default` layout, outside
 * `<main>`, because it is a landmark of its own.
 */
useSeoMeta({
  title: "About Us | Domino World Federation",
  description:
    "The Domino World Federation is the international governing body for the sport of dominoes, representing over 80 national member associations across five continents.",
})

/**
 * About scrolls section by section, like the landing page.
 *
 * The class rides on `<html>` because that is the document's scrollport —
 * `scroll-snap-type` on `<body>` is ignored. Declared here rather than in the
 * `default` layout because that layout serves eleven routes and only this one
 * snaps; unhead takes the attribute off again on route change, so the other ten
 * are untouched. The landing page does the same thing from its own layout, which
 * it can because that layout is its alone.
 */
useHead({ htmlAttrs: { class: "snap-sections" } })

/**
 * `snap-children` on `<main>` makes every direct child of it a stop — the rule
 * is in `main.css`. The band-and-overview pair below counts as ONE child, which
 * is what lets the picture stay put while the white band climbs over it instead
 * of the two fighting for the same stop.
 */
</script>

<template>
  <main class="relative z-10 snap-children">
    <AboutHeader />

    <!-- The photograph is PINNED and the white band slides over it. `sticky`
         needs a containing block that outlives the sticky element, so the two
         are wrapped: the picture holds the top of the screen for as long as this
         wrapper is on it, and lets go the moment Overview's foot passes.
         Wrapping exactly these two is also what bounds it — sticky against
         `<main>` would leave the picture pinned behind the whole page.

         `z-0` against Overview's `z-10` decides which one covers which. Overview
         is the one white ground on the page and fully opaque, so it hides the
         picture completely as it arrives rather than veiling it. -->
    <div class="relative">
      <UiStickyBand
        src="/assets/about/authority-leadership-group.png"
        :alt="ABOUT_HEADER_ALT.band"
      />
      <div class="relative z-10">
        <AboutOverview />
      </div>
    </div>

    <AboutHeritage />
    <AboutVision />
    <AboutPillars />
    <AboutMission />
    <AboutStructuralFrameworks />
    <AboutExecutiveBoards />
    <AboutSubCommittees />
    <AboutHeadquarters />
  </main>
</template>
