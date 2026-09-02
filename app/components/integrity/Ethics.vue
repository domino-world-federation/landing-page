<script setup lang="ts">
import { INTEGRITY_COPY } from "~/content/integrity"
import { ETHICS_ALT, ETHICS_CLAUSES } from "~/content/integrity/ethics"

/**
 * Code of Ethics — Figma node `762:1320`.
 *
 * **The design is About's pillars frame with the copy swapped**, and it is worth
 * saying plainly because the first build of this section missed it entirely: it
 * drew two photographs side by side and no text at all. `762:1320` is the same
 * construction down to the details — a masked window 820 x 860 whose rectangle
 * runs transparent → white at 35% → white at 65% → transparent (`762:1323`), a
 * column of blocks inside it offset by -89 so one sits square in the middle, the
 * same 760 x 960 photograph beside it, and the same 48 x 361 bite out of that
 * photograph's left edge. Even the sentence is caught mid-word: `762:1333` sets
 * "n-competitive behavior." to `rgba(255,255,255,0.4)` while the words before it
 * are white, which is a still of a line being read.
 *
 * So it is built as that: three clauses taking turns in one lit slot, each
 * reading itself while it holds the slot. The mechanism is `useTurningColumn`,
 * which was moved out of `AboutPillars` when this section arrived (D32/D43); the
 * layout below is this section's own.
 *
 * **What differs from the pillars.** This frame carries a heading, which the
 * pillars' does not, so the window has ~110px less of the screen to spend and
 * `--column-slot` is overridden to a value that fits under it — capped in `dvh`
 * as well as `vw`, because three slots sized off the viewport's WIDTH is exactly
 * the kind of number that overruns a wide, short window. The blocks are numbers
 * rather than titles, and the resting strength is the 0.4 this frame draws
 * rather than the pillars' 0.5.
 *
 * **It is a track, not a screen.** One viewport per clause with the stage pinned
 * inside, so reaching the technical section means having scrolled past all three
 * — the same reason the pillars stopped turning themselves, and the same reason
 * this page snaps at all.
 */
const COPY = INTEGRITY_COPY

const track = useTemplateRef<HTMLElement>("track")
const stage = useTemplateRef<HTMLElement>("stage")

/**
 * `pad: false` — the clauses are NUMBERED, and the padding the pillars want puts
 * a copy of the last block above the first. Here that drew `03` above `01`: a
 * list out of order, which is the one thing a numbered list may not be.
 */
const { steps, cells, index, inView, trackTransition, isPad } =
  useTurningColumn(track, stage, ETHICS_CLAUSES, { pad: false })

/**
 * How many slots the window shows — 860 of a 335 pitch (`762:1322` over
 * `762:1324`), so a little over two and a half.
 *
 * Deliberately NOT three, and this is the whole difference from the pillars.
 * There the window is exactly three slots and the track jumps a full slot per
 * turn to bring each block to the middle; the blocks are unnumbered claims and
 * a slot of empty column above the first one reads as more column. Three
 * numbered clauses cannot do that — an empty slot under the heading is a list
 * that has not started, and one at the foot is a list that has ended early.
 *
 * So the window is a little SHORTER than the column and all three clauses are in
 * it at once, which is what Figma draws: `01` fading in at the top, `02` square
 * in the clear middle, `03` fading out at the foot. What the reader's scroll
 * moves is mostly the LIGHT — one clause reading itself, then the next — and the
 * column creeps the 146px of overhang underneath it.
 */
const WINDOW_SLOTS = 2.567

/**
 * The creep, as a percentage of the track's own height: the overhang divided
 * across one notch per clause. `cells.length` is the track in slots, so
 * `(cells - window) / cells` is exactly the fraction of it that is off screen —
 * 14.4% here — and the column never travels further than the amount it actually
 * overhangs by, which is what keeps a blank from opening at either end.
 */
const trackY = computed(() => {
  const turns = Math.max(steps.value - 1, 1)
  const slots = cells.value.length || 1
  const overhang = ((slots - WINDOW_SLOTS) / slots) * 100

  return `-${(index.value / turns) * overhang}%`
})

/**
 * This section's own slot, overriding the shared token.
 *
 * 335 is the design's pitch — the column is 1006.52 tall for three clauses
 * (`762:1324`) — which is 17.45vw of the design width. The `26dvh` term is the
 * guard the width-based clamp cannot give: three slots at 17.45vw is 1005px on
 * any 1920-wide window including one 800px tall, where the window alone would be
 * taller than the screen it has to share with a heading. Whichever is smaller
 * wins, so Figma's pitch renders wherever there is room for it.
 */
const SLOT = "min(clamp(15rem, 17.45vw, 20.94rem), 26dvh)"
</script>

<template>
  <!-- `snap-pass` because the track is three screens tall, and a snap area
       taller than the screen is a band the reader may rest ANYWHERE inside
       rather than a position — `main.css` records the rule at length. The
       notches below are the stops instead, one per clause.

       The track only exists from `lg`. Below it the column and the picture stack
       and the height has to come from them, and the page does not snap there at
       all — a three-screen track with a pinned stage would be three screens of
       nothing to scroll past. -->
  <section
    ref="track"
    aria-labelledby="ethics-heading"
    :style="{
      '--ethics-steps': steps,
      '--ethics-window': WINDOW_SLOTS,
      '--column-slot': SLOT,
    }"
    class="snap-pass relative lg:h-[calc(var(--ethics-steps)*100dvh)] lg:motion-reduce:h-dvh"
  >
    <!-- One snap point per notch, so a gesture turns the column exactly once.
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

    <!-- The stage. `60 80` is the frame's own padding (`762:1320`), with the top
         floored at `--nav-clearance`: this is where the scroll comes to rest, so
         its head lands under a navbar up to 112px tall and 3.125vw is only 60 at
         the design width. -->
    <div
      ref="stage"
      class="flex flex-col gap-10 overflow-hidden px-5 pt-28 pb-[max(48px,3.125vw)] md:px-10 lg:sticky lg:top-0 lg:h-dvh lg:flex-row lg:items-stretch lg:justify-between lg:gap-16 lg:px-20 lg:pt-[max(var(--nav-clearance),3.125vw)]"
    >
      <!-- **The heading rides in the left column, not above the row**, and that
           is what puts its cap line level with the top of the photograph. Figma
           positions the picture absolutely at `y:60` — the frame's own padding —
           and the title is the first thing in flow at the same 60, so the two
           start together. Stacking the title above a row of two put the picture
           a heading and a gap lower than the words beside it.

           `1.875vw` is the frame's 36 between the title and the window. -->
      <div
        class="flex min-h-0 flex-col gap-8 lg:w-[42.71%] lg:flex-none lg:gap-[1.875vw]"
      >
        <MotionReveal :y="40">
          <h2
            id="ethics-heading"
            class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
          >
            {{ COPY.ethicsHeading }}
          </h2>
        </MotionReveal>

        <!-- The mask is on the OUTER element and the movement on the inner one.
             Reversed, the window would travel with the blocks and never fade
             anything — the point is that one is fixed and the other is not.

             `max-h-full` is the last guard: on a window too short even for the
             `dvh` term the column is clipped rather than pushing the picture off
             the screen. -->
        <div
          class="column-mask relative w-full lg:h-[calc(var(--column-slot)*var(--ethics-window))] lg:min-h-0 lg:shrink lg:overflow-hidden"
        >
          <Motion
            as="div"
            class="absolute inset-x-0 top-0"
            :animate="{ y: trackY }"
            :transition="trackTransition"
            :style="{ willChange: 'transform' }"
          >
            <!-- Each cell is one slot tall with its block centred in it: that is
                 what makes a single fixed translation land every block in the
                 same place, whichever of the three it is. -->
            <div
              v-for="(clause, i) in cells"
              :key="`${clause.id}-${i}`"
              class="flex flex-col justify-center py-8 lg:h-[var(--column-slot)] lg:py-0"
            >
              <!-- `reading` is gated on the column being on screen as well as on
                   the clause holding the slot, so the first sentence is read
                   when the reader ARRIVES rather than while the section is still
                   below the fold. `focused` is not: it decides the block's
                   opacity, and the design's resting state has one clause already
                   lit. -->
              <IntegrityEthicsClause
                :clause="clause"
                :duplicate="isPad(i)"
                :focused="i === index"
                :reading="i === index && inView"
              />
            </div>
          </Motion>
        </div>
      </div>

      <!-- 760 x 960 in Figma (`762:1338`) — a portrait frame, not the
           photograph's own ratio, so it is `object-cover` and the crop is
           deliberate. 39.58vw is 760/1920. Nothing here moves: the picture is
           the section's fixed point, and it stands the full height of the stage
           so that its head meets the heading's.

           NOT `overflow-hidden` — the notch below hangs on the frame's own left
           edge and clipping would take half of it. The rounded corners come from
           the image instead, which is the only thing inside that needs them. -->
      <div
        class="relative aspect-[3/4] w-full lg:aspect-auto lg:h-full lg:w-[39.58%] lg:flex-none"
      >
        <NuxtImg
          src="/assets/global/olympic-rings-facade.png"
          :alt="ETHICS_ALT.photo"
          :sizes="imageSizes({ xs: '100vw', lg: '40vw' })"
          :quality="85"
          class="absolute inset-0 size-full rounded-[20px] object-cover"
        />

        <!-- The bite out of the picture's left edge — `762:1340`, a 48 x 361
             shape at `y:70` filled `#0E0E0E`. It is not a cut-out: it is the
             page background drawn ON TOP of the photograph, which is why the
             fill is a literal colour rather than a mask. That also means it only
             reads correctly over `--color-bg`, which is what this section stands
             on.

             Placed as fractions of Figma's 760 x 960 frame — 6.32% wide, 37.6%
             tall, 7.29% down — so it holds its place as the frame scales. The
             file is shared with About's pillars, which draws the same bite 21px
             lower. Decorative (RULES §12). -->
        <img
          src="/assets/global/decor-notch.svg"
          alt=""
          aria-hidden="true"
          width="48"
          height="361"
          class="pointer-events-none absolute top-[7.29%] left-0 h-[37.6%] w-[6.32%]"
        >
      </div>
    </div>
  </section>
</template>
