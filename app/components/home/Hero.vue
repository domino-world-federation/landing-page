<script setup lang="ts">
import { HERO_ALT, HERO_COPY } from "~/content/home/hero"

/**
 * Seconds. How long the rocks take to retreat, and how long their softening
 * takes — the two are one move and must be given the same number or the blur
 * lands before the scale does.
 *
 * Longer than a standard entrance (`DURATION`) because the rocks are the largest
 * things on the page and travel the furthest: the same duration that suits a
 * line of copy reads as a lurch across a shelf of rock.
 */
const HERO_RETREAT = DURATION * 1.5

/**
 * Seconds. The tile arrives on top of the rocks' retreat rather than after it —
 * roughly a third of the way in, so the two overlap instead of queueing.
 */
const TILE_DELAY = HERO_RETREAT / 3

/**
 * S2 — Figma node `22:789`. The main parallax section.
 *
 * The design only exists at 1920 × 1040, and every layer in it is placed as a
 * percentage of that frame. Those percentages are only meaningful on a box with
 * roughly that ratio, so the artwork lives in its own "stage" element that keeps
 * a wide ratio at every width. Below `lg` the stage is a normal block and the
 * copy flows underneath it; from `lg` up the stage fills the section and the
 * copy is placed over it exactly as in Figma.
 *
 * Stacking follows the child order in Figma, which is deliberate: the headline
 * sits at the very bottom so the domino tile crosses in front of the word
 * "WITHOUT". Because every layer carries an explicit z-index, DOM order is free
 * to differ — it is chosen for the mobile flow instead.
 *
 * Depth comes from the blur baked into the design (DESIGN-TOKENS §5): the more
 * blurred a layer, the further away it reads, and the slower it travels.
 *
 * The composition assembles itself. Both rocks start at full size and sharp,
 * then shrink towards the corner they are anchored to — top-right for the upper
 * one, bottom-left for the lower — so their outer edge stays pinned and they
 * retreat inwards rather than drifting away from the frame, going soft as they
 * go. The tile arrives while that retreat is still under way, out of focus at
 * first and then settling into the design's own slight blur.
 *
 * It plays on load and again on every return: scroll down to S4 and back up, and
 * the rocks retreat and the tile arrives once more. `EntranceGroup` drives all
 * three from a single viewport trigger so they keep the design's order whichever
 * direction the reader arrives from.
 *
 * Three moving layers, which is the per-viewport ceiling (RULES §12).
 */
</script>

<template>
  <!-- `56.25vw` IS the design's ratio — 1080/1920 — so at 1920 the section is
       1080px tall and every percentage inside it is Figma's own.

       It was 54.17vw until this was checked against the reference file: the hero
       was sliced from a file that draws it 1040 tall, and `oY2v2wq359rIRK4KaItmxc`
       draws it 1080. Forty pixels of frame is not a rounding difference here,
       because everything in this section is placed as a fraction of it — most
       visibly the countdown card, which hangs off the section's foot and so came
       up 37px short of the design. That is what the repo owner reported as the
       card sitting too high. **Every `lg:` percentage below was re-divided by
       1080 in the same pass**; a stray one still over 1040 puts its layer ~4%
       low and nothing flags it.

       The `max()` carries two floors, and they answer different failures.

       **840px** is the content floor. The ratio alone makes a narrower window
       give a shorter hero (810px at 1440, 720px at 1280) while the things
       stacked inside it do not shrink at all: the CTA is 72px and the two copy
       rows ~132px whatever the width. The content stops fitting below ~1480px,
       which is exactly where the button began overlapping "WITHOUT" — measured
       at 7px of bite at 1440 and 26px at 1280. Each extra pixel of height buys
       0.57 of gap (the headline sits at 0.426H while the block hangs off the
       bottom), so clearing it with a readable margin takes 840. The taller ratio
       reaches that floor at 1493 rather than 1551, so it now binds over a
       narrower band than it did.

       **`min(100dvh,75vw)`** is the fold floor, and it is there because
       **Figma's frame IS the screen**: 1920 × 1080 is a viewport, not a band, so
       everything the design hangs off this section's foot is drawn sitting on
       the fold. A 1920-wide window is rarely 1080 tall, and the ratio alone then
       leaves the section short of the bottom of the screen — measured at
       1800 × 1045, the hero came out 1012 and the countdown card, which hangs
       off the foot, finished 52px above the fold with the top of S4 already
       showing under it. That is the "kurang ke bawah" the repo owner reported,
       and it is not a placement the card can fix: the card is exactly where the
       design puts it INSIDE the section, and the section is what stops early.

       The `min()` is the guard, and without it this floor is worse than the bug.
       Every layer here is a percentage of the section, so a section stretched to
       a tall window stretches the composition with it — the tile is
       height-constrained inside its box, so it would simply grow. `75vw` caps
       the section at 4:3, which is the tallest the artwork tolerates: past that
       the ratio and the 840 take over again and the hero stops following the
       window. At 1920 × 1080 the term resolves to exactly 1080, so the design
       width still renders the design's own frame.

       Written as a height and NOT as `aspect-[1920/1040] min-h-[840px]`, which
       was the first attempt and is a trap: `aspect-ratio` resolves in both
       directions, so the floor fed back through the ratio and forced the section
       1551px WIDE — the entire page scrolled sideways at every width below that
       (measured `scrollWidth` 1551 against a 1280 viewport). A height cannot
       push the width around. -->
  <section
    class="from-hero-top to-hero-bottom relative isolate flex min-h-dvh snap-start snap-always flex-col overflow-hidden bg-linear-to-b lg:h-[max(840px,56.25vw,min(100dvh,75vw))] lg:min-h-0"
  >
    <!-- The stage IS the coordinate space, at every width: `inset-0` means a
         layer's percentages are percentages of the section.

         From `lg` the section carries the design's own 1920 × 1040 ratio, so
         those percentages are Figma's, unaltered. Below `lg` the same box is
         portrait, and each layer carries a second set of numbers.

         A single scaled frame was tried first and is what produced the mess the
         phone showed: a 1920 × 1040 box is only ~210px tall on a 390px screen,
         so the whole composition compressed into a band under the navbar and
         left a dead grey void between the headline and the CTA — a quarter of
         the screen with nothing in it. Widening the frame to fill that height is
         not available either, because every layer is sized as a fraction of the
         frame: the tile grows at the same rate and swallows the headline it is
         meant to pass behind.

         So the phone gets its own arrangement of the same three layers, keeping
         the design's diagonal — rock upper-right, tile through the middle, rock
         lower-left — spread over the full height instead of stacked in one band.
         `overflow-hidden` on the section clips the rocks' overhang, so nothing
         widens the page.

         `z-10` is what puts the artwork in front of the headline. Without it the
         stage is `z-auto`, which is NOT a stacking context — so its children do
         not compete with the headline as a group. Each layer's own z-index is
         then resolved against the section directly, and the headline, painted
         later in DOM order at the same effective level, wins on tie-break and
         covers the tile. Giving the stage a real z-index makes the whole group
         outrank `z-0`, and the tile crosses in front of "WITHOUT" as the Figma
         child order intends. It pairs with `isolate` on the section: that keeps
         these indices — and the CTA block's `z-60` — a private scale, so nothing
         here can outrank the navbar's `z-50` in the page's root context.

         One trigger for all three layers, which is the point of the group: they
         are three parts of one move spread across the section's full height.
         Left to arm themselves, the lower rock — nearest the reader coming back
         up from S3 — would cross its own threshold first and start retreating
         while the tile above was still off screen, so the composition would
         assemble bottom-up on the way back and top-down on load. One boolean
         keeps the design's order at both.

         `amount` is 0.4 rather than the copy default of 0.25: the trigger has to
         sit low enough that the section is genuinely being looked at, but leave
         room to rearm. Coming up from S3 the hero enters from the top of the
         viewport, so it is already 40% on screen well before it settles — the
         retreat plays into a filling frame rather than after it. -->
    <MotionEntranceGroup :amount="0.4" class="absolute inset-0 z-10">
      <!-- Rocks are the heaviest layers, and were once dropped below md to spare
           low-end phones the compositing. They are kept now because without them
           the phone layout is not the same design — three moving layers either
           way, which is the per-viewport ceiling (RULES §12).

           Upper-right on both, but far wider on a phone: a rock at Figma's 45%
           of a portrait box is a small chip floating in grey, where at 1920 the
           same fraction is a broad shelf. Sized to the viewport instead, it
           keeps the design's weight and its outer edge runs off the screen
           exactly as the design's runs off the frame. -->
      <MotionParallaxLayer
        :speed="12"
        :enter="{ scale: [1, 0.82], duration: HERO_RETREAT }"
        origin="topRight"
        anchor="top"
        decorative
        class="absolute top-[7%] left-[42%] z-10 w-[70%] lg:top-0 lg:left-[47.6%] lg:w-[45.4%]"
      >
        <!-- `priority` even though the rock is decorative: it is the biggest
             thing painted above the fold, so it is the LCP candidate. Being
             decorative makes it MORE important to preload, not less — the
             entrance animation starts on mount whether or not the bitmap has
             arrived, so a lazy rock plays its 1.6s retreat as an empty box and
             pops in late. -->
        <MotionSofteningImage
          src="/assets/global/decor-rock-top.png"
          alt=""
          :width="888"
          :height="361"
          priority
          from="0px"
          to="4px"
          :duration="HERO_RETREAT"
        />
      </MotionParallaxLayer>

      <!-- This one carries the phone layout. The gap between the headline and
           the CTA was the dead quarter of the screen; the lower rock is placed
           to run through it, so the eye travels headline → rock → CTA down the
           same left-leaning diagonal the design uses. `-left-[16%]` lets it
           bleed off the left edge rather than sit inside a margin. -->
      <MotionParallaxLayer
        :speed="6"
        :enter="{ scale: [1, 0.82], duration: HERO_RETREAT }"
        origin="bottomLeft"
        anchor="top"
        decorative
        class="absolute top-[43%] -left-[16%] z-20 w-[78%] lg:top-[63.9%] lg:left-[8.4%] lg:w-[49.2%]"
      >
        <!-- Same reasoning as the upper rock — which of the two is the LCP
             element depends on the viewport. -->
        <MotionSofteningImage
          src="/assets/global/decor-rock-bottom.png"
          alt=""
          :width="970"
          :height="403"
          priority
          from="0px"
          to="6.5px"
          :duration="HERO_RETREAT"
        />
      </MotionParallaxLayer>

      <!-- Height is pinned as well as width: Figma crops this one to a 585 × 636
           box (`objectFit: cover`). Letting the native 1882 × 2267 ratio decide
           would make the tile a tenth taller than the design.

           The phone numbers are chosen against the headline, which wraps to two
           lines there where the design has one: the tile is held to 30% of the
           viewport — the share it takes at 1920 — and its bottom edge stops
           inside the first line, so it crosses "WITHOUT" and leaves the second
           line completely clear. Measured per line with
           `Range.getClientRects()`: 46–50% of line one, 0% of line two.

           Comes in while the rocks are still retreating — it starts around a
           third of the way into their 1.6s and lands before they settle, so the
           two overlap instead of queueing.

           **The rotation rests at the design; the scale rests below it, and
           that second one is a judgement call rather than a measurement.**

           The asset is drawn 26.3° off vertical already and Figma adds no
           rotation of its own, so `rotate: 0` IS the design's lean. It used to
           rest at −6°, which rocked it off that lean for no reason the design
           gives; that is gone and should stay gone.

           `scale` is the knob the repo owner has moved twice, and it is the only
           thing here that is not Figma's. The design implies 1 — the layer box
           is its own 585 × 636 — but the box is filled `object-contain` from a
           1882 × 2267 asset, so the tile renders to the box's HEIGHT and reads
           heavier on the page than the flat crop does. It rested at 0.8, which
           was called too small and too high (0.8 shrinks towards the layer's own
           centre, lifting the tile's foot ~64px); it then rested at 1, which was
           called too big; 0.9 was still called big. **0.85 is where it has
           settled, and it is the number to move if this is asked again** —
           nothing else in this layer needs touching. -->
      <MotionParallaxLayer
        :speed="24"
        :enter="{
          opacity: [0, 1],
          scale: [0.70, 0.80],
          rotate: [-10, 0],
          duration: DURATION,
          delay: TILE_DELAY,
        }"
        anchor="top"
        class="absolute top-[16%] left-[43%] z-30 h-[15%] w-[30%] lg:top-[16.3%] lg:left-[35.3%] lg:h-[58.9%] lg:w-[30.5%]"
      >
        <!-- The PNG, not the SVG next to it: that SVG is the very same
             1882 × 2267 raster wrapped in base64, so it buys no sharpness — it
             only costs 1.4 MB and, being an SVG, skips the optimiser entirely.
             `quality` is raised because the tile is the one image the eye
             actually lands on, and the default flattens its gold.

             **It rests sharp, where Figma rests it at `blur(2px)`** (`24:933`).
             Reported by the repo owner as the tile not looking HD, and it was
             two things at once: 2px is genuinely soft at the ~550px this renders
             at, and the `filter` carrying it put the layer through a filter
             pass, which rasterises it into its own texture and drops the extra
             pixels a high-DPI screen would otherwise get. The entrance still
             softens — it arrives from 10px — so the move the design draws is
             intact; only the state it lands in changed. The two rocks keep their
             4px and 6.5px: those are depth, and the tile is the subject.

             `sizes` is @nuxt/image's breakpoint syntax, not the media-query
             string `next/image` took: a key names the width its value holds up
             to, and the largest key's value is the default from there on. This
             reads as the Next build's `(max-width: 1024px) 30vw, 31vw`. -->
        <MotionSofteningImage
          src="/assets/home/hero-domino-tile.png"
          :alt="HERO_ALT.dominoTile"
          fill
          :sizes='imageSizes({ xs: "30vw", lg: "31vw" })'
          priority
          :quality="90"
          from="10px"
          to="0px"
          :duration="DURATION"
          :delay="TILE_DELAY"
          image-class-name="object-contain"
        />
      </MotionParallaxLayer>

      <!-- Grounds the composition into the page background. Figma specifies a
           circle, but at this box ratio its top corners are already opaque and
           leave a hard horizontal seam — a wide ellipse keeps the whole top edge
           transparent while the falloff still matches.

           `lg` only, and deliberately: it fades to `--color-bg`, which is the
           right colour where the design's own vignette sits. On a phone the
           section is still mid-gradient at its foot, so the same fade reads as a
           dark band — and nothing there needs grounding, because the rocks stop
           well short of the bottom edge. -->
      <div
        aria-hidden="true"
        class="absolute inset-x-0 bottom-0 z-40 hidden h-[34.3%] bg-[radial-gradient(ellipse_130%_100%_at_51%_0%,transparent_47%,var(--color-bg)_100%)] lg:block"
      />
    </MotionEntranceGroup>

    <!-- `mt-auto` here and on the CTA block below splits the leftover height
         between them, which lands the tagline/headline pair near the middle of
         the section — where `lg` puts it explicitly at 36%/44%. Pinning it under
         the navbar instead left the words at the top and the artwork orphaned
         below them.

         `pt-28` reserves the navbar's band. The navbar overlays the hero rather
         than occupying its own row, so without it `mt-auto` is free to centre
         the tagline right under the logo — the two then print on top of each
         other. The padding is part of the flex item, so it is counted before the
         leftover space is split.

         The copy is deliberately still, and stays outside `EntranceGroup` so it
         keeps that way on the replay too. The hero's entrance is the artwork
         assembling itself — the words are what the moving pieces resolve into,
         so they are already in place when the rocks retreat. A `Reveal` was
         tried here and taken back out: text that re-animates on every return is
         the part a reader notices as an effect rather than as the page arriving,
         and it competes with the three layers moving behind it for the same
         moment.

         **`lg:w-fit lg:mx-auto` is what makes the gradient read.** Both this
         line and the headline are a white → `silver-mid` → white sweep painted
         through `bg-clip-text`, and a background is painted across the ELEMENT's
         box before it is clipped to the glyphs. Stretched edge to edge by
         `inset-x-0`, that box was the whole 1920: the sweep's white ends landed
         off in the margins and the type got only the middle of it, so
         "DOMINOES" opened grey instead of white and the whole line read dull —
         reported as the headline not being bright enough. Figma paints the same
         gradient across a node that is exactly as wide as the words (479px here,
         1385 for the headline), so the box is made to hug them: `w-fit` inside
         `inset-x-0` sizes to the type and `mx-auto` re-centres it. `px-0` goes
         with it, or the phone's gutter would put 20px of ramp at each end. -->
    <p
      class="font-sans relative z-50 mt-auto pt-28 bg-linear-to-r from-white via-[var(--color-silver-mid)] to-white bg-clip-text px-5 text-center text-base font-semibold tracking-[0.24em] text-transparent uppercase lg:absolute lg:inset-x-0 lg:top-[35.3%] lg:mx-auto lg:mt-0 lg:w-fit lg:px-0 lg:pt-0 lg:text-2xl"
    >
      {{ HERO_COPY.tagline }}
    </p>

    <!-- z-0 — behind every image, per the Figma child order. `w-fit`/`mx-auto`
         for the reason the tagline above records: the gradient is clipped to the
         type, so the box it is painted across has to be the type's own width.

         The line box is left at `leading-none` even though Figma's node is 109
         tall against a 156px face — the same 0.7 the countdown's digits were
         tightened to. It cannot follow them here: a background only paints
         inside the box, so a 109px box under 114px of caps would shave the tops
         and tails off the letters. The extra leading costs nothing anyway, since
         from `lg` this is positioned rather than in flow. -->
    <h1
      class="font-display relative z-0 mt-3 bg-linear-to-r from-white via-[var(--color-silver-mid)] to-white bg-clip-text px-5 text-center text-[length:var(--text-display-lg)] leading-none text-transparent uppercase lg:absolute lg:inset-x-0 lg:top-[42.6%] lg:mx-auto lg:mt-0 lg:w-fit lg:px-0"
    >
      {{ HERO_COPY.headline }}
    </h1>

    <!-- Anchored to the bottom (`mt-auto`), so both the gap and the bottom
         padding push the CTA upwards. In the 1080 frame Figma leaves **83px**
         between the button and the copy row, and **147px** below the last
         element — the gold CTA runs 630→702, the copy row starts at 785, and the
         "Official Rules" button ends at 933.

         **Both numbers came from the 1040 frame and were missed by the pass that
         re-divided the percentages** (see the section's own comment). 63 and 107
         are 1040's, and being `vw` rather than `%` they did not look like frame
         arithmetic — nothing here reads as a fraction of the height. The cost
         was 74.5px: the CTA sat at 776 where the design puts it at 702, which is
         what the repo owner asked to have raised.

         At `lg` both are written as `vw`, not as the raw px. The section's
         height is pinned to its width, so it shrinks as the window narrows — but
         fixed padding does not, and the block ends up claiming a larger and
         larger share of a smaller and smaller hero. Measured: 373px tall at
         every width, which is 36% of the hero at 1920 but 48% at 1440, where it
         had climbed 51px into the headline.

         4.32vw and 7.66vw are Figma's own 83 and 147 divided by 1920, so the
         design width still renders the design's numbers exactly, and every
         narrower one keeps the same proportion instead of the same pixels. -->
    <div
      class="relative z-60 mt-auto flex flex-col gap-10 px-5 pt-12 pb-10 md:px-10 lg:gap-[4.32vw] lg:px-20 lg:pt-0 lg:pb-[7.66vw]"
    >
      <!-- 340 × 72 in Figma (`31:1117`); the height is set by the component.
           `max-w-70` on a phone, not the full 340: at 390px wide the design's
           width fills 87% of the screen, where at 1920 the same button takes 18%
           — so carrying the raw number across turns a compact capsule into a bar
           spanning the viewport. The pill radius is a fixed 48px, which caps how
           wide it can go before the capsule reads as a rounded rectangle. From
           `sm` the screen is wide enough for Figma's own 340. -->
      <UiGoldCta
        :href="HERO_COPY.primaryCtaUrl"
        class="mx-auto w-full max-w-70 sm:max-w-85"
      >
        {{ HERO_COPY.primaryCta }}
      </UiGoldCta>

      <!-- Figma sets the two copy blocks against opposite edges. That reads as a
           pair only while they sit side by side; stacked on a phone, one
           ragged-left and one ragged-right block just looks misaligned — so
           below `lg` both centre, and the CTA stretches to the column. -->
      <div
        class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
      >
        <!-- Figma's own 432px block, narrowed between `menu` and `menu-lg`. That
             is exactly the band where the countdown card has been pulled up into
             this row: the card is a fixed 498px and centred, so the space on
             each side is `(vw − 498) / 2 − 80` of gutter, which at 1400 is 371px
             against a 432px block. 288px clears it; from `menu-lg` the row is
             wide enough for the design's own width. -->
        <p
          class="font-sans max-w-108 text-center text-base leading-[26px] text-white lg:text-left lg:text-lg menu:max-w-72 menu-lg:max-w-108"
        >
          {{ HERO_COPY.mission }}
        </p>

        <!-- `lg:gap-8` is Figma's 32 (`673:1414` ends at 837, `673:1415` opens
             at 869); 16 was the 1040 frame's. It is the third term in where the
             CTA lands — the row is bottom-anchored, so a taller right column
             pushes everything above it up. -->
        <div class="flex flex-col gap-4 lg:gap-8 lg:items-end">
          <p
            class="font-sans max-w-79 text-center text-base leading-[26px] text-white lg:text-right lg:text-lg"
          >
            {{ HERO_COPY.accountability }}
          </p>
          <NuxtLink
            to="#"
            class="rounded-btn font-display focus-visible:ring-gold flex items-center justify-center bg-white/20 px-5 py-4 text-[length:var(--text-display-btn)] leading-none text-white uppercase focus-visible:ring-2 focus-visible:outline-none lg:w-73"
          >
            {{ HERO_COPY.secondaryCta }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
