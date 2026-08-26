<script setup lang="ts">
/**
 * `/members` — Figma screen `386:18480`, in the "Members" section of the
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
 * The shine is declared here and rendered by the `default` layout, which also
 * supplies the `isolate` that keeps its `-z-10` from sliding behind the page
 * background; `<main>` sits above it at `z-10` and the footer paints between the
 * two. Figma starts the artwork at `y:3561` — exactly where the application
 * process begins — and ends it at 5468, the foot of the document, so anchoring
 * to the bottom reproduces both ends without measuring a section whose height
 * depends on how its copy wraps.
 */
definePageMeta({
  shine: {
    src: "/assets/members/decor-shine.svg",
    aspectClass: "aspect-[1920/1907]",
  },
})

useSeoMeta({
  title: "Members | Domino World Federation",
  description:
    "The federation's global membership — national bodies across six continents, what membership grants, and the four-step pathway to DWF recognition.",
})
</script>

<template>
  <main class="relative z-10">
    <MembersHero />
    <MembersMap />
    <MembersDirectory />
    <MembersBenefits />
    <MembersApplicationProcess />
    <MembersCta />
  </main>
</template>
