<script setup lang="ts">
import type { FederationStat } from "~/lib/api/types"

/**
 * The turn itself — a detent, not a glide.
 *
 * The wheel used to cross its slot on the page's easing curve, which is shaped
 * to be *followed*: it leaves at once and lands softly, so the eye reads one
 * continuous move. That is the opposite of a picker wheel, where the point is
 * that the track is caught and held at every notch.
 *
 * A spring is what makes the catch. `visualDuration` is when the track arrives;
 * `bounce` is what happens after. At 0.18s the travel is over almost before it
 * registers as travel, and the bounce puts a single overshoot of roughly 5% of a
 * slot on the end — the track goes a hair past the notch and is pulled back into
 * it. That recoil is the whole effect; without it the move is merely fast, and
 * fast alone still reads as sliding.
 *
 * It survives the move off the timer unchanged, and that is the point: the
 * reader now supplies the *when*, but the *how* is still the design's. A spring
 * is also what keeps the notch honest under a fast flick — the index jumps
 * whole numbers, so the track always plays the detent rather than being dragged
 * continuously by the scroll.
 */
const SNAP = { type: "spring", visualDuration: 0.18, bounce: 0.3 } as const

/**
 * The cross-fade between a stat's focused and idle copies.
 *
 * Left a plain tween, and deliberately not `SNAP`. A spring overshoots, and
 * these are `opacity` and `scale`: an opacity that overshoots is clipped at 1 and
 * reads as a flicker, and a figure that springs its own scale wobbles
 * independently of the track carrying it. Shorter than the snap, so the gold has
 * already handed over by the time the track settles — the colour change is what
 * tells you which notch you are on, and it should not trail the notch.
 */
const FADE = { duration: 0.16, ease: "easeOut" } as const

/**
 * The slot a stat occupies, relative to the focused one. Anything further out
 * than a single step is off the wheel and stays invisible.
 */
const FOCUSED = 0
const NEIGHBOUR = 1

/** The design's resting opacity for the two stats flanking the focused one. */
const DIM = 0.2

/**
 * Pixels between the centres of two dots on the indicator rail — the design's
 * 24px dot box plus its 32px gap (`702:1487`).
 *
 * Written as a number because the rail's resting offset is arithmetic on it, and
 * kept in px rather than on a `vw` slope: the rail is a 24px column of markers
 * beside figures that are already 200px tall, so scaling it would only make the
 * thing that is meant to be read at a glance harder to see on a small window.
 */
const DOT_STEP = 56

/** 175/200 — the design shrinks the off-centre figures by this much. */
const NEIGHBOUR_SCALE = 0.875

/**
 * The stats wheel — figures taking turns in a fixed focused slot, turned by the
 * reader's own scroll.
 *
 * The design (`37:1874`) is a picker wheel: two rules bracket a centre slot, the
 * stat inside it is gold, full size and sharp, and the ones above and below are
 * dim, blurred and slightly smaller. So the frame is what stays put and the
 * content is what moves — each stat rides up through the focused slot in turn.
 *
 * **The wheel used to turn itself.** A `setInterval` advanced it every 1.7s
 * while the section was in view, and it looped forever. That was replaced by
 * scroll: the section is a track one viewport tall per stat, the wheel is
 * `sticky` inside it, and the scroll through the track is what advances the
 * index. The reader now decides the pace, and a figure cannot go past
 * unlooked-at while they are reading something else — which is the whole reason
 * the timer went. There is no lap and no rewind: the wheel opens on the first
 * stat, stops on the last, and the section releases to S6.
 *
 * A rail of dots runs beside it (`702:1487`), one per stat, marking which figure
 * is up and how many are left — the count a three-slot window cannot show.
 *
 * **How the track is measured.** One viewport of scroll per stat, so `steps`
 * viewports of height with a `100dvh` sticky stage inside. That leaves
 * `steps - 1` viewports of travel while the stage is pinned, which is exactly
 * the number of turns the wheel has to make. `useScroll`'s `start start` →
 * `end end` range spans precisely that travel: it opens when the track's head
 * reaches the top of the screen (where the stage pins) and closes when its foot
 * reaches the bottom (where the stage releases). Progress is therefore
 * `notch / (steps - 1)`, and rounding it is what turns a continuous scroll back
 * into whole notches for `SNAP` to spring between.
 *
 * Each notch also carries a scroll-snap point of its own (the markers in the
 * template), so a wheel gesture advances the wheel by one stat and no more —
 * the same rule the page's sections follow, applied inside a section.
 *
 * **Why the list is padded at both ends.** The focused slot has a neighbour above
 * it and below it, so the cells at `index - 1` and `index + 1` must both exist.
 * On a bare list the first stat has nothing above it and the last has nothing
 * below, and the wheel would open and close against an empty slot. A copy of the
 * last stat before the list and a copy of the first after it fills both. See
 * `cells` for why this replaced two full laps — the laps forced the wheel to
 * open on the second stat, which is not the order the list is written in.
 *
 * **Why the offset is a percentage.** Each cell is exactly one slot tall, so
 * translating the track by `100 / cells` percent of its own height moves it by
 * precisely one slot — at any viewport, without measuring anything. Animating a
 * `calc()` of a CSS variable would not interpolate; a measured pixel value would
 * need a layout read on every resize.
 *
 * The design treats the slot above and the slot below differently — the lower
 * figure is blurred and smaller, the upper one is neither. That asymmetry reads
 * as depth in a still frame, but it does not survive rotation: every stat passes
 * through both slots, so it would blur on the way in and not on the way out.
 * Both neighbours are given the lower slot's treatment, which is the one that
 * carries the design's sense of the wheel curving away.
 *
 * Blur is NOT animated (RULES §12). Each cell renders a sharp gold copy and a
 * blurred white one, and only their `opacity` cross-fades — the same trick
 * `SofteningImage` and `Reveal` use.
 *
 * The wheel is `aria-hidden`: it is one figure repeated through a slot, and a
 * screen reader walking a three-viewport track to hear three numbers is being
 * charged for a visual effect. The section renders a plain list alongside for
 * that (see `Stats`).
 */
const props = defineProps<{ stats: FederationStat[] }>()

const track = useTemplateRef<HTMLDivElement>("track")
const prefersReducedMotion = useReducedMotion()

/**
 * The list with one stat padded onto each end — the last before it, the first
 * after it — so every notch has a real figure in the slot above and the slot
 * below it.
 *
 * **This is what lets the wheel open on the FIRST stat.** The focused cell needs
 * a neighbour above, and a bare list has nothing above its head, so the wheel
 * used to start one step in and show `stats[1]` first: Continents was written at
 * the top of the list and the reader met it last. It ran two full laps to keep
 * the slots filled, and the price was a wrap — the final notch landed back on
 * `stats[0]`, which sent the rail's gold dot from the bottom of the column to
 * the top in one step.
 *
 * A pad of one at each end costs `n + 2` cells instead of `2n`, fills every slot
 * at every notch, and leaves the notches running straight down the list with
 * nothing to wrap. The figure above the opening one is the last in the list,
 * which is what a picker wheel shows anyway.
 */
const cells = computed(() => {
  const list = props.stats
  if (list.length === 0) return []
  return [list[list.length - 1]!, ...list, list[0]!]
})

/** One notch per stat, and therefore one viewport of track per stat. */
const steps = computed(() => props.stats.length)

// `1` is the first real stat: cell 0 is the pad. Server, first client render and
// a reader who prefers reduced motion all start here — one constant, no branch
// in the tree, which is what RULES §12 forbids.
//
// Figma draws this wheel with the SECOND stat focused (`Continents` above
// `National Federation` above `Regional`). That frame is not the resting state,
// it is notch 1 — and it renders exactly as drawn when the reader reaches it.
const index = ref(1)

// Scoped to the track, not the page: the range has to be this section's own
// travel or the notches land somewhere other than the snap points (RULES §12).
const { scrollYProgress } = useScroll({
  target: track,
  offset: ["start start", "end end"],
})

useMotionValueEvent(scrollYProgress, "change", (progress: number) => {
  // `steps - 1` turns for `steps` notches. A single stat has no turn to make,
  // and under `prefers-reduced-motion` the track is collapsed to one viewport
  // (see the template) so the range has no length and progress never leaves 0 —
  // which is how the preference stops the wheel without a branch in the tree.
  const turns = steps.value - 1
  if (turns < 1 || !Number.isFinite(progress)) return

  const notch = Math.min(Math.max(Math.round(progress * turns), 0), turns)
  index.value = notch + 1
})

// Same tree whatever the preference; only the transition is zeroed (RULES §12).
// `duration: 0` still lands the track on its notch — motion starts animations in
// a layout effect, so the value is final before the browser paints.
const trackTransition = computed(() =>
  prefersReducedMotion.value ? { duration: 0 } : SNAP,
)
const fadeTransition = computed(() =>
  prefersReducedMotion.value ? { duration: 0 } : FADE,
)

// `1 - index`, not `-index`: the focused stat belongs in the *middle* of the
// three slots, so the track sits one slot lower than a plain top-aligned offset
// would put it.
const trackY = computed(
  () => `${((1 - index.value) * 100) / cells.value.length}%`,
)

function distanceFrom(i: number) {
  return Math.abs(i - index.value)
}

/**
 * Which stat the rail marks. Cell 1 is `stats[0]`, so the offset is the pad and
 * nothing more — the gold walks straight down the column, one dot per notch,
 * with no wrap to jump.
 */
const activeIndex = computed(() => index.value - 1)

/**
 * Where the rail sits relative to its own centre, in pixels — **the offset that
 * keeps the gold dot on the focused line**.
 *
 * The window is three slots tall and the focused one is the middle, so the row's
 * centre IS the focused line. Figma pairs the two explicitly: 60px of padding
 * above a centred column, which works out to putting the SECOND dot on that line
 * (measured: dot centre 302 against the label's 300) — and the second dot is the
 * one the design draws gold. So the pairing is the rule, not the padding, which
 * only produces it for the one frame and the one count Figma drew.
 *
 * The rail therefore rides with the wheel rather than standing still: one step
 * per notch, on the wheel's own detent, so the marker and the figure it marks
 * arrive together. That was not available while the wheel wrapped — the final
 * notch used to send the active stat from the bottom of the list back to the
 * top, and a rail chasing it would have crossed its whole length in one step.
 * Padding the cells instead of lapping them removed the wrap, and this followed.
 */
const railY = computed(
  () => ((steps.value - 1) / 2 - activeIndex.value) * DOT_STEP,
)
</script>

<template>
  <!-- The scroll track: one viewport per stat. `--stats-steps` carries the count
       into CSS because the height is a `calc()` and the count comes from data —
       it is written by the server and re-read identically on the client, so it
       is not a branch.

       `motion-reduce:h-dvh` collapses the track to a single viewport, and it is
       a media query rather than a `useReducedMotion()` branch on purpose
       (RULES §12): the two render different trees and Vue would hydrate one onto
       the other. Collapsed, the `start start` → `end end` range has no length,
       progress stays at 0, and the wheel simply holds the design's resting notch
       — the still frame, with no scroll-linked movement anywhere in it. -->
  <div
    ref="track"
    aria-hidden="true"
    :style="{ '--stats-steps': steps }"
    class="relative h-[calc(var(--stats-steps)*100dvh)] motion-reduce:h-dvh"
  >
    <!-- One snap point per notch, so a gesture turns the wheel exactly once —
         the page's own rule (`scroll-snap-stop: always`) applied inside a
         section. They are markers rather than content: absolutely positioned, so
         they add nothing to the track's layout, and the first sits at the
         track's head, which is what gives S5 the section-level snap point its
         siblings carry on the `<section>` itself.

         Hidden under reduced motion for the same reason the track collapses:
         they would otherwise stack `steps` viewports of snap points inside a
         one-viewport track and spill into S6. Snapping is off entirely there
         anyway (see `main.css`), so nothing is lost. -->
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-full motion-reduce:hidden"
    >
      <div
        v-for="notch in steps"
        :key="notch"
        class="h-dvh snap-start snap-always"
      />
    </div>

    <!-- The stage. It pins at the top of the screen for the whole track and is
         released by the track's last viewport, so the wheel is what stays put
         while the scroll runs past it — the same figure/ground split the design
         draws, with the frame fixed and the content moving. -->
    <div class="sticky top-0 flex h-dvh items-center px-5 md:px-10 lg:px-20">
      <!-- `702:1497`: the rail and the wheel are one row, 36px apart. -->
      <div class="flex w-full items-center gap-9">
        <!-- The indicator rail (`702:1487`) — one dot per stat, the current one
             gold and full size, the rest white at 12% and two thirds the width.
             It tells the reader how many figures the section holds and how far
             through them they are, which a wheel showing three slots cannot.

             Two circles per dot rather than one that resizes: the sizes are the
             design's 24 and 16, and animating a width would lay out on every
             frame where cross-fading two fixed circles composites. It is the
             same trade `StatRow` makes for its gold and its blur, on the same
             `fadeTransition`, so the dot hands over at the moment the figure
             does.

             The column itself moves on the wheel's spring so the gold stays on
             the focused line — see `railY`. Two transitions, and deliberately:
             the travel is a detent like the wheel's, the hand-over is a fade
             like the figures', and each is the one its own job asks for.

             Dropped below `md`. It is 24px of marker plus a 36px gap against a
             row that is already a long label facing a 200px figure; on a phone
             it would take a sixth of the width to say something the scroll
             already tells you. -->
        <Motion
          as="div"
          class="hidden w-6 shrink-0 flex-col items-center gap-8 md:flex"
          :initial="false"
          :animate="{ y: railY }"
          :transition="trackTransition"
        >
          <span
            v-for="(stat, i) in stats"
            :key="stat.id"
            class="relative flex size-6 items-center justify-center"
          >
            <Motion
              as="span"
              class="absolute size-4 rounded-full bg-white/12"
              :initial="false"
              :animate="{ opacity: i === activeIndex ? 0 : 1 }"
              :transition="fadeTransition"
            />
            <Motion
              as="span"
              class="absolute size-6 rounded-full bg-[image:var(--gradient-gold-tile)]"
              :initial="false"
              :animate="{ opacity: i === activeIndex ? 1 : 0 }"
              :transition="fadeTransition"
            />
          </span>
        </Motion>

        <!-- Three slots tall, so the focused one has a neighbour visible above
             and below. `overflow-hidden` is what makes it a window onto the
             track. -->
          <div
            class="relative h-[calc(var(--stat-slot)*3)] min-w-0 flex-1 overflow-hidden"
          >
          <Motion
            as="div"
            class="absolute inset-x-0 top-0"
            :animate="{ y: trackY }"
            :transition="trackTransition"
            :style="{ willChange: 'transform' }"
          >
            <!-- Cells are positional, and the list repeats — the content's own id
                 is not unique across the track, so it cannot be the key. -->
            <div
              v-for="(stat, i) in cells"
              :key="`${stat.id}-${i}`"
              class="relative h-[var(--stat-slot)]"
            >
              <!-- Both copies fill the same cell, so they register exactly and the
                   cross-fade happens in place. The cell's height is fixed by
                   `--stat-slot`, so neither copy can shift the track. -->
              <HomeStatRow
                :stat="stat"
                :visible="distanceFrom(i) === FOCUSED ? 1 : 0"
                :scale="1"
                :transition="fadeTransition"
                tone="focus"
              />
              <HomeStatRow
                :stat="stat"
                :visible="distanceFrom(i) === NEIGHBOUR ? DIM : 0"
                :scale="NEIGHBOUR_SCALE"
                :transition="fadeTransition"
                tone="idle"
              />
            </div>
          </Motion>

          <!-- The two rules that bracket the focused slot. They belong to the
               frame, not to the track, so they do not move — that is what makes
               the wheel read as a selector rather than a list sliding past.

               Figma draws four, but the outer pair is at `opacity: 0` — a spacing
               artefact of the stacked layout rather than something that renders.

               Node `47:2654`: 591 × 8, a left-to-right fade to white at 40%.
               Right-aligned, because the figures it separates are. -->
          <div
            class="absolute right-0 top-[var(--stat-slot)] h-[clamp(2px,0.42vw,8px)] w-[30.8vw] max-w-[591px] -translate-y-1/2 bg-linear-to-r from-transparent to-white opacity-40"
          />
          <div
            class="absolute right-0 top-[calc(var(--stat-slot)*2)] h-[clamp(2px,0.42vw,8px)] w-[30.8vw] max-w-[591px] -translate-y-1/2 bg-linear-to-r from-transparent to-white opacity-40"
          />
          </div>
      </div>
    </div>
  </div>
</template>
