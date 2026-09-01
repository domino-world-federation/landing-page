<script setup lang="ts">
import { getFeaturedEvent } from "~/lib/api/client"
import { COUNTDOWN_COPY } from "~/content/home/countdown"

/**
 * S3 — Figma node `24:1025`, redrawn. The upcoming-match card.
 *
 * The redraw arrived twice and the two are the same drawing: the repo owner
 * linked a REVISION file (`VHKnrwJJW8Se8g1IUyELsY`) and then the reference file
 * PRD §5 already names, **`oY2v2wq359rIRK4KaItmxc`**. Every node id, position
 * and dimension in this card and the hero around it matches across both, so the
 * numbers below are cited from the reference file and hold in either.
 *
 * Figma puts it at `x:711, y:768` inside a 1920 × 1080 hero, so it overlaps the
 * hero rather than occupying a band of its own — the same relationship the
 * navbar has (S1). It is therefore positioned by the page, not by itself; this
 * file renders only the card.
 *
 * **The redraw shrinks it to 498 × 292** — it used to run ~430 tall and hang
 * past the hero's foot into S4, which is the overlap the repo owner reported.
 * Four things buy that back, and all four are the design's: the flag moves from
 * above the title to beside it (one 57px row instead of a 48 + 12 + 24 + 12 + 24
 * stack), the padding steps 24 → 20, the gaps step 24 → 16, and the divider over
 * the CTA is gone — the timer now sits in a dark box of its own, which separates
 * the two without spending a row on a rule.
 *
 * The 292 is 20 + 57 + 16 + 99 + 16 + 64 + 20, and the two middle numbers were
 * measured rather than added up: Figma reports the header row and the timer box
 * as hug-height, so both were exported as PNGs and read off (`24:1029` is
 * 452 × 99). That is worth doing once, because the timer box is where the build
 * and the design disagreed — see `CountdownTimer.vue` on the digits' leading.
 * The header row lands 3px over the design's 57 and is left alone; that gap is
 * Figma's text nodes hugging their ink, not a spacing this file gets wrong.
 *
 * The bottom corners are square (`24px 24px 0 0`), which is not a Figma
 * artefact: both the fill and the stroke gradients reach zero alpha before the
 * card's foot, so there is no bottom edge to round — the card fades out rather
 * than ending.
 *
 * The 3px stroke is two stacked gradients in Figma, which no CSS border can
 * express. It is drawn by `.countdown-stroke` in `main.css`, masked down to the
 * edge — painting it behind the card instead would show through the translucent
 * fill and streak the whole surface.
 */
const { data: event } = await useAsyncData(
  "home-featured-event",
  () => getFeaturedEvent(),
)
</script>

<template>
  <section
    v-if="event"
    aria-labelledby="countdown-heading"
    class="countdown-stroke rounded-t-countdown relative flex w-full max-w-[498px] flex-col gap-4 bg-[image:var(--gradient-countdown-fill)] p-5 backdrop-blur-[4px]"
  >
    <div class="flex items-center gap-4">
      <!-- Decorative: it sits right beside the place name it stands for, so
           describing it would only repeat the text (RULES §7). `shrink-0`
           because it is a fixed 48px next to a column that fills — without it
           the flag is the thing that gives way when the name runs long. -->
      <NuxtImg
        v-if="event.flagUrl"
        :src="event.flagUrl"
        alt=""
        :width="48"
        :height="48"
        class="size-12 shrink-0 rounded-full object-cover"
      />

      <div class="flex min-w-0 flex-1 flex-col gap-3">
        <!-- The design writes the event's own name here ("MEXICO CHAMPIONSHIP
             2026"), not a standing label — so the heading is data now. The
             constant is kept as a spoken prefix: it is what names this landmark
             in a list of them, and "World Championship 2026" alone does not say
             what the card is. -->
        <h2
          id="countdown-heading"
          class="font-sans text-xl leading-6 font-semibold tracking-[0.12em] text-white uppercase"
        >
          <span class="sr-only">{{ COUNTDOWN_COPY.label }}: </span>
          {{ event.name }}
        </h2>

        <p
          class="font-sans flex flex-wrap items-center gap-x-3 gap-y-1 text-base leading-6 text-white/60"
        >
          <span>{{ event.location }}</span>
          <span aria-hidden="true">•</span>
          <!-- `datetime` gives assistive tech and crawlers the machine value,
               while the visible text stays the design's short form. -->
          <time :datetime="event.startsAt">
            {{ formatEventDate(event.startsAt) }}
          </time>
        </p>
      </div>
    </div>

    <!-- `rounded-glass` is the design's own 12px, and `bg-bg/50` its
         `rgba(14,14,14,0.5)` — the page background at half strength, so the box
         reads as a hole punched through the glass rather than as a fourth
         colour. -->
    <div class="rounded-glass bg-bg/50 p-3">
      <HomeCountdownTimer :starts-at="event.startsAt" />
    </div>

    <!-- The same silver pill S13 ends the page on — extracted to `SilverCta`
         when the second one appeared. Here it fills the card's width, which is
         the flex column's own doing; there it hugs its label. -->
    <UiSilverCta :href="event.ctaUrl ?? '#'">
      {{ COUNTDOWN_COPY.cta }}
    </UiSilverCta>
  </section>
</template>
