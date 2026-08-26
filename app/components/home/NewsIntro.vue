<script setup lang="ts">
import { NEWS_INTRO_ALT, NEWS_INTRO_COPY } from "~/content/home/news-intro"

/**
 * How far the photograph rides up as the section arrives, as a percentage of the
 * section's own height — negative, so it moves AGAINST the scroll and the desk
 * lifts while the page comes down past it.
 *
 * 14% is ~134px at the design height. An earlier 6% was set as "just enough to
 * unpin the picture from the page", and it was not enough to read as motion at
 * all: paired with the wrong scroll anchor it delivered 27px, under 3% of the
 * frame, which is below the threshold of noticing on a still life with no hard
 * edge near the frame border. 14% is still a drift rather than a slide — the
 * desk's own lines stay well inside the frame — but it now crosses that
 * threshold.
 */
const RISE = -14

/**
 * Seconds for the sentence to come into focus. Longer than the page's standard
 * entrance because it is the only thing happening here — S4 has a headline, a
 * paragraph and a button taking turns, and this section has one line, so the
 * move can be drawn out and still hold.
 */
const RESOLVE = DURATION * 1.3

/**
 * The sentence's starting scale — it grows into its resting size as it comes
 * into focus, so the line reads as approaching rather than merely sharpening.
 *
 * 0.86 rather than something smaller: the text is centred, so it grows from the
 * middle outwards, and at the design's 64px a deeper start means the outer words
 * travel far enough to read as a zoom. Scaling text is a transform on one
 * composited layer, not a re-layout, so nothing around it reflows (RULES §12).
 */
const ENTER_SCALE = 0.86

/**
 * S7 — Figma node `53:3067`. The lead-in to the news carousel.
 *
 * A photograph and one sentence, and that is the whole section. It is the hinge
 * between the white event band above and the news that follows: the page goes
 * dark again here, so the picture's foot has to meet `--color-bg` cleanly.
 *
 * It does, and without any CSS of ours. `feature-domino-desk.png` is the
 * design's own composite — Figma stacks a 1920×1464 photograph (`53:3068`,
 * offset `y:-489`) under a `rgba(14,14,14,0) → rgba(14,14,14,1)` wash
 * (`53:3070`), and the export is that stack already flattened and cropped to the
 * 1920×960 frame. Measured, the bottom rows read 14,14,14 — exactly
 * `--color-bg` — and the top rows still carry full picture detail (peak luma
 * 246), so the wash is baked in and re-drawing it here would darken the foot
 * twice, the same trap S4 hit with `feature-hq-composite.png`.
 *
 * That bake is also what makes the parallax safe. The picture rides UP, so its
 * bottom edge lifts off the section's foot and leaves a strip of page background
 * behind it — and that strip is the colour the image's own last rows already
 * are, so the seam is invisible. Moving it the other way would pull the bright,
 * detailed top edge down into the frame and expose a hard cut.
 *
 * Two moving layers, well under the 3–4 ceiling of RULES §12, and both move on
 * `transform`/`opacity` only.
 */
</script>

<template>
  <!-- The image's own 960/1920 ratio from `lg`, so every percentage below is a
       Figma number as written. A floor for the same reason the hero has one: the
       sentence does not shrink with the window, and pure ratio would close the
       section around it on a narrow desktop. -->
  <section
    class="relative isolate flex min-h-[420px] flex-col items-center justify-center overflow-hidden px-5 py-24 md:px-10 lg:h-[max(560px,50vw)] lg:min-h-0 lg:justify-start lg:py-0 lg:pt-[17.86%]"
  >
    <!-- `-z-10` puts the whole layer behind the sentence; `isolate` on the
         section keeps that negative index from escaping into the page's root
         stacking context and sliding behind the page background itself. -->
    <MotionParallaxLayer
      :speed="RISE"
      anchor="foot"
      decorative
      class="absolute inset-0 -z-10"
    >
      <!-- Full-bleed: the picture always spans the viewport, so every candidate is
           the viewport's own width — see the note on `imageSizes` for why this is
           not written as a bare `100vw`. -->
      <NuxtImg
        src="/assets/home/feature-domino-desk.png"
        :alt="NEWS_INTRO_ALT.desk"
        :sizes="SIZES_FULL_BLEED"
        :quality="90"
        class="absolute inset-0 size-full object-cover object-bottom"
      />
    </MotionParallaxLayer>

    <!-- Node `55:3224`: 1008px wide and centred on the frame, its top at `y:343`
         — which is what the `pt-[17.86%]` on the section reproduces, 343 being
         17.86% of the design's 1920 width and the height being pinned to that
         width from `lg`. Below `lg` the section has no fixed ratio to measure
         against, so the sentence simply centres.

         The sentence comes in from blur, GROWS into its resting size and
         brightens as it settles — that is the section's whole entrance. It does
         not rise, though: the picture behind it is already travelling upwards,
         and a second thing moving in the same direction in a frame this empty
         reads as the section sliding rather than as the words arriving. Growing
         from the centre reads as approach instead, which is a different axis
         from the desk's drift and so keeps the two apart.

         `text-balance` evens the two lines rather than filling the first: at
         1440 plain wrapping gave "…and updates from the main / source", seven
         words over one. Balanced it breaks after "updates" — the same break
         Figma's own 1008px box produces at the design width — and measured
         across 1920/1600/1440/390 it lands there at every width that wraps at
         all, so the sentence keeps one shape instead of a different one per
         breakpoint.

         NOTE: Figma leaves a resting `blur(7.5px)` on this text (`effects` on
         `55:3224`), i.e. the design never brings it fully into focus. This
         resolves it to sharp instead — the line is the section's only content
         and a permanently soft one is unreadable at any size. -->
    <MotionReveal
      blur-from="18px"
      :scale="[ENTER_SCALE, 1]"
      :duration="RESOLVE"
      class="w-full"
    >
      <p
        class="font-sans mx-auto max-w-[1008px] text-center text-[length:var(--text-news-intro)] leading-[0.97] font-medium text-balance text-white"
      >
        {{ NEWS_INTRO_COPY.headline }}
      </p>
    </MotionReveal>
  </section>
</template>
