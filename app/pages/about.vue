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
 * is in `main.css`.
 *
 * **A stop only holds if it fits the screen.** `main.css` records why: a snap
 * area taller than the viewport is a band the reader may rest anywhere inside,
 * and `scroll-snap-stop: always` cannot forbid passing through a region you are
 * allowed to stop in. So every stop on this page is `snap-screen` or shorter,
 * the picture-and-overview pair included — see the template for what that cost
 * and what it bought.
 *
 * **The header is the exception, and it is one the repo owner chose.** It is the
 * design's 530px band, which is under a screen, so a hard flick from the very
 * top of the page has the header's 530 and the pair's screen to spend and can
 * still reach Heritage. It was `snap-screen` for exactly one revision and taken
 * back out: a full screen with the title at its foot pushes the photograph below
 * the fold and is not the opening frame the design draws. The skip is the price,
 * and it is paid only on the first gesture of the page.
 */
</script>

<template>
  <main class="relative z-10 snap-children">
    <AboutHeader />

    <!-- **The photographic band that used to stand here is gone, and with it
         three screens of scroll.**

         The federation asked for faces off About (2026-09-26), and this band
         was a formal group portrait of its officials — the one picture on the
         page that was nothing but faces. What stood around it was a composition
         built for that picture alone: the wrapper was three screens tall, the
         photograph pinned through the first two, and a white panel climbed out
         of the fold to cover it over the third.

         None of that machinery outlives the picture. A `sticky` frame with
         nothing in it is three empty screens the reader has to scroll past, and
         a white panel whose job is to COVER something covers nothing. So the
         beats, the markers and the panel come out together and the opening
         claim simply follows the header.

         `AboutOverview` brings its own white ground and padding, and as a direct
         child of `main` it takes a snap position from `snap-children` — which is
         why it needs no wrapper now, where before it needed two. -->
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
