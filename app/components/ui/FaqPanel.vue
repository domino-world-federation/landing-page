<script setup lang="ts">
import type { FaqItem } from "~/types/faq"

/**
 * The FAQ card — the pane, its heading, the list and the button under it.
 *
 * **One place, four pages.** The landing page, `/domino`, `/tournaments` and
 * `/faq` all draw the same card, and until this component existed each of them
 * drew it separately: the same padding, the same radius, the same glass, written
 * out four times. The redraw that turned the pane from a white card into a
 * translucent one had to be applied by hand to each, which is how a card ends up
 * dark on two pages and white on the others. It is one component now, and a
 * change to the material happens once.
 *
 * What stays with the caller is the SECTION around it — the page's own padding,
 * its background, and the `id` the footer links to. Those genuinely differ:
 * `/domino` stands on flat page background, the landing page's card sits over
 * `PageShine`'s beams, and only one of the four may own `id="faq"`.
 *
 * `tone` is passed straight through to the accordion, which is where the
 * light/dark difference actually lives — see `FaqAccordion` for why the boxed
 * items and the type colours travel together as one decision.
 */
withDefaults(
  defineProps<{
    /** The questions. */
    items: readonly FaqItem[]
    /** Which one is open on first render. */
    defaultOpenId: string
    heading: string
    /** The `id` the section's `aria-labelledby` points at. */
    headingId: string
    tone?: "light" | "dark"
    /** Figma centres this on `/domino` and `/tournaments` and sets it left on
     *  the landing page. */
    headingAlign?: "left" | "center"
    /** The button under the list. Omitted where the design draws none. */
    viewMore?: { label: string; href: string }
  }>(),
  { tone: "dark", headingAlign: "left", viewMore: undefined },
)
</script>

<template>
  <!-- The card rises as the section arrives — one move for the whole block
       rather than a stagger down the questions. The rows are a list the reader
       is about to scan, and animating them in sequence would hold the last
       question back while they are already reading the first. -->
  <MotionReveal :y="32">
    <!-- Figma pads the pane `60px 160px` inside the section's own 80, so at the
         design width the questions start 240px from the window edge. The inner
         padding is a fraction (8.33vw = 160/1920) rather than pixels: held
         literally it would still be claiming 320px of a 768px tablet, leaving
         the questions a column narrower than the gutters around them (D14).
         Below `lg` it drops to the section gutter entirely.

         No shadow on `dark`: a drop shadow under a pane you can see through
         reads as a seam rather than as lift. -->
    <div
      :class="
        cn(
          'rounded-[var(--radius-card)] px-5 py-10 md:px-10 lg:px-[8.33vw] lg:py-[3.13vw]',
          tone === 'dark'
            ? 'bg-[rgba(74,74,74,0.3)] backdrop-blur-[12px]'
            : 'shadow-card bg-white',
        )
      "
    >
      <div class="flex flex-col gap-8 lg:gap-[2.5vw]">
        <!-- Bebas 76/72 — `--text-display-sm`, the step every FAQ heading on the
             site takes. `leading-[0.95]` is Figma's 72 on a 76 body.

             Never the gold gradient: on white it is 1.9:1 against the 4.5
             RULES §10 requires, at every one of the brand's three stops. Figma
             makes the same call, and on the dark pane it draws plain white. -->
        <h2
          :id="headingId"
          :class="
            cn(
              'font-display text-[length:var(--text-display-sm)] leading-[0.95] uppercase',
              tone === 'dark' ? 'text-white' : 'text-black',
              headingAlign === 'center' ? 'text-center' : '',
            )
          "
        >
          {{ heading }}
        </h2>

        <UiFaqAccordion
          :items="items"
          :default-open-id="defaultOpenId"
          :tone="tone"
        />

        <!-- 64px tall and full width. On the dark pane it is the pane's own
             material — a 20% white wash — rather than the grey button the white
             card carries, which would read as a foreign object on glass. -->
        <NuxtLink
          v-if="viewMore"
          :to="viewMore.href"
          :class="
            cn(
              'rounded-btn font-display focus-visible:ring-gold flex h-16 items-center justify-center px-5 text-[length:var(--text-display-btn)] leading-10 uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none',
              tone === 'dark'
                ? 'bg-white/20 text-white hover:bg-white/30'
                : 'bg-[var(--color-surface-grey)] text-black hover:bg-[#c8c8c8]',
            )
          "
        >
          {{ viewMore.label }}
        </NuxtLink>
      </div>
    </div>
  </MotionReveal>
</template>
