<script setup lang="ts">
import { FEATURE_HQ_ALT, FEATURE_HQ_COPY } from "~/content/home/feature-hq"

/**
 * Seconds. The building settles more slowly than the copy that sits on it — it
 * is the larger object and the further one away, so the same duration would have
 * it moving at a visibly higher speed than the words in front of it.
 */
const SETTLE = DURATION * 1.5

/**
 * S4 — Figma node `31:1085`. The join call, on a picture of the game itself.
 *
 * **The picture changed on 2026-09-05** — it was `feature-hq-composite.webp`,
 * the headquarters building, and it is now a black-and-white photograph of a
 * table mid-game. The component keeps its name: it is built around a full-bleed
 * photograph with a copy column over it, and that is still what it is. The About
 * page keeps the building shot (`117:3846`), so the composite is still in use —
 * this section simply no longer shares it.
 *
 * ── The three washes moved from the file into CSS ──
 *
 * The composite had them painted in: the vignette along the top (`31:1089`), the
 * downward darkening that carries the text (`31:1103`), and the fade to page
 * background at the foot (`37:1848`). The replacement is an unretouched
 * photograph and carries none of them, so they are reproduced below the image —
 * with numbers measured off both files rather than chosen, see the note there.
 *
 * That also relaxes a constraint this section used to carry. The baked fades
 * were horizontal bands at fixed positions, so `object-cover` was only ever safe
 * cropping LEFT and RIGHT: a wider box would have eaten the top and bottom bands
 * and put a hard edge back. The CSS wash is painted on the SECTION, so it stays
 * whole at any crop, and the picture can be cropped in either direction now.
 * The ratio below is kept anyway — it is the design's frame, and the crop only
 * tightens on narrow screens where some loss is unavoidable.
 *
 * This is the first section with real scroll above it, so unlike the hero it
 * gets true scroll-linked parallax — S2 had none, there was nothing to scroll.
 * One moving layer, well inside the 3–4 ceiling of RULES §12.
 *
 * Every entrance here rearms: scroll the section past and come back, and the
 * building settles and the copy rises again. The section is a full viewport of
 * picture with four words of headline, so it is a place the reader scrolls back
 * to — an entrance that fires once would leave the second visit flat.
 */
</script>

<template>
  <!-- The image's own 1080/1920 ratio from `lg`, with two floors — the same
       pair, for the same reasons, that the hero carries (S2).

       **720px** is the content floor: the text column does not shrink with the
       window, so pure ratio would squeeze it against the section's edges on
       narrow desktops.

       **`min(100dvh,75vw)`** is the fold floor. Figma's frame is a viewport, so
       this section is drawn as a full screen of picture; at any window taller
       than 9/16 of its width the ratio alone leaves a band of the next section
       showing under it, and a section built to be walked into arrives already
       half left. `min()` caps the stretch at 4:3 exactly as the hero's does,
       though the risk it guards is different here: nothing inside is sized as a
       fraction of the height, so a tall window only crops the photograph harder.
       **That crop is safe in this direction and only in this direction** — the
       composite's fades are horizontal bands, so `object-cover` taking more off
       the LEFT and RIGHT leaves them whole, where a wider box would eat the top
       and bottom ones and put a hard edge back.

       Below `lg` the height follows the copy and the picture becomes a backdrop
       behind it. -->
  <section
    class="relative isolate flex min-h-[560px] snap-start snap-always flex-col justify-center overflow-hidden lg:h-[max(720px,56.25vw,min(100dvh,75vw))] lg:min-h-0"
  >
    <!-- Slow, and slower than anything in the hero: this is the backdrop, so it
         trails the page rather than racing it. `-z-10` keeps the whole layer
         behind the copy; `isolate` on the section stops that negative index from
         escaping into the page's root stacking context and sliding behind the
         page background itself.

         The scale entrance rides INSIDE the parallax wrapper on purpose — the
         outer element owns `y` from the scroll position, the inner one owns a
         one-off `scale`, so the two never write to the same transform. -->
    <MotionParallaxLayer :speed="8" decorative class="absolute inset-0 -z-10">
      <!-- Pushed in past its resting frame, then settling back — the building
           comes to rest rather than simply being there. It never goes below `1`,
           so no edge of the baked-in fade is ever pulled inside the frame
           mid-animation. -->
      <MotionReveal :scale="[1.14, 1]" :duration="SETTLE" class="size-full">
        <!-- Full-bleed: the image always spans the viewport, so every candidate is
             the viewport's own width. Written through `imageSizes` rather than as
             a bare `100vw`, which @nuxt/image reads as the key `1px` and answers
             with a two-pixel srcset — see the note on that helper. -->
        <NuxtImg
          src="/assets/home/table-dwf-bw.webp"
          :alt="FEATURE_HQ_ALT.table"
          :sizes="SIZES_FULL_BLEED"
          :quality="90"
          class="absolute inset-0 size-full object-cover"
        />
      </MotionReveal>
    </MotionParallaxLayer>

    <!-- **The three washes, in CSS — because this photograph does not carry
         them.** `feature-hq-composite.webp` had them painted in: measured, its
         top and bottom rows were exactly `#0e0e0e`, so it met the page with no
         seam, and its brightest pixels behind the copy reached only 109. The
         replacement is an unretouched photograph — its top and bottom rows
         average 52 with peaks at 213, which puts a hard horizontal edge across
         the page at both ends, and its brightest pixels behind the copy reach
         240, which is white text on near-white domino tiles.

         The numbers here are read off those two measurements rather than
         chosen. 0.62 across the middle takes a 240 highlight to 100, just under
         the 110 that white body text needs for 4.5:1 — and 109 is what the
         composite itself measured, so this matches the design rather than
         guessing at it. The ends close to full `--color-bg`, which is what
         removes the seam.

         **Outside the parallax layer, not inside it.** The old fades travelled
         with the picture because they were part of it; these are fixed to the
         section, so the ends stay welded to the page background no matter where
         the parallax has pushed the photograph. That is strictly safer than the
         baked-in version, which relied on the scale never dropping below 1. -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--color-bg)_0%,rgba(14,14,14,0.55)_10%,rgba(14,14,14,0.62)_50%,rgba(14,14,14,0.72)_85%,var(--color-bg)_100%)]"
    />

    <!-- Node `31:1105`: **913px wide at `x:503.5`** — a column left of centre,
         clear of the signage on the building's right face. The redraw widened it
         from 870 and nudged it left, which is what the longer headline needed.
         The design's 44px gap is kept; below `lg` the column starts at the
         section gutter, where there is no room to indent.

         Vertically it is left to `justify-center` rather than placed, and that
         is not a shortcut: the block measures 190 + 44 + 56 + 44 + 64 = 398, and
         centred in 1080 that puts its top at 341 against the design's 342.

         The three blocks rise and come into focus in sequence: the headline
         leads, the body follows it up, the button lands last. Curve, duration
         and step all come from `utils/motion` — the same three constants the
         hero animates on — so the page has one hand rather than a different one
         per section. -->
    <div
      class="relative mx-auto flex w-full max-w-[913px] flex-col gap-8 px-5 py-16 md:px-10 lg:mx-0 lg:ml-[26.2%] lg:gap-[2.3vw] lg:px-0 lg:py-0"
    >
      <MotionReveal :y="48" blur-from="12px">
        <h2
          class="font-display text-gold-gradient text-[length:var(--text-display-feature)] leading-none uppercase"
        >
          <!-- A block per line so the design's break survives, rather than a
               `<br>` that a translation would have to carry along (RULES §9). -->
          <span
            v-for="line in FEATURE_HQ_COPY.headline"
            :key="line"
            class="block"
          >{{ line }}</span>
        </h2>
      </MotionReveal>

      <MotionReveal :y="40" :delay="STAGGER" blur-from="8px">
        <!-- No width cap of its own: `31:1101` is set to FILL its column, so
             the paragraph is as wide as the headline above it. It used to be
             held to 680 because the copy it carried was a five-line paragraph
             that wanted a shorter measure; the redraw's is one sentence. -->
        <p
          class="font-sans text-base leading-7 text-white lg:text-xl lg:leading-8"
        >
          {{ FEATURE_HQ_COPY.body }}
        </p>
      </MotionReveal>

      <!-- 223 × 64 in Figma (`31:1489`), the same white-20% treatment as the
           hero's secondary button. Width is left to the content so a longer
           translation cannot clip the label; the design's width falls out of its
           own padding — "EXPLORE DWF ID" sets ~183px in Bebas 32, and the 2 × 20
           padding makes up the rest. -->
      <MotionReveal
        :y="32"
        :delay="STAGGER * 2"
        blur-from="6px"
        class="w-fit"
      >
        <NuxtLink
          :to="FEATURE_HQ_COPY.ctaUrl"
          class="rounded-btn font-display focus-visible:ring-gold flex h-16 w-fit items-center justify-center bg-white/20 px-5 text-[length:var(--text-display-btn)] leading-10 text-white uppercase transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:outline-none"
        >
          {{ FEATURE_HQ_COPY.cta }}
        </NuxtLink>
      </MotionReveal>
    </div>
  </section>
</template>
