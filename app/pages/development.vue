<script setup lang="ts">
import { DEVELOPMENT_HEADER_ALT } from "~/content/development/header"

/**
 * `/development` — Figma screen `190:13600`.
 *
 * Nine blocks, and unlike Domino the hi-fi draws all of them (D42's shortfall
 * does not repeat here). Same shell as About and Domino: a header band under the
 * `fixed` navbar, a full-bleed photograph, then the page's sections.
 *
 * **The shine is a child of the page rather than of a group at its foot.** On
 * the landing page it wraps the last two blocks and the footer in a
 * `relative isolate` div, which is what D26 had to correct with a `z-10` on
 * `<main>` after the wash printed over the FAQ card — and it also puts a CTA
 * section outside every landmark on the page. Here the layer is pinned to the
 * bottom of the page's own box: `isolate` (asked for through `definePageMeta`,
 * which the `default` layout reads) keeps its `-z-10` from sliding behind the
 * page background, `<main>` sits above it at `z-10`, and the footer paints
 * between the two. Figma starts the artwork at `y:5388`, which is exactly where
 * Federation Support Programs begins, and ends it at 7459 — the foot of the
 * document. Anchoring to the foot is what reproduces both ends without measuring
 * a section whose height depends on how its copy wraps.
 */
definePageMeta({
  shine: { aspectClass: "aspect-[1920/2071]" },
})

/**
 * Development scrolls section by section, like the landing page, About, Domino,
 * Tournaments and Members.
 *
 * The class rides on `<html>` because that is the document's scrollport —
 * `scroll-snap-type` on `<body>` is ignored. Declared here rather than in the
 * `default` layout because that layout serves eleven routes and only six of them
 * snap; unhead takes the attribute off again on route change, and
 * `plugins/snap-release.client.ts` takes it off a frame earlier than that when a
 * navigation starts.
 *
 * `snap-children` on `<main>` then makes every direct child a stop — the rule is
 * in `main.css`. The photograph and the block that covers it are ONE child, and
 * so one stop: they are a single move.
 */
useHead({ htmlAttrs: { class: "snap-sections" } })

useSeoMeta({
  title: "Development | Domino World Federation",
  description:
    "How the federation grows the game — youth programmes in partner schools, referee and coaching certification, grassroots initiatives, and support for national member bodies.",
})
</script>

<template>
  <main class="snap-children relative z-10">
    <DevelopmentHeader />

    <!-- **Three stops a screen apart: the picture, the composite, the cover** —
         About's leadership band, on this page's own picture. The photograph pins
         and holds the first screen alone. Over the next screen the white band
         climbs out of the fold and comes to rest across its lower two fifths,
         with the picture still filling the frame behind it. Over the screen
         after that the white keeps rising until it has taken the whole frame.

         **The numbers are About's because the two bands measure the same.** Youth
         Program's row is `max(280px, 14.58vw)` inside `4.17vw` of padding — 440
         at the design width, which is 41% of a 1080 screen against the 42 About's
         overview takes. The wrapper is three screens; the picture is `sticky` and
         one screen tall, so it stays pinned until the last of them, through both
         beats that need it behind. The white panel runs from `158dvh` to the
         wrapper's foot, and 158 is 200 minus the band's own 42: at the second
         beat that puts the band's head exactly `42dvh` above the bottom of the
         screen, and at the third it has reached the top.

         The band is `sticky` inside its panel at `29dvh` — `(100 - 42) / 2`, so
         it pins centred once the white covers. The threshold does the second
         beat's work for free: there the band's own position is 58dvh down, below
         29 and so not yet pinned, and it renders exactly where the panel puts
         it. Without the sticky, the third beat is a blank white screen with the
         copy scrolled off it.

         **Why the wrapper gives up its stop.** Three screens tall, and a snap
         area taller than the screen is a band the reader may rest ANYWHERE
         inside rather than a position — `scroll-snap-stop: always` cannot forbid
         passing through a region you are allowed to stop in, which is what let a
         hard flick cross the whole pair. `snap-pass` takes it out of the running
         and the beats are stated one at a time.

         No `overflow-hidden` here: clipping on any ancestor of a sticky element
         cancels the sticking. -->
    <div class="snap-pass relative lg:h-[300dvh]">
      <!-- Markers rather than stops on the elements themselves — the picture is
           `sticky` and the band is `sticky` inside an `absolute` panel, so
           neither one's box is where it appears to be once it moves, and a snap
           position attached to either would travel with the reader. All three
           are absolutely positioned, add no layout, and never move. -->
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
           order, where a minimum simply takes the larger. -->
      <UiStickyBand
        class="lg:snap-screen"
        src="/assets/development/band-classroom-session.webp"
        :alt="DEVELOPMENT_HEADER_ALT.band"
        dim
      />

      <!-- The panel is the GROUND and the section inside it is the copy: they
           are two elements because the ground has to keep rising after the copy
           has stopped. `bg-white` because that is what Youth Program itself is —
           this page's one white ground, and the two have to meet invisibly.

           Youth Program keeps the `z-10` it carries itself, which is what
           decides that it covers the picture rather than being covered. -->
      <div class="relative z-10 bg-white lg:absolute lg:inset-x-0 lg:top-[158dvh] lg:bottom-0">
        <DevelopmentYouthProgram
          class="min-h-[42dvh] lg:sticky lg:top-[29dvh] lg:h-[42dvh]"
        />
      </div>
    </div>

    <DevelopmentCertifications />
    <DevelopmentLibrary />
    <DevelopmentGrassroots />
    <!-- The landing page's news strip, not a second one. Development drew its
         own three-card row from the same `getLatestNews` feed; the two were the
         same block in two shapes, and the strip moved to `ui/` on this second
         user (D32/D43) the way `RailArrow` and the featured-event band did.

         Federation Support Programs is gone with it, on the repo owner's call —
         its form had nothing to submit to (B2), and `DevelopmentSupportForm`
         went with the section rather than being left behind unrendered. -->
    <UiNews :backdrop="false" />
    <DevelopmentCta />
  </main>
</template>
