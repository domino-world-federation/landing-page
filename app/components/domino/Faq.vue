<script setup lang="ts">
import {
  DOMINO_FAQ_COPY,
  DOMINO_FAQ_ITEMS,
} from "~/content/domino/faq"

/**
 * The Domino page's FAQ — Figma node `572:14502`.
 *
 * **It has been a white section, then a white card, and is now glass.** The
 * wireframe drew a full white band and that was all there was to go on (D42);
 * the first hi-fi made it a white CARD on a `#0E0E0E → #1B1B1B` gradient; the
 * redraw turns the card translucent — `rgba(74,74,74,0.3)` over a 12px backdrop
 * blur — and takes the type with it. It is the same treatment S11 received in
 * the same pass, node for node, which is the point: two pages of one site whose
 * FAQs are built differently for no reason a reader could name is a defect.
 *
 * The card itself is `UiFaqPanel`, which every FAQ on the site now draws — the
 * pane, its heading, the list and the button are one component so that the next
 * change to the material happens once rather than four times. What is left here
 * is the section around it, which genuinely differs per page.
 *
 * The heading is also LEFT-aligned now, where it was centred. That was this
 * page's own variation on S11 and the redraw drops it (`572:14504`).
 *
 * The section's own gradient goes too: the redraw leaves the frame unfilled, so
 * it stands on `--color-bg` like the block above it. A pane you can see through
 * needs a ground that is one colour, or the blur samples a gradient and the card
 * reads as two different materials top and bottom.
 *
 * **No `id="faq"`.** That anchor belongs to the landing page, which the footer
 * links to from every page including this one; claiming it here would send a
 * reader clicking "FAQ" in the footer to whichever of the two the browser found
 * first.
 */
</script>

<template>
  <!-- **Top-aligned, not centred, and the section above is the reason.** Referee
       Guidelines measures ~676px against a 1080 screen, so its stop leaves the
       top of this section showing underneath it — which is the whole affordance
       saying there is more of the page. Centred, that visible strip was the empty
       half of a `min-h-dvh` box and read as the page having run out; from the
       top, it is this section's heading and its first question.
  
       `snap-screen` stays: this is still a stop of its own and still fills the
       screen when the reader lands on it. Only where the content sits inside that
       screen changed. -->
  <section
    aria-labelledby="domino-faq-heading"
    class="flex snap-screen flex-col px-5 pt-28 pb-14 md:px-10 lg:px-20 lg:pt-[max(var(--nav-clearance),4.4792vw)] lg:pb-[4.4792vw]"
  >
    <UiFaqPanel
      :items="DOMINO_FAQ_ITEMS"
      :heading="DOMINO_FAQ_COPY.heading"
      heading-id="domino-faq-heading"
      tone="dark"
      :view-more="{
        label: DOMINO_FAQ_COPY.viewMore,
        href: DOMINO_FAQ_COPY.viewMoreHref,
      }"
    />
  </section>
</template>
