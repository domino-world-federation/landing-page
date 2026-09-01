<script setup lang="ts">
/**
 * `/federation-members` — Figma screen `386:18480`, in the "Members" section of the
 * **updated** design file.
 *
 * The first page built from `xdogWlTYLSqwh2fBTmxPJi`, which replaced
 * `1Q8Ud3Iq0dSR0KXymurySI` on 2026-08-25. Every node reference in the older
 * pages' docs points at the previous file; this page's point here.
 *
 * **It does not open on the header band.** The other seven inner pages start
 * with a title on the page background; this one starts with a 1080px hero — a
 * centred title, a gold pill and four figures. That is the design's call and it
 * is right: the band is for pages that are documents or archives, and this one
 * is a pitch. For the same reason the title is not run through
 * `SharpeningHeadline` — Figma gives it no `blur(7.5px)` to clear from.
 *
 * **It scrolls section by section**, like the landing page, About, Domino and
 * Tournaments. Six blocks, each a screen: the pitch, the map, the directory,
 * what membership grants, the four-step pathway, and the closing call. That
 * suits this page better than most — it is an argument made in order, and a
 * reader who flicks past the pathway has missed the point of the page.
 *
 * The class rides on `<html>` because that is the document's scrollport —
 * `scroll-snap-type` on `<body>` is ignored. Declared here rather than in the
 * `default` layout because that layout serves eleven routes and only five of
 * them snap; unhead takes the attribute off again on route change, and
 * `plugins/snap-release.client.ts` takes it off a frame earlier than that when a
 * navigation starts.
 *
 * `snap-children` on `<main>` then makes every direct child a stop — the rule is
 * in `main.css`.
 *
 * The shine is declared here and rendered by the `default` layout, which also
 * supplies the `isolate` that keeps its `-z-10` from sliding behind the page
 * background; `<main>` sits above it at `z-10` and the footer paints between the
 * two.
 *
 * **It reaches the application process, which is where Figma starts it.** The
 * artwork runs from `y:3561` — exactly where that section begins — to 5468, the
 * foot of the document, and it is anchored to the BOTTOM so both ends land
 * without measuring a section whose height depends on how its copy wraps.
 *
 * The ratio was 1920/1907 and that was too short: measured, the page is 7193
 * tall and the application process opens at 4320, so the shine has 2873 to
 * cover and was covering 1907 — it began at 5286, most of a section below where
 * it should. 1920/2873 is that span as a ratio of the width, so it scales with
 * the page instead of being a pixel height that only holds at 1920.
 */
definePageMeta({
  shine: { aspectClass: "aspect-[1920/2873]" },
})

useHead({ htmlAttrs: { class: "snap-sections" } })

useSeoMeta({
  title: "Members | Domino World Federation",
  description:
    "The federation's global membership — national bodies across six continents, what membership grants, and the four-step pathway to DWF recognition.",
})
</script>

<template>
  <main class="snap-children relative z-10">
    <MembersHero />
    <MembersMap />
    <MembersDirectory />
    <MembersBenefits />
    <MembersApplicationProcess />
    <MembersCta />
  </main>
</template>
