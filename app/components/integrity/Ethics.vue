<script setup lang="ts">
import { INTEGRITY_COPY } from "~/content/integrity"
import { ETHICS_CLAUSES } from "~/content/integrity/ethics"

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
 * pillars' does not, so the window has a heading's worth less of the screen to
 * spend and its reading line sits shallower. The blocks are numbers rather than
 * titles, and the resting strength is the 0.4 this frame draws rather than the
 * pillars' 0.5. Everything else is deliberately the same construction: the
 * clause being read rises to the reading line, the next comes up under it, and
 * the bite in the picture's edge moves to stand beside it.
 *
 * **It is a track, not a screen.** One viewport per clause with the stage pinned
 * inside, so reaching the technical section means having scrolled past all three
 * — the same reason the pillars stopped turning themselves, and the same reason
 * this page snaps at all.
 */
const COPY = INTEGRITY_COPY

const track = useTemplateRef<HTMLElement>("track")
const stage = useTemplateRef<HTMLElement>("stage")
const viewport = useTemplateRef<HTMLDivElement>("viewport")
const column = useTemplateRef<HTMLDivElement>("column")

/**
 * `pad: false` — the clauses are NUMBERED, and the padding the pillars want puts
 * a copy of the last block above the first. Here that drew `03` above `01`: a
 * list out of order, which is the one thing a numbered list may not be.
 */
const { steps, cells, index, scrolled, readingProgress, isPad } =
  useTurningColumn(track, stage, ETHICS_CLAUSES, { pad: false })

/**
 * Where each clause starts, in pixels down the column, measured from the first.
 *
 * **The clause being read RISES to the reading line and the next comes up under
 * it** — the arrangement About's pillars take from the reference, and the reason
 * the reader can always see what is coming. This section used to creep by the
 * 146px it overhung a window sized in fixed slots, so all three clauses sat in
 * the same three places the whole way down and only the light moved.
 *
 * Measured rather than stated: the clauses are their own height now, and what
 * one comes to depends on how its sentence wraps. Taken relative to the FIRST so
 * the figure does not depend on which element the browser picked as the offset
 * parent, which is not the same above and below `lg`.
 */
const offsets = ref<number[]>([])

onMounted(() => {
  function measure() {
    const inner = column.value
    if (!inner) return

    const blocks = Array.from(inner.children) as HTMLElement[]
    const first = blocks[0]?.offsetTop ?? 0

    offsets.value = blocks.map((block) => block.offsetTop - first)
  }

  measure()

  // Both boxes: the window is a share of the screen and the clauses are set in
  // clamped type, so a resize changes each of them independently.
  const observer = new ResizeObserver(measure)
  if (viewport.value) observer.observe(viewport.value)
  if (column.value) observer.observe(column.value)

  onBeforeUnmount(() => observer.disconnect())
})

/**
 * The column's offset: the active clause's own position, negated.
 *
 * Zero for the first clause, which is why the reading line is a PADDING on the
 * column rather than a term here — a transform is only written after mount, so
 * folding the line into it would drop the column visibly the first time the page
 * settles, and on a phone, where nothing moves the column, it would be wrong.
 */
const trackY = computed(
  () => `-${scrolled.value * (offsets.value[offsets.value.length - 1] ?? 0)}px`,
)

/**
 * Where the bite stands — the same fraction the column travels on, so the marker
 * keeps pace with the list instead of arriving after it (`utils/notch`).
 */
const notchY = computed(() => notchOffset(scrolled.value))

/**
 * No transition at all for anything the scroll drives.
 *
 * The wheel is the animation; an easing on top of it is a second animation
 * chasing the first, which shows up as the column and the notch lagging behind
 * the words they belong to.
 */
const SCROLLED = { duration: 0 } as const

// The pictures cross-fade rather than cutting: the frames are the same size in
// the same place, so a cut would read as a glitch where a fade reads as one
// picture answering the words beside it.
const fade = computed(() => ({ duration: DURATION, ease: EASE }))
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
    :style="{ '--ethics-steps': steps, '--column-fade': '12%' }"
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
          ref="viewport"
          class="column-mask relative w-full lg:min-h-0 lg:flex-1 lg:overflow-hidden"
        >
          <Motion
            as="div"
            class="lg:absolute lg:inset-x-0 lg:top-0"
            :animate="{ y: trackY }"
            :transition="SCROLLED"
            :style="{ willChange: 'transform' }"
          >
            <!-- Each cell is one slot tall with its block centred in it: that is
                 what makes a single fixed translation land every block in the
                 same place, whichever of the three it is. -->
            <!-- `4dvh` is where the FIRST clause starts, not a mark the others
                 come to rest on: the column travels continuously against the
                 scroll, so each clause drifts up the window as it is read. It is
                 padding rather than a term in the transform so the top of the
                 track needs no transform at all (see `trackY`).

                 Shallower than the pillars' 24dvh because this section spends a
                 heading's worth of screen above its window, and at 21dvh the
                 third clause fell clean out of the bottom of it. The mask's fade
                 comes down to 12% with it: at 30% a clause resting this high
                 would have its number dimmed by the very fade meant to be below
                 it. -->
            <div
              ref="column"
              class="flex flex-col gap-12 lg:gap-[clamp(56px,5.2vw,100px)] lg:pt-[4dvh]"
            >
              <div
                v-for="(clause, i) in cells"
                :key="`${clause.id}-${i}`"
                class="flex flex-col justify-center"
              >
                <!-- `progress` rather than a start signal: the sentence is lit
                     by the scroll, so it needs no on-screen gate — at the top of
                     the track the progress is zero, and a clause below the fold
                     is simply unread. `focused` still decides the block's
                     opacity, and the design's resting state has one clause
                     already lit. -->
                <IntegrityEthicsClause
                  :clause="clause"
                  :duplicate="isPad(i)"
                  :focused="i === index"
                  :progress="readingProgress(i)"
                />
              </div>
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
        <!-- The picture answers the clause: each one brings its own and they
             cross-fade in place rather than cutting, because the frame does not
             move and a cut in a frame that has not moved reads as a glitch. -->
        <Motion
          v-for="(clause, i) in cells"
          :key="clause.id"
          as="div"
          class="absolute inset-0"
          :initial="{ opacity: i === 0 ? 1 : 0 }"
          :animate="{ opacity: i === index ? 1 : 0, transition: fade }"
          :style="{ willChange: 'opacity' }"
        >
          <!-- Only the clause being read has its picture announced; the others
               are the same frame waiting their turn, and a screen reader given
               all three would hear a gallery where the page shows one. -->
          <NuxtImg
            :src="clause.imageUrl"
            :alt="i === index ? clause.imageAlt : ''"
            :aria-hidden="i === index ? undefined : 'true'"
            :sizes="imageSizes({ xs: '100vw', lg: '40vw' })"
            :quality="85"
            class="absolute inset-0 size-full rounded-[20px] object-cover"
          />
        </Motion>

        <!-- The bite out of the picture's left edge — `762:1340`, a 48 x 361
             shape at `y:70` filled `#0E0E0E`. It is not a cut-out: it is the
             page background drawn ON TOP of the photograph, which is why the
             fill is a literal colour rather than a mask. That also means it only
             reads correctly over `--color-bg`, which is what this section stands
             on.

             Placed as fractions of Figma's 760 x 960 frame — 6.32% wide, 37.6%
             tall — so it holds its place as the frame scales, and moved on `y`
             so it can travel to meet the clause being read without laying
             anything out. Figma's fixed 7.29% is given up for the three stops in
             `utils/notch`: a marker that never moves cannot say which clause is
             current, which is the job it has here. Decorative (RULES §12). -->
        <Motion
          as="img"
          src="/assets/global/decor-notch.svg"
          alt=""
          aria-hidden="true"
          width="48"
          height="361"
          class="pointer-events-none absolute top-[2.5%] left-0 z-10 h-[37.6%] w-[6.32%]"
          :animate="{ y: notchY }"
          :transition="SCROLLED"
          :style="{ willChange: 'transform' }"
        />
      </div>
    </div>
  </section>
</template>
