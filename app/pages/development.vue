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

    <!-- The photograph is PINNED and the white band slides over it. `sticky`
         needs a containing block that outlives the sticky element, so the two
         are wrapped: the picture holds the top of the screen for as long as this
         wrapper is on it, and lets go the moment Youth Program's foot passes.
         Wrapping exactly these two is also what bounds it — sticky against
         `<main>` would leave the picture pinned behind the whole page.

         `z-0` against Youth Program's own `z-10` decides which one covers which.
         That section is the one white ground on this page and fully opaque, so
         it hides the picture completely as it arrives rather than veiling it —
         and it carries that `z-10` itself rather than getting it from a wrapper
         here, which is how Domino pairs its tile band with the formats. -->
    <div class="relative">
      <UiStickyBand
        src="/assets/development/band-classroom-session.png"
        :alt="DEVELOPMENT_HEADER_ALT.band"
        dim
      />
      <DevelopmentYouthProgram />
    </div>
    <DevelopmentCertifications />
    <DevelopmentLibrary />
    <DevelopmentGrassroots />
    <DevelopmentNews />
    <DevelopmentSupportPrograms />
    <DevelopmentCta />
  </main>
</template>
