<script setup lang="ts">
import { getFeaturedEvent } from "~/lib/api/client"
import { COUNTDOWN_COPY } from "~/content/home/countdown"

/**
 * S3 — Figma node `24:1025`. The upcoming-match card.
 *
 * Figma puts it at `x:711, y:785` inside a 1920 × 1040 hero, so it overlaps the
 * hero rather than occupying a band of its own — the same relationship the
 * navbar has (S1). It is therefore positioned by the page, not by itself; this
 * file renders only the card.
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
    class="countdown-stroke rounded-countdown relative w-full max-w-[498px] bg-[image:var(--gradient-countdown-fill)] p-6 backdrop-blur-[4px]"
  >
    <div class="flex flex-col items-center gap-3">
      <!-- Decorative: it sits right beside the place name it stands for, so
           describing it would only repeat the text (RULES §7). -->
      <NuxtImg
        v-if="event.flagUrl"
        :src="event.flagUrl"
        alt=""
        :width="48"
        :height="48"
        class="size-12 rounded-full object-cover"
      />

      <h2
        id="countdown-heading"
        class="font-sans text-center text-xl leading-6 font-semibold tracking-[0.12em] text-white uppercase"
      >
        {{ COUNTDOWN_COPY.label }}
      </h2>

      <p
        class="font-sans flex flex-wrap items-center justify-center gap-3 text-base leading-6 text-white/60"
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

    <div class="mt-6">
      <HomeCountdownTimer :starts-at="event.startsAt" />
    </div>

    <div
      aria-hidden="true"
      class="mt-6 h-0.5 bg-[image:var(--gradient-divider)] opacity-20"
    />

    <!-- The same silver pill S13 ends the page on — extracted to `SilverCta`
         when the second one appeared. Here it fills the card's width; there it
         hugs its label. -->
    <UiSilverCta :href="event.ctaUrl ?? '#'" class="mt-6">
      {{ COUNTDOWN_COPY.cta }}
    </UiSilverCta>
  </section>
</template>
