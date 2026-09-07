<script setup lang="ts">
import type { TournamentWinner } from "~/lib/api/types"
import { TOURNAMENT_DETAIL_COPY } from "~/content/tournaments/detail"

/**
 * Results & Winners — Figma node `517:2177`.
 *
 * Three cards under a centred gold Bebas 100: a ribbon naming the placing, a
 * circle per winner, the names, the country.
 *
 * **The block is absent unless the tournament has been played.** Figma draws it
 * on a screen that also carries a "Notify me" button, which cannot both be true
 * — a tournament taking entries has no winners. The record carries `winners`
 * only once there are some, and this renders nothing without them rather than
 * printing a heading over three empty cards.
 *
 * The same R16 caution the champions rail carried applies to what is inside: the
 * names are placeholders and the portraits are the federation's own library, not
 * photographs of the people named.
 */
defineProps<{ winners: TournamentWinner[] }>()

const COPY = TOURNAMENT_DETAIL_COPY.winners
</script>

<template>
  <section
    aria-labelledby="tournament-winners-heading"
    class="flex flex-col gap-10 px-5 py-16 md:px-10 lg:gap-[3.13vw] lg:px-20 lg:py-[4.17vw]"
  >
    <MotionReveal :y="40">
      <h2
        id="tournament-winners-heading"
        class="font-display text-gold-gradient text-center text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
      >
        {{ COPY.heading }}
      </h2>
    </MotionReveal>

    <!-- **Centred, not left-packed.** Figma draws three cards and a three-column
         grid draws them correctly — but a tournament that recorded only a
         winner and a runner-up got two cards hard against the left edge with a
         third column of empty space beside them, under a heading that is itself
         centred. A wrapping flex row with `justify-center` places one, two or
         three the same way the heading is placed, and lands on the design's
         exact layout at three.

         The width is the grid's arithmetic written out: three tracks and the two
         20px gutters between them. Flex items stretch by default, which is what
         `auto-rows-fr` was doing — all cards match whatever a long name does to
         its own height, so the country line sits on one baseline across the
         row. -->
    <ul class="flex list-none flex-wrap justify-center gap-5">
      <li
        v-for="(winner, i) in winners"
        :key="winner.id"
        class="w-full md:w-[calc((100%-2.5rem)/3)]"
      >
        <MotionReveal :y="24" :delay="i * 0.08" class="h-full [&>*]:h-full">
          <!-- `aria-label` carries the whole card as one sentence: the ribbon,
               the names and the country are three separate elements, and read
               apart they are a word, two names and a place. -->
          <article
            :aria-label="
              COPY.label
                .replace('%1', winner.rankLabel)
                .replace('%2', winner.names)
                .replace('%3', winner.country)
            "
            class="flex h-full flex-col items-center gap-6 rounded-[var(--radius-card)] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_100%)] p-6"
          >
            <!-- The laurel ribbon (`517:2181`), the design's own artwork. The
                 placing is real text set over it rather than baked into the SVG:
                 the shape is the same for all three cards and only the word
                 changes. -->
            <p class="relative h-[70px] w-48 shrink-0">
              <img
                src="/assets/tournaments/decor-winner-ribbon.svg"
                alt=""
                aria-hidden="true"
                width="192"
                height="70"
                class="absolute inset-0 size-full"
              >
              <span
                class="font-display absolute inset-x-0 top-4 text-center text-[length:var(--text-display-label)] leading-[1.22] text-white uppercase"
                aria-hidden
              >
                {{ winner.rankLabel }}
              </span>
            </p>

            <!-- One circle per winner, overlapping nothing: a doubles pair is
                 two people and the design draws two 124px circles side by
                 side. -->
            <div v-if="winner.portraitUrls.length" class="flex items-center gap-6">
              <NuxtImg
                v-for="(portrait, index) in winner.portraitUrls"
                :key="portrait + index"
                :src="portrait"
                alt=""
                aria-hidden="true"
                :sizes="imageSizes({ xs: '124px' })"
                class="size-[124px] shrink-0 rounded-full object-cover"
              />
            </div>

            <div class="mt-auto flex w-full flex-col gap-4">
              <p
                class="font-sans text-center text-[length:var(--text-display-label)] leading-[1.22] font-semibold text-white"
                aria-hidden
              >
                {{ winner.names }}
              </p>
              <p
                class="font-sans text-center text-[length:var(--text-body-sm)] leading-[1.5] text-white/60"
                aria-hidden
              >
                {{ winner.country }}
              </p>
            </div>
          </article>
        </MotionReveal>
      </li>
    </ul>
  </section>
</template>
