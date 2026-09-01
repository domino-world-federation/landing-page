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
 * **A full screen, like the sections above it.** Figma draws this as a
 * 1920 × 1080 frame that centres its contents, and it used to be built as a
 * block of padding that came to whatever its copy measured — so the page ended
 * on a short band rather than on a page. Same height expression the hero and the
 * HQ picture carry, including the `min(100dvh,75vw)` fold floor: Figma's frame
 * is a viewport, and the closing call is the one section where being anything
 * less than the screen is most obvious, because there is nothing after it but
 * the footer.
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
  <!-- Figma's `40px 80px` (`56:4698`), proportional above `lg` and floored below
       it so the block does not collapse on a phone where 2.08vw is 8px. With the
       frame's height now pinned the padding is a minimum inset rather than what
       sets the band's size — `justify-center` is what places the contents, as it
       does in the design.

       The section's own gap is **64** and it applies only between the text block
       and the button — the headline and paragraph are a nested frame
       (`56:4697`) on a tighter 36. A flat gap for all three loses that grouping,
       which is what tells the reader the prose belongs to the headline rather
       than to the button. (Both numbers moved in the redraw, and they moved in
       opposite directions: the outer gap was 36 and the inner 24.) -->
  <section
    aria-labelledby="join-heading"
    class="relative flex snap-start snap-always flex-col items-center justify-center gap-8 px-5 py-20 text-center md:px-10 lg:h-[max(640px,56.25vw,min(100dvh,75vw))] lg:gap-[3.33vw] lg:px-20 lg:py-[2.08vw]"
  >
    <!-- Figma's `56:4697` — the headline and its paragraph on a 36px gap, held
         apart from the button by the section's wider 64. -->
    <div class="flex w-full flex-col items-center gap-6 lg:gap-[1.875vw]">
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
