<script setup lang="ts">
import { HQ_ALT, HQ_CONTACT, HQ_COPY } from "~/content/about/headquarters"

/**
 * Seconds. The building settles more slowly than the copy on it — the same
 * reasoning S4 records: it is the larger, further object, and an equal duration
 * would have it moving at a visibly higher speed than the words in front.
 */
const SETTLE = DURATION * 1.5

/**
 * Headquarters — Figma node `117:3846`. The page's closing section.
 *
 * The same building S4 shows, from the same file: About's photograph carries
 * `imageRef 1008bddc…`, which is the composite the landing page already loads.
 * It has moved to `global/` rather than being downloaded a second time under
 * another name.
 *
 * That shared file is also why this section paints NO washes of its own. Figma
 * draws three here — a blurred darkening across the middle (`117:3848`), a fade
 * to page background at the foot (`117:3849`), and a radial vignette over the
 * top (`117:3855`) — and every one of them is already baked into the export
 * (D22). Reproducing them in CSS would darken the picture twice, which is the
 * exact trap S4 hit and `home/News` records — where the redraw has since gone
 * the other way, separating the photograph from its wash so the wash could be
 * drawn in CSS against a taller frame.
 *
 * The text column is `x:525 w:870` — the same column S4's is, to the pixel. The
 * two sections are the same composition with different copy, so they are laid
 * out the same way rather than each finding its own numbers.
 */
</script>

<template>
  <!-- **A screen of its own, like every other stop on this page.** It was
       `max(620px, 46.88vw)` — the design's 900 — which on a snapping page is a
       stop shorter than the screen, and a stop shorter than the screen is one a
       flick can cross along with whatever follows it. Below `lg` the height
       follows the copy and the picture becomes a backdrop behind it. -->
  <section
    class="relative isolate flex min-h-[620px] snap-screen flex-col justify-center overflow-hidden lg:h-dvh lg:min-h-0"
  >
    <!-- Slower than anything in front of it — this is the backdrop, so it trails
         the page rather than racing it. `-z-10` keeps the layer behind the copy;
         `isolate` on the section stops that negative index escaping into the
         page's root stacking context and sliding behind the page background
         itself.

         `foot` rather than the default anchor: this is the last section before
         the footer, and a `cross` range needs the section to exit upwards to
         finish — which the end of a document never lets it do. Measured on S7
         while it was last, the layer stalled halfway (D16). -->
    <MotionParallaxLayer
      :speed="8"
      anchor="foot"
      decorative
      class="absolute inset-0 -z-10"
    >
      <!-- Pushed in past its resting frame, then settling back. It never goes
           below `1`, so no edge of the baked-in fade is ever pulled inside the
           frame mid-animation. -->
      <MotionReveal :scale="[1.12, 1]" :duration="SETTLE" class="size-full">
        <NuxtImg
          src="/assets/global/feature-hq-composite.png"
          :alt="HQ_ALT.building"
          :sizes="SIZES_FULL_BLEED"
          :quality="90"
          class="absolute inset-0 size-full object-cover"
        />
      </MotionReveal>
    </MotionParallaxLayer>

    <!-- **The foot, faded to the page.** `feature-hq-composite.png` carries its
         own fade to `#0E0E0E` in its bottom rows — which is why the home page's
         copy of it needs no overlay — but that only survives while the frame
         keeps the picture's 16:9. This section does not: at the design's 46.88vw
         it was already cropping the baked fade away, and pinning it to the
         screen crops more. `object-cover` takes the difference off the top and
         bottom, so the first thing lost is exactly the thing that made the join
         seamless, and the section ended on a hard horizontal edge against the
         footer's black.

         Drawn here instead, where the crop cannot reach it. A gradient rather
         than a blur: there is nothing behind this to blur, and `backdrop-filter`
         over a photograph costs a snapshot every frame for a softness a two-stop
         gradient states outright.

         No z-index: the section is `isolate`, the picture sits at `-z-10`, and
         this is `z-auto` — above the photograph, and below the copy, which comes
         after it in the DOM and wins the tie. -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-linear-to-b from-transparent to-[var(--color-bg)]"
    />

    <!-- Figma's 44px gap between the three blocks; 2.3vw is 44/1920. Below `lg`
         the column starts at the section gutter, where there is no room to
         indent it. -->
    <div
      class="relative mx-auto flex w-full max-w-[870px] flex-col gap-8 px-5 py-16 md:px-10 lg:mx-0 lg:ml-[27.3%] lg:gap-[2.3vw] lg:px-0 lg:py-0"
    >
      <MotionReveal :y="48" blur-from="12px">
        <h2
          class="font-display text-gold-gradient text-[length:var(--text-display-feature)] leading-none uppercase"
        >
          {{ HQ_COPY.headline }}
        </h2>
      </MotionReveal>

      <!-- A `<ul>` because the three are a set of ways to reach one office, and
           a screen reader saying "list, 3 items" is that shape said out loud.
           28px between them; 1.46vw is 28/1920. -->
      <MotionReveal :y="40" :delay="STAGGER" blur-from="8px">
        <ul class="flex list-none flex-col gap-4 lg:gap-[1.46vw]">
          <AboutContactRow
            v-for="line in HQ_CONTACT"
            :key="line.id"
            :line="line"
          />
        </ul>
      </MotionReveal>

      <!-- Not a link and not a button: the design draws a panel, and the hours
           are the information — there is nowhere for a press to lead. Width is
           left to the content so a longer translation cannot clip the label. -->
      <MotionReveal :y="32" :delay="STAGGER * 2" blur-from="6px" class="w-fit">
        <p
          class="rounded-btn font-display flex h-16 w-fit items-center justify-center bg-white/20 px-5 text-[length:var(--text-display-btn)] leading-10 text-white uppercase"
        >
          {{ HQ_COPY.hours }}
        </p>
      </MotionReveal>
    </div>
  </section>
</template>
