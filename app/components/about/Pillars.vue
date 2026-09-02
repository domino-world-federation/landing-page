<script setup lang="ts">
import { PILLARS, PILLARS_ALT } from "~/content/about/pillars"

/**
 * The turn itself — a glide, not the stats wheel's detent.
 *
 * `StatsWheel` springs, because a picker wheel is a thing being CAUGHT at each
 * notch. This is three paragraphs taking turns being read, and a spring's
 * overshoot would bounce a block of body copy the reader is about to start on.
 *
 * 1.15s, where it started at 0.62. At the shorter length the column arrived
 * rather than travelled: a whole slot of movement — 360px at the design width —
 * crossed in about half a second, which is quick enough that the eye registers
 * the change of position without following it. Nearly doubling it lets the
 * blocks be watched moving up one place, which is what the section is asking to
 * be read as. Nothing else here is in a hurry.
 */
const TURN_EASE = { duration: 1.15, ease: EASE } as const

/**
 * Pillars — Figma node `566:13542`. The three claims, taking turns.
 *
 * The section's whole idea is the mask. Figma wraps the blocks in a group
 * (`566:13543`) whose rectangle is transparent → white → white → transparent, so
 * the column fades out at both ends and only the middle is fully lit.
 *
 * It is a `mask-image` rather than two gradient overlays, and that is the only
 * version that works here: the page behind this is `--color-bg` in some places
 * and Vision's vignette in others, so an overlay would have to know what colour
 * it is covering. A mask removes the type instead of painting over it.
 *
 * **It used to be a marquee and now it takes turns.** The column travelled
 * continuously on a 30-second CSS loop, which meant every block was always
 * partly on its way somewhere — including the one being read, which drifted
 * upward under the reader's eye. The design is not describing a drift: it draws
 * one block lit and square in the middle with the others dimmed to 50%
 * (`566:13556`), which is a thing HOLDING a place, not passing through it. So
 * the column now steps: a block arrives, holds while its sentence reads itself,
 * and hands the slot on.
 *
 * The picture does not move at all, and that is the point of the pairing — the
 * only thing in the section that changes is the words.
 *
 * **Why the list is rendered twice.** The focused slot has a neighbour above and
 * below it, so the cells at `index - 1` and `index + 1` must both exist. On a
 * single lap the first block has nothing above it and the last nothing below,
 * and the column would open and close against an empty slot. Two copies put a
 * real block in every neighbouring cell at every notch.
 *
 * **Why the offset is a percentage.** Every cell is exactly one slot tall, so
 * translating the track by `100 / cells` percent of its own height moves it by
 * precisely one slot — at any viewport, without measuring anything. That is also
 * why the blocks sit in fixed slots rather than on the design's flat 164px gap:
 * the three are different heights, and a gap would put each one at a different
 * place in the window as it arrived.
 */
/** One notch per pillar, and therefore one viewport of track per pillar. */
const steps = computed(() => PILLARS.length)

const track = useTemplateRef<HTMLDivElement>("track")
const stage = useTemplateRef<HTMLDivElement>("stage")
const prefersReducedMotion = useReducedMotion()

// Measured on the STAGE rather than the track: the track is `steps` viewports
// tall, so a fraction of it is a fraction of something mostly off screen. Same
// split `StatsWheel` uses — measure the frame, drive the content.
const inView = useInView(stage, { amount: 0.3 })

/**
 * The list with one block padded onto each end — the last before it, the first
 * after it — so every notch has a real block in the slot above and the slot
 * below it.
 *
 * It was two full laps, which is what a column that looped needed. Nothing loops
 * now: the reader opens on the first pillar and stops on the last, and a pad of
 * one at each end fills both neighbouring slots for `n + 2` cells instead of
 * `2n`. It is also what lets the column open on the FIRST block — the laps
 * forced it to start at index 1 and so to open on the second, which is not the
 * order the list is written in.
 */
const cells = computed(() => [
  PILLARS[PILLARS.length - 1]!,
  ...PILLARS,
  PILLARS[0]!,
])

/** Cell 0 is the pad, so cell 1 is the first real block. */
const index = ref(1)

/**
 * **The column is turned by the reader, not by a clock.**
 *
 * It ran on a `setInterval` — 3.2s of hold plus 1.5s of turn — and the trouble
 * with a timer is that it does not know whether anyone is reading. A slow reader
 * lost the sentence mid-way; a fast one waited. Worse for this page: the section
 * was one screen and its neighbours snap, so a reader who arrived and scrolled
 * on took the next section with them and never saw two of the three claims.
 *
 * The section is a track one viewport tall per pillar with the stage `sticky`
 * inside it, and the scroll through that track is what advances the index — the
 * construction `StatsWheel` settled on, for the same reason. Reaching the
 * section after this one now means having scrolled past all three, which is what
 * the repo owner asked for in as many words.
 *
 * `steps - 1` turns for `steps` notches. The `start start` → `end end` range
 * spans exactly the travel available while the stage is pinned: it opens when
 * the track's head reaches the top of the screen and closes when its foot
 * reaches the bottom. Rounding the progress is what turns a continuous scroll
 * back into whole notches for the glide to travel between.
 */
const { scrollYProgress } = useScroll({
  target: track,
  offset: ["start start", "end end"],
})

useMotionValueEvent(scrollYProgress, "change", (progress: number) => {
  const turns = steps.value - 1
  if (turns < 1 || !Number.isFinite(progress)) return

  const notch = Math.min(Math.max(Math.round(progress * turns), 0), turns)
  index.value = notch + 1
})

// Same tree whatever the preference; only the transition is zeroed (RULES §12).
const trackTransition = computed(() =>
  prefersReducedMotion.value ? { duration: 0 } : TURN_EASE,
)

// `1 - index`, not `-index`: the focused block belongs in the MIDDLE of the
// three slots, so the track sits one slot lower than a plain top-aligned offset
// would put it.
const trackY = computed(
  () => `${((1 - index.value) * 100) / cells.value.length}%`,
)

const COLUMN_MASK =
  "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)"
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
      class="relative h-[calc(var(--pillar-slot)*3)] w-full overflow-hidden lg:w-[42.71%]"
      :style="{ maskImage: COLUMN_MASK, WebkitMaskImage: COLUMN_MASK }"
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
        <div
          v-for="(pillar, i) in cells"
          :key="`${pillar.id}-${i}`"
          class="flex h-[var(--pillar-slot)] flex-col justify-center"
        >
          <!-- `reading` is gated on the column being on screen as well as on the
               block holding the slot, so the first sentence is read when the
               reader ARRIVES rather than while the section is still below the
               fold. `focused` is not: it decides the block's opacity, and the
               design's resting state has one block already lit. -->
          <AboutPillarBlock
            :pillar="pillar"
            :duplicate="i === 0 || i === cells.length - 1"
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
        src="/assets/about/pillars-olympic-rings.png"
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
        src="/assets/about/decor-pillars-notch.svg"
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
