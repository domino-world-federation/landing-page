<script setup lang="ts">
import { TOURNAMENTS_COPY } from "~/content/tournaments"
import {
  TOURNAMENT_FAQ_DEFAULT_OPEN,
  TOURNAMENT_FAQ_ITEMS,
} from "~/content/tournaments/faq"

/**
 * The page's FAQ — Figma node `385:17864`.
 *
 * S11's white card with this page's three questions in it, plus a button the
 * landing page's version does not have: "View more" (`385:18072`), which goes to
 * `/faq`. That destination exists now — until this week the footer's FAQ link
 * had to point at the landing section instead (D59, D60).
 *
 * Black heading rather than the gold gradient every dark-ground heading uses,
 * for the reason `Faq` records: gold on white is 1.9:1 against the 4.5 RULES §10
 * asks for. Figma makes the same call here.
 *
 * **No `id="faq"`.** That anchor belongs to the landing page; claiming it here
 * would send a reader to whichever of the two the browser found first — the same
 * note `DominoFaq` carries.
 */
</script>

<template>
  <section
    aria-labelledby="tournament-faq-heading"
    class="bg-linear-to-b from-[var(--color-bg)] to-[#1b1b1b] px-5 py-16 md:px-10 lg:px-20 lg:py-[4.17vw]"
  >
    <MotionReveal :y="32">
      <div
        class="shadow-card rounded-[var(--radius-card)] bg-white px-5 py-10 md:px-10 lg:px-[8.33vw] lg:py-[3.13vw]"
      >
        <div class="flex flex-col gap-8 lg:gap-[2.5vw]">
          <h2
            id="tournament-faq-heading"
            class="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-black uppercase"
          >
            {{ TOURNAMENTS_COPY.faq.heading }}
          </h2>

          <UiFaqAccordion
            :items="TOURNAMENT_FAQ_ITEMS"
            :default-open-id="TOURNAMENT_FAQ_DEFAULT_OPEN"
          />

          <!-- 72px tall and full width (`385:18072`), the same grey button the
               highlighted band's "Details" carries. -->
          <NuxtLink
            :to="TOURNAMENTS_COPY.faq.viewMoreHref"
            class="rounded-btn font-display focus-visible:ring-gold flex h-18 items-center justify-center bg-[var(--color-surface-grey)] px-5 text-[length:var(--text-display-btn)] leading-10 text-black uppercase transition-colors hover:bg-[#c8c8c8] focus-visible:ring-2 focus-visible:outline-none"
          >
            {{ TOURNAMENTS_COPY.faq.viewMore }}
          </NuxtLink>
        </div>
      </div>
    </MotionReveal>
  </section>
</template>
