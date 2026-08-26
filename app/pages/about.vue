<script setup lang="ts">
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
</script>

<template>
  <main class="relative z-10">
    <AboutHeader />
    <AboutAuthorityBand />
    <AboutOverview />
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
