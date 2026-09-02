<script setup lang="ts">
import { TOURNAMENTS_COPY } from "~/content/tournaments"
import {
  TOURNAMENT_FAQ_ITEMS,
} from "~/content/tournaments/faq"

/**
 * The page's FAQ — Figma node `586:15190`.
 *
 * The same glass card every FAQ on the site now draws, with this page's three
 * questions in it and the "View more" button going to `/faq`. The card is
 * `UiFaqPanel`: the pane, the heading, the list and the button are one component
 * so that a change to the material happens once instead of on four pages.
 *
 * **The section's gradient is gone.** It ran `--color-bg → #1B1B1B`, which was
 * right under a white card and wrong under a translucent one: a pane you can see
 * through needs a ground that is one colour, or the blur samples a gradient and
 * the card reads as two different materials top and bottom. The redraw leaves
 * the frame unfilled for exactly that reason, so it stands on flat page
 * background like the block above it.
 *
 * **No `id="faq"`.** That anchor belongs to the landing page; claiming it here
 * would send a reader to whichever of the two the browser found first — the same
 * note `DominoFaq` carries.
 */
</script>

<template>
  <section
    aria-labelledby="tournament-faq-heading"
    class="px-5 pt-28 pb-16 md:px-10 lg:px-20 lg:pt-[max(var(--nav-clearance),4.4792vw)] lg:pb-[4.4792vw]"
  >
    <UiFaqPanel
      :items="TOURNAMENT_FAQ_ITEMS"
      :heading="TOURNAMENTS_COPY.faq.heading"
      heading-id="tournament-faq-heading"
      tone="dark"
      :view-more="{
        label: TOURNAMENTS_COPY.faq.viewMore,
        href: TOURNAMENTS_COPY.faq.viewMoreHref,
      }"
    />
  </section>
</template>
