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

    <!-- **Three stops a screen apart: the picture, the composite, the cover.**
         The picture pins and holds the first screen alone. Over the next screen
         the white band climbs out of the fold and comes to rest across its lower
         two fifths, with the photograph still filling the frame behind it —
         which is the composite the design is drawn around. Over the screen after
         that the white keeps rising until it has taken the whole frame and the
         picture is gone.

         **How the three are placed, and why no number here is a guess.** The
         wrapper is exactly three screens. The picture is `sticky` and one screen
         tall, so it stays pinned until the wrapper's last screen — through both
         of the beats that are supposed to have it behind them. The white is a
         panel running from `158dvh` to the wrapper's foot, and 158 is 200 minus
         the band's own 42: at the second beat that puts the band's head exactly
         `42dvh` above the bottom of the screen, and at the third it has reached
         the top. The band is `sticky` inside its panel, which is what keeps the
         copy on screen while the white it sits on carries on past — without it
         the third beat is a blank white screen with the words scrolled off it.

         **Why the wrapper gives up its stop.** Three screens tall, and a snap
         area taller than the screen is a band the reader may rest ANYWHERE
         inside rather than a position; `scroll-snap-stop: always` cannot forbid
         passing through a region you are allowed to stop in, which is what let a
         hard flick cross the whole pair. `snap-pass` takes it out of the running
         and the beats are stated one at a time.

         No `overflow-hidden` here, and it matters: clipping on any ancestor of a
         sticky element cancels the sticking. -->
    <div class="snap-pass relative lg:h-[300dvh]">
      <!-- The beats. Markers rather than stops on the elements themselves, and
           the distinction is the whole reason these exist — the picture is
           `sticky` and the band is `sticky` inside an `absolute` panel, so
           neither one's box is where it appears to be once it starts moving. A
           snap position attached to either would travel with the reader instead
           of holding still. All three are absolutely positioned, add no layout,
           and never move. Same construction the stats wheel uses for its
           notches. -->
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

      <!-- `snap-screen` rather than a height: the band's own `44.27vw` and a
           `height: 100%` would be the same property fighting over stylesheet
           order, where a minimum simply takes the larger. A screen is the larger
           at every window this page snaps at. -->
      <UiStickyBand
        class="lg:snap-screen"
        src="/assets/about/authority-leadership-group.webp"
        :alt="ABOUT_HEADER_ALT.band"
      />

      <!-- The white panel — `z-10` over the picture's `z-0` is what decides
           which covers which, and it is opaque, so it hides the photograph
           rather than veiling it.

           The panel is the GROUND and the band inside it is the copy: they are
           two elements because the ground has to keep rising after the copy has
           stopped, and because the two come to rest in different places.

           **`top-[29dvh]`, not `top-0`, and that is what centres the copy on the
           covered screen.** 29 is `(100 - 42) / 2` — half the screen left over
           once the band has taken its 42 — so the copy pins with equal space
           above and below it. The threshold does the second beat's work for
           free: there the copy's own position is 58dvh down, which is below 29
           and so not yet pinned, and it renders exactly where the panel puts it,
           resting on the photograph's lower two fifths. Sticky only takes over
           at `129dvh`, on the way to the cover.

           `min-h` below `lg`, where the columns stack and the copy is taller
           than the 42dvh the desktop band is held to. -->
      <div
        class="relative z-10 bg-[var(--color-surface-light)] lg:absolute lg:inset-x-0 lg:top-[158dvh] lg:bottom-0"
      >
        <AboutOverview
          class="min-h-[42dvh] lg:sticky lg:top-[29dvh] lg:h-[42dvh]"
        />
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
