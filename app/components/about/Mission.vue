<script setup lang="ts">
import { MISSION_CARDS, MISSION_COPY } from "~/content/about/mission"

/**
 * Mission — Figma node `107:2997`. The page's closing section.
 *
 * Centred, unlike everything above it: the header, Overview, Vision and Pillars
 * are all two-column, and this one collects the page back onto its axis before
 * the footer. The four cards are the only grid on the page.
 */

// Editable in the backoffice's page editor; the constants are the fallback.
const copy = usePageCopy("about")
const cards = computed(() =>
  MISSION_CARDS.map((card, i) => ({
    ...card,
    cms: `mission.cards.${i}`,
    title: copy.text(`mission.cards.${i}.title`, card.title),
    body: copy.text(`mission.cards.${i}.body`, card.body),
  })),
)
</script>

<template>
  <!-- One screen, like the four sections around it — `566:13564` is 1920 × 1080.
       See `Heritage` for why the height is `dvh` and not the design's ratio. -->
  <section
    class="flex snap-screen flex-col justify-center gap-12 px-5 py-16 md:px-10 lg:gap-[3.13vw] lg:px-20 lg:py-[4.17vw]"
  >
    <div class="flex flex-col items-center gap-9 text-center">
      <MotionReveal :y="32">
        <p
          v-cms="'mission.eyebrow'"
          class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white uppercase"
        >
          {{ copy.text('mission.eyebrow', MISSION_COPY.eyebrow) }}
        </p>
      </MotionReveal>

      <MotionReveal :y="48" :delay="STAGGER" blur-from="10px">
        <h2
          v-cms="'mission.heading'"
          class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08]"
        >
          <!-- A block per line so the design's break survives without a `<br>` a
               translation would have to carry (RULES §9). -->
          <span
            v-for="line in copy.lines('mission.heading', MISSION_COPY.heading)"
            :key="line"
            class="block"
          >{{ line }}</span>
        </h2>
      </MotionReveal>

      <!-- 1094 of 1920 — narrow enough that the sentence sits under the
           heading's second line rather than running past it. -->
      <MotionReveal :y="32" :delay="STAGGER * 2" class="lg:max-w-[1094px]">
        <p
          v-cms="'mission.intro'"
          class="font-sans text-[length:var(--text-body-lg)] leading-[1.22] text-white"
        >
          {{ copy.text('mission.intro', MISSION_COPY.intro) }}
        </p>
      </MotionReveal>
    </div>

    <!-- Four across at `lg`, two at `md`, one below — the cards carry a title
         and three lines of body each, and at four columns on a tablet the body
         wraps to seven. -->
    <!-- Two up from the smallest screen: one card per row made each a
         300px slab for two lines of copy. -->
    <ul class="grid list-none grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
      <li v-for="(card, i) in cards" :key="card.id" class="flex">
        <!-- The stagger is per card and the wrapper is `w-full` so the animated
             element, not the card inside it, is the grid item — otherwise every
             card sizes to its own content and the row loses its even columns. -->
        <MotionReveal :y="40" :delay="STAGGER * i" class="w-full">
          <AboutMissionCard :card="card" />
        </MotionReveal>
      </li>
    </ul>
  </section>
</template>
