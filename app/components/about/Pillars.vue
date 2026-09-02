<script setup lang="ts">
import { PILLARS, PILLARS_ALT } from "~/content/about/pillars"

/**
 * Pillars — Figma node `566:13542`. The three claims, taking turns.
 *
 * The section's whole idea is the mask. Figma wraps the blocks in a group
 * (`566:13543`) whose rectangle is transparent → white → white → transparent, so
 * the column fades out at both ends and only the middle is fully lit.
 *
 * **It used to be a marquee and now it takes turns.** The column travelled
 * continuously on a 30-second CSS loop, which meant every block was always
 * partly on its way somewhere — including the one being read, which drifted
 * upward under the reader's eye. The design is not describing a drift: it draws
 * one block lit and square in the middle with the others dimmed to 50%
 * (`566:13556`), which is a thing HOLDING a place, not passing through it. So
 * the column steps: a block arrives, holds while its sentence reads itself, and
 * hands the slot on.
 *
 * The picture does not move at all, and that is the point of the pairing — the
 * only thing in the section that changes is the words.
 *
 * **The turning itself lives in `useTurningColumn`**, where its reasoning is
 * written out: why the reader turns it rather than a timer, why the list is
 * padded at both ends, and why the offset is a percentage. Integrity's code of
 * ethics is drawn as the same construction, which is what moved it out of here
 * (D32/D43). What stays is this section's own layout: the window's proportions,
 * the photograph beside it, and the blocks.
 */
const track = useTemplateRef<HTMLElement>("track")
const stage = useTemplateRef<HTMLElement>("stage")

const { steps, cells, index, inView, trackY, trackTransition, isPad } =
  useTurningColumn(track, stage, PILLARS)
</script>

<template>
  <!-- **A track, one viewport per pillar, with the stage pinned inside it.** The
       section used to be one screen and the column turned itself; now the scroll
       through this track is what turns it, so the reader cannot reach the next
       section without having passed all three. See the script for why the timer
       went.

       `snap-pass` because the track is three screens tall, and a snap area
       taller than the screen is a band the reader may rest ANYWHERE inside
       rather than a position — `main.css` records the rule at length. The
       notches below are the stops instead, one per pillar, which is the same
       thing every other section on this page gets from `snap-children`.

       The track only exists from `lg`. Below it the column and the picture stack
       and the height has to come from them, and the page does not snap there at
       all — a three-screen track with a pinned stage would be three screens of
       nothing to scroll past. -->
  <section
    ref="track"
    :style="{ '--pillars-steps': steps }"
    class="snap-pass relative lg:h-[calc(var(--pillars-steps)*100dvh)] lg:motion-reduce:h-dvh"
  >
    <!-- One snap point per notch, so a gesture turns the column exactly once —
         the page's own `scroll-snap-stop: always` applied inside a section.
         Markers rather than content: absolutely positioned, so they add nothing
         to the track's layout, and the first sits at the track's head, which is
         what gives this section the stop its siblings carry on the section
         itself.

         Hidden under reduced motion for the same reason the track collapses
         there: they would otherwise stack three viewports of snap points inside
         a one-viewport track and spill into the section after it. -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 hidden h-full lg:block lg:motion-reduce:hidden"
    >
      <div
        v-for="notch in steps"
        :key="notch"
        class="h-dvh snap-start snap-always"
      />
    </div>

    <!-- The stage. `60 80` is the frame's own padding (`728:1230`), with the top
         floored at 144: this is where the scroll comes to rest, so its head
         lands under a navbar up to 112px tall (`NavShell`'s `NAV_HEIGHT`), and
         3.125vw is 60 at the design width. Same floor the partners band, the
         home FAQ and Heritage carry. -->
    <div
      ref="stage"
      class="flex flex-col items-center justify-center gap-12 overflow-hidden px-5 pt-28 pb-[max(48px,3.125vw)] md:px-10 lg:pt-[max(var(--nav-clearance),3.125vw)] lg:sticky lg:top-0 lg:h-dvh lg:flex-row lg:justify-between lg:gap-16 lg:px-20"
    >
    <!-- The mask is on the OUTER element and the movement on the inner one.
         Reversed, the window would travel with the blocks and never fade
         anything — the point is that one is fixed and the other is not.

         Three slots tall, which is both the design's 1080 (56.25vw at three
         360px slots) and what gives the focused block a neighbour to fade out
         above it and one to fade in below. -->
    <div
      class="column-mask relative w-full lg:h-[calc(var(--column-slot)*3)] lg:w-[42.71%] lg:overflow-hidden"
    >
      <Motion
        as="div"
        class="absolute inset-x-0 top-0"
        :animate="{ y: trackY }"
        :transition="trackTransition"
        :style="{ willChange: 'transform' }"
      >
        <!-- Cells are positional and the list repeats, so the block's own id is
             not unique across the track and cannot be the key.

             Each cell is one slot tall with its block centred in it: that is
             what makes a single fixed translation land every block in the same
             place, whichever of the three it is. -->
        <!-- The padded copies are hidden below `lg`: with no turn they are
             not neighbours waiting their turn, they are the last claim printed
             before the first one and the first printed again after the last. -->
        <div
          v-for="(pillar, i) in cells"
          :key="`${pillar.id}-${i}`"
          :class="
            cn(
              'flex flex-col justify-center py-8 lg:h-[var(--column-slot)] lg:py-0',
              isPad(i) && 'hidden lg:flex',
            )
          "
        >
          <!-- `reading` is gated on the column being on screen as well as on the
               block holding the slot, so the first sentence is read when the
               reader ARRIVES rather than while the section is still below the
               fold. `focused` is not: it decides the block's opacity, and the
               design's resting state has one block already lit. -->
          <AboutPillarBlock
            :pillar="pillar"
            :duplicate="isPad(i)"
            :focused="i === index"
            :reading="i === index && inView"
          />
        </div>
      </Motion>
    </div>

    <!-- 760 × 960 in Figma — a portrait frame, not the photograph's own 3:2, so
         it is `object-cover` and the crop is deliberate. 39.58vw is 760/1920.
         Nothing here moves: the picture is the section's fixed point.

         NOT `overflow-hidden`, which is what it used to be: the notch below
         hangs on the frame's own left edge and clipping would take half of it.
         The rounded corners come from the image instead, which is the only thing
         inside that needs them. -->
    <div
      class="relative aspect-[3/4] w-full lg:aspect-auto lg:h-[50vw] lg:max-h-[960px] lg:w-[39.58%]"
    >
      <NuxtImg
        src="/assets/global/olympic-rings-facade.png"
        :alt="PILLARS_ALT.photo"
        :sizes="imageSizes({ xs: '100vw', lg: '40vw' })"
        :quality="85"
        class="absolute inset-0 size-full rounded-[20px] object-cover"
      />

      <!-- The bite out of the picture's left edge — `566:13563`, a 48 × 361
           shape at `y:91` filled `#0E0E0E`. It is not a cut-out: it is the page
           background drawn ON TOP of the photograph, which is why the fill is a
           literal colour rather than a mask. That also means it only reads
           correctly over `--color-bg`, which is what this section stands on.

           Placed as fractions of Figma's 760 × 960 frame — 6.32% wide, 37.6%
           tall, 9.48% down — so it holds its place as the frame scales.
           Decorative: it is an edge treatment and says nothing (RULES §12). -->
      <img
        src="/assets/global/decor-notch.svg"
        alt=""
        aria-hidden="true"
        width="48"
        height="361"
        class="pointer-events-none absolute top-[9.48%] left-0 h-[37.6%] w-[6.32%]"
      >
      </div>
    </div>
  </section>
</template>
