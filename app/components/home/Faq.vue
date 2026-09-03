<script setup lang="ts">
import { FAQ_COPY } from "~/content/home/faq"

import { getFaqs } from "~/lib/api/client"

/**
 * The questions and THEIR ORDER come from the CMS — the "FAQ per Page" screen
 * ranks them per page, and this section is one of the three pages it ranks.
 *
 * `FAQ_ITEMS` is no longer read here. It is still the mock `getFaqs()`
 * falls back to when no API base URL is set, so a clone without a backend
 * renders exactly what it did before.
 *
 * No sorting here, deliberately: the list arrives in the order somebody set,
 * and re-sorting it would throw away the only thing that screen exists to do.
 */
const { data: faqs } = await useAsyncData("home-faq", () => getFaqs("home"), {
  default: () => [],
})

/**
 * S11 — Figma node `81:690`. The FAQ.
 *
 * **It used to be a white card and is not any more.** The redraw turns the pane
 * translucent — `rgba(74,74,74,0.3)` over a 12px backdrop blur — and takes the
 * type with it: the heading and the questions go white, the answers to
 * `#A3A3A3`, and each question gains a filled box of its own instead of a rule
 * between it and the next. The reasoning behind the old treatment ("a large
 * field of white after ten sections of dark") is simply no longer the design's;
 * the section now reads as glass laid over the page rather than as a sheet set
 * down on it.
 *
 * That inverts what the layer underneath is for. The `home` layout's `PageShine`
 * reaches roughly 500px up into this section, and the whole point of `<main>`'s
 * `z-10` was to keep the wash OFF an opaque white card. The card is not opaque
 * now, so the beams are meant to come through it — the guard still matters,
 * because it is what keeps the shine behind the card's own pane and blur rather
 * than painted flat over the questions.
 *
 * Figma pads the pane `60px 160px` inside an outer 80px section padding, so at
 * the design width the questions start 240px from the window edge. That inner
 * padding is written as a fraction (8.33vw = 160/1920) rather than as pixels:
 * held literally it would still be claiming 320px of a 768px tablet, leaving the
 * questions a column narrower than the gutters around them (D14). Below `lg` it
 * drops to the section gutter entirely.
 *
 * `id="faq"` because the footer links to it — the one internal destination on
 * the page that exists.
 */
</script>

<template>
  <!-- `81:690` pads `86 80`, and 86 is not enough at the top: this section is a
       snap stop, so its head comes to rest under a navbar that is up to 112px
       tall (`NavShell`'s `NAV_HEIGHT`) — the panel's own heading sat behind the
       bar. The floor is 144, the same clearance the partners band above it
       carries, so the two agree about how far under the bar a section may start.

       4.48vw is the design's own 86/1920, kept as the slope so the band still
       grows with the window once it is past the floor. -->
  <section
    id="faq"
    aria-labelledby="faq-heading"
    class="snap-start snap-always px-5 pt-28 pb-[max(64px,4.48vw)] md:px-10 lg:px-20 lg:pt-[max(var(--nav-clearance),4.48vw)]"
  >
    <UiFaqPanel
      :items="faqs"
      :heading="FAQ_COPY.heading"
      heading-id="faq-heading"
      tone="dark"
      :view-more="{ label: FAQ_COPY.viewMore, href: FAQ_COPY.viewMoreHref }"
    />
  </section>
</template>
