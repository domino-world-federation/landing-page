<script setup lang="ts">
import { JOIN_COPY } from "~/content/home/join"

/**
 * S13 — Figma node `56:4698`. The membership call to action.
 *
 * Three centred blocks on the shine that S12 lays behind this part of the page:
 * a two-line Bebas 126 headline, a line of prose at 60% opacity, and the silver
 * pill. There is no background of its own — the section is transparent and the
 * gold beams show through it, which is the whole reason S12 exists.
 *
 * Figma's headline is Bebas 126/132, which is `--text-display-md` exactly
 * (7.875rem = 126px), so it takes that token rather than gaining one. The
 * measures — 1135 and 1087 — are written as fractions of the design width
 * (59.11vw, 56.61vw) rather than pixels, so they hold their proportion instead
 * of becoming a fixed demand on a narrow window (D14).
 *
 * The three enter in sequence on the page's shared stagger, headline first. That
 * order is the section's argument: the claim, then the terms, then the way in.
 */
</script>

<template>
  <!-- Figma's `100px 80px`, both proportional above `lg` (5.21vw / 80px gutters)
       and floored below it so the block does not collapse on a phone where
       5.21vw is 19px.

       The section's own gap is 36 (`56:4698`) and it applies only between the
       text block and the button — the headline and paragraph are a nested frame
       (`56:4697`) on a tighter 24. A flat gap for all three loses that grouping,
       which is what tells the reader the prose belongs to the headline rather
       than to the button. -->
  <section
    aria-labelledby="join-heading"
    class="relative flex flex-col items-center gap-8 px-5 py-20 text-center md:px-10 lg:gap-[1.875vw] lg:px-20 lg:py-[5.2083vw]"
  >
    <!-- Figma's `56:4697` — the headline and its paragraph on a 24px gap, held
         apart from the button by the section's wider 36. -->
    <div class="flex w-full flex-col items-center gap-6 lg:gap-[1.25vw]">
      <MotionReveal :y="40" class="w-full">
        <h2
          id="join-heading"
          class="font-display mx-auto max-w-[59.11vw] text-[length:var(--text-display-md)] leading-[1.0476] text-white uppercase max-lg:max-w-none"
        >
          <!-- A block per line so the design's break survives, rather than a
               `<br>` a translation would have to carry along (RULES §9). Below
               `lg` the measure is released and a line may wrap further, which is
               fine — the design's own break is never lost. -->
          <span
            v-for="line in JOIN_COPY.headline"
            :key="line"
            class="block"
          >{{ line }}</span>
        </h2>
      </MotionReveal>

      <MotionReveal :y="32" :delay="STAGGER" class="w-full">
        <!-- 60% opacity is Figma's (`56:4682`) and it is doing work: the
             paragraph sits between a full-white headline and a bright silver
             button, and at full strength it competes with both. Written as
             `text-white/60` rather than as an `opacity` on the block, so the
             entrance's own opacity has something to animate that does not fight
             it. -->
        <p
          class="font-sans mx-auto max-w-[56.61vw] text-base leading-7 text-white/60 text-balance max-lg:max-w-none lg:text-xl lg:leading-8"
        >
          {{ JOIN_COPY.body }}
        </p>
      </MotionReveal>
    </div>

    <!-- `w-fit` on the wrapper, not the button: `Reveal` renders a block, and
         without it the entrance's box would span the section and the focus ring
         would trace a full-width rectangle rather than the pill.

         The wrapper carries the design's 264 floor as well as the button, and it
         has to: `w-fit` is `fit-content`, which resolves against the CONTENT and
         does not see the child's `min-width` — the wrapper shrank to the 169px
         label and clipped the pill back down inside it. Both need the floor for
         it to survive. `max-w-full` keeps the pair from exceeding the section on
         a phone, where 13.75vw is 54px and the label is the wider of the two
         anyway. -->
    <MotionReveal
      :y="24"
      :delay="STAGGER * 2"
      class="w-fit max-w-full min-w-[min(100%,13.75vw)]"
    >
      <UiSilverCta :href="JOIN_COPY.ctaUrl">{{ JOIN_COPY.cta }}</UiSilverCta>
    </MotionReveal>
  </section>
</template>
