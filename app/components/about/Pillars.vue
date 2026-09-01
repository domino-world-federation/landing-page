<script setup lang="ts">
import { PILLARS, PILLARS_ALT } from "~/content/about/pillars"

/**
 * Seconds a pillar holds the focused slot before the column turns.
 *
 * It is the reading that sets this, and only the tail of it is a choice. The
 * sentence starts lighting the moment the block is handed the slot, so it runs
 * through the turn as well: about 3.6s of reading against a 1.15s turn leaves
 * roughly a second of stillness before the column moves again.
 *
 * That tail was 3.3s at `HOLD = 4.5` and read as the section having stalled —
 * the sentence had plainly finished and nothing happened for another beat and a
 * half. A second is a pause on the full stop rather than a wait. It has to be
 * re-derived whenever `WORD_STEP` moves, which is why the arithmetic is written
 * out here rather than left as a number that once felt right.
 */
const HOLD = 3.2

/**
 * Seconds set aside for one turn. Not the length of the turn — `TURN_EASE` is a
 * tween and this is the budget the column schedules against, so it has to
 * outlast the move: the interval must not fire while the track is still
 * travelling, and the lap rewind below has to land on a track that has stopped.
 */
const TURN = 1.5

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
const track = useTemplateRef<HTMLDivElement>("track")
const prefersReducedMotion = useReducedMotion()

// Only turn while the section is being looked at — an interval running against
// an off-screen element is battery spent on nothing.
const inView = useInView(track, { amount: 0.3 })

// Two laps, so the track always has a cell to bring in and one to carry off.
const cells = computed(() => [...PILLARS, ...PILLARS])
const lap = computed(() => PILLARS.length)

// `1` is the design's resting state: the second pillar is the one in the focused
// slot, which is the block Figma draws lit. Starting there means the server, the
// first client render and a reader who prefers reduced motion all get exactly
// the still design — without branching the tree, which RULES §12 forbids.
const index = ref(1)
const instant = ref(false)

const turning = computed(() => inView.value && !prefersReducedMotion.value)

watch(
  turning,
  (on, _was, onCleanup) => {
    if (!on) return

    const timer = setInterval(
      () => {
        index.value += 1
        instant.value = false
      },
      (HOLD + TURN) * 1000,
    )
    onCleanup(() => clearInterval(timer))
  },
  { immediate: true },
)

// A lap is over once the track has advanced by the length of the list. The
// rewind waits for the turn to land, then jumps with the transition collapsed:
// the second copy is showing the same three blocks at the same three offsets, so
// sampled at the seam nothing changes on screen.
watch(index, (value, _was, onCleanup) => {
  if (value <= lap.value) return

  const timer = setTimeout(() => {
    index.value = 1
    instant.value = true
  }, TURN * 1000)
  onCleanup(() => clearTimeout(timer))
})

// The seam rewind and a reader who prefers reduced motion both want the track to
// arrive having visibly travelled nothing. Same tree either way; only the
// transition is zeroed (RULES §12).
const still = computed(() => prefersReducedMotion.value || instant.value)

const trackTransition = computed(() => (still.value ? { duration: 0 } : TURN_EASE))

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
  <!-- One screen, like the four sections around it — `566:13542` is 1920 × 1080.
       See `Heritage` for why the height is `dvh` and not the design's ratio.

       **`h-dvh` from `lg`, not `snap-screen`.** The column is three slots tall and
       the design lets it EXCEED the frame's content box: Figma's mask group is a
       full 1080 inside a frame padded 80, so it runs past the padding at both
       ends. A minimum height lets it push instead, which measured 1240 against a
       1080 screen — the section grew past the viewport and the snap no longer
       landed the column centred in it. A fixed height makes the column overflow
       and be clipped, which is what the design draws, and `overflow-hidden`
       keeps that off the section snapped after it. The clipping is invisible:
       the column's own mask has faded it to nothing by its edges.

       Below `lg` the column and the picture stack, and then the height has to
       come from them — hence `snap-screen` there. -->
  <section
    class="flex snap-screen flex-col items-center justify-center gap-12 overflow-hidden px-5 py-16 md:px-10 lg:h-dvh lg:min-h-0 lg:flex-row lg:justify-between lg:gap-16 lg:px-20 lg:py-[4.17vw]"
  >
    <!-- The mask is on the OUTER element and the movement on the inner one.
         Reversed, the window would travel with the blocks and never fade
         anything — the point is that one is fixed and the other is not.

         Three slots tall, which is both the design's 1080 (56.25vw at three
         360px slots) and what gives the focused block a neighbour to fade out
         above it and one to fade in below. -->
    <div
      ref="track"
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
            :duplicate="i >= lap"
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
  </section>
</template>
