<script setup lang="ts">
import { PILLARS, PILLARS_COPY } from "~/content/about/pillars"

/**
 * Pillars — Figma node `566:13542`. The three claims, taking turns.
 *
 * The section's whole idea is the mask. Figma wraps the blocks in a group
 * (`566:13543`) whose rectangle is transparent → white → white → transparent, so
 * the column fades out at both ends and only the middle is fully lit.
 *
 * **It used to be a marquee, then it stepped, and now it creeps.** The column
 * travelled continuously on a 30-second CSS loop, which meant every block was
 * always partly on its way somewhere — including the one being read. Stepping
 * fixed that but brought two faults of its own, both of which the repo owner
 * called out: the list was padded with a copy of the last claim so that the lit
 * slot always had a neighbour above it, which made the column look like it
 * opened on the SECOND block; and a full slot of travel per turn is a lot of
 * movement for a section whose only real event is a sentence lighting up.
 *
 * So the column opens on the first claim, at the top, where the list starts, and
 * each claim in turn RISES to the reading line with the next one revealed under
 * it — the reference's own arrangement, and the reason the reader can always see
 * what is coming.
 *
 * **The travel is measured, not stated.** The blocks are natural height with a
 * real gap between them, because the gap is the thing being asked for and a
 * fixed slot per block is what was squeezing it. That makes where each block
 * starts something only the browser knows, so it is read from the DOM — nothing
 * here restates a number that the type could change.
 *
 * **Each claim brings its own photograph**, cross-fading in place, and the bite
 * out of the picture's left edge slides down to meet the block being read.
 *
 * The turning itself lives in `useTurningColumn`, where its reasoning is written
 * out. Integrity's code of ethics is drawn as the same construction, which is
 * what moved it out of here (D32/D43).
 */
const track = useTemplateRef<HTMLElement>("track")
const stage = useTemplateRef<HTMLElement>("stage")
const viewport = useTemplateRef<HTMLDivElement>("viewport")
const column = useTemplateRef<HTMLDivElement>("column")

/**
 * `pad: false` — the pad is a copy of the last claim placed above the first, and
 * with the column opening at the top rather than centred it is simply the wrong
 * claim in the first position. See the composable.
 */
const { steps, cells, index, inView, trackTransition } = useTurningColumn(
  track,
  stage,
  PILLARS,
  { pad: false },
)

/**
 * Where each block starts, in pixels down the column, measured from the first.
 *
 * **The active block RISES to the reading line and the next one comes up under
 * it**, which is what the reference does and what the column was missing: it
 * used to creep by the small amount it overhung its window, so the same three
 * blocks sat in the same three places the whole way down and only the light
 * moved. Now the column is offset by exactly the active block's own position, so
 * the one being read climbs to the reading line and the one after it is revealed
 * below.
 *
 * Measured rather than stated because the blocks are their own height — the gap
 * between them is the design's, but what a claim comes to depends on how its
 * title wraps. Taken relative to the FIRST block so the figure is independent of
 * whatever the browser picked as the offset parent, which is not the same
 * element above and below `lg`.
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

  // Both boxes: the window is a share of the screen and the column is set in
  // clamped type, so a resize changes each of them independently.
  const observer = new ResizeObserver(measure)
  if (viewport.value) observer.observe(viewport.value)
  if (column.value) observer.observe(column.value)

  onBeforeUnmount(() => observer.disconnect())
})

/**
 * How many MOVES the column makes — one fewer than the claims, since three
 * claims are two steps between them.
 *
 * It is what the travel is divided by, not what the track is built from: the
 * track needs a viewport per claim so each one has somewhere to be read (see the
 * template), and the moves are what happen between those.
 */
const turns = computed(() => Math.max(1, steps.value - 1))

/**
 * The column's offset: the active block's own position, negated, so that block
 * arrives at the reading line.
 *
 * Zero for the first block, which is why the reading line is a PADDING on the
 * column rather than a number added here. Adding it would mean the column starts
 * shifted down by it, and since a transform is only written after mount that
 * would be a visible drop the first time the page settles — and on a phone,
 * where nothing moves the column at all, it would simply be wrong.
 */
const trackY = computed(() => `-${offsets.value[index.value] ?? 0}px`)

/** Where the bite stands — see `utils/notch`, which both sections read from. */
const notchY = computed(() => notchOffset(index.value, turns.value))

// The picture cross-fades rather than cutting: the two frames are the same size
// in the same place, so a cut would read as a glitch where a fade reads as one
// picture answering the words beside it.
const fade = computed(() => ({ duration: DURATION, ease: EASE }))
</script>

<template>
  <!-- **A track, one viewport per CLAIM, with the stage pinned inside it.** The
       scroll through this track is what advances the column, so the reader
       cannot reach the next section without having passed all three claims.

       Per claim and not per move, and the difference is a claim that never got
       read. A track `moves × 100dvh` tall has `moves` resting positions, and the
       progress at them is 0 and 1 — nothing in between, because the pinned
       travel is one screen and the first snap point is its start and the second
       its end. With three claims that skipped the middle one entirely: it was
       current only while a gesture was passing THROUGH it, which on a page that
       snaps is never. `claims` viewports give `claims` places to stand, at 0,
       ½ and 1, which is one apiece. -->

       `snap-pass` because the track is several screens tall, and a snap area
       taller than the screen is a band the reader may rest ANYWHERE inside
       rather than a position — `main.css` records the rule at length. The
       notches below are the stops instead.

       The track only exists from `lg`. Below it the column and the picture stack
       and the height has to come from them, and the page does not snap there at
       all — a multi-screen track with a pinned stage would be that many screens
       of nothing to scroll past. -->
  <section
    ref="track"
    :style="{ '--pillars-steps': steps }"
    class="snap-pass relative lg:h-[calc(var(--pillars-steps)*100dvh)] lg:motion-reduce:h-dvh"
  >
    <!-- One snap point per claim, so every claim has a place the reader can
         come to rest on and a gesture advances the column exactly once.
         Markers rather than content: absolutely positioned, so they add nothing
         to the track's layout, and the first sits at the track's head, which is
         what gives this section the stop its siblings carry on the section
         itself.

         Hidden under reduced motion and below `lg` for the same reason the track
         collapses there: they would otherwise stack several viewports of snap
         points inside a one-viewport track and spill into the section after. -->
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
         floored at `--nav-clearance`: this is where the scroll comes to rest, so
         its head lands under a navbar up to 112px tall, and 3.125vw is only 60
         at the design width. -->
    <div
      ref="stage"
      class="flex flex-col items-center justify-center gap-12 overflow-hidden px-5 pt-28 pb-[max(48px,3.125vw)] md:px-10 lg:sticky lg:top-0 lg:h-dvh lg:flex-row lg:justify-between lg:gap-16 lg:px-20 lg:pt-[max(var(--nav-clearance),3.125vw)]"
    >
      <!-- The mask is on the OUTER element and the movement on the inner one.
           Reversed, the window would travel with the blocks and never fade
           anything — the point is that one is fixed and the other is not.

           The window takes the height the stage has rather than stating one:
           what it shows is "as much of the column as fits", and the overhang
           measured against it is exactly what the scroll then travels. -->
      <div
        class="flex w-full flex-col gap-8 lg:h-full lg:w-[42.71%] lg:gap-[2.08vw]"
      >
        <!-- The counter sits above the column rather than beside a block: it
             counts the SECTION's steps, and one of it is what the reference
             draws. -->
        <AboutPillarCounter
          :value="index + 1"
          :total="steps"
          :label="PILLARS_COPY.counterLabel"
          class="shrink-0"
        />

        <div
          ref="viewport"
          class="column-mask relative w-full lg:min-h-0 lg:flex-1 lg:overflow-hidden"
        >
          <Motion
            as="div"
            class="lg:absolute lg:inset-x-0 lg:top-0"
            :animate="{ y: trackY }"
            :transition="trackTransition"
            :style="{ willChange: 'transform' }"
          >
            <!-- The gap IS the spacing between groupings. It was a fixed slot
                 per block with the block centred in it, which left whatever the
                 type did not use — about 40px once a title wrapped — and read as
                 three paragraphs run together. -->
            <!-- `24dvh` is the reading line — where the block being read comes
                 to rest. It is padding rather than an offset in the transform so
                 that the first block needs no transform at all (see `trackY`),
                 and it is roughly 30% of the window, which is where the mask
                 finishes fading in: a block landing any higher would have its
                 first line dimmed by the very fade meant to be below it. -->
            <div
              ref="column"
              class="flex flex-col gap-14 lg:gap-[clamp(56px,5.2vw,100px)] lg:pt-[24dvh]"
            >
              <!-- `reading` is gated on the column being on screen as well as on
                   the block being current, so the first sentence is read when
                   the reader ARRIVES rather than while the section is still
                   below the fold. `focused` is not: it decides the block's
                   opacity, and the design's resting state has one block already
                   lit. -->
              <AboutPillarBlock
                v-for="(pillar, i) in cells"
                :key="pillar.id"
                :pillar="pillar"
                :duplicate="false"
                :focused="i === index"
                :reading="i === index && inView"
              />
            </div>
          </Motion>
        </div>
      </div>

      <!-- 760 × 960 in Figma — a portrait frame, not the photographs' own 3:2,
           so they are `object-cover` and the crop is deliberate. 39.58vw is
           760/1920. The frame does not move: what changes inside it is which
           picture is showing and where the bite sits.

           NOT `overflow-hidden`, which is what it used to be: the notch hangs on
           the frame's own left edge and clipping would take half of it. The
           rounded corners come from the images instead, which are the only
           things inside that need them. -->
      <div
        class="relative aspect-[3/4] w-full lg:aspect-auto lg:h-[50vw] lg:max-h-[960px] lg:w-[39.58%]"
      >
        <Motion
          v-for="(pillar, i) in cells"
          :key="pillar.id"
          as="div"
          class="absolute inset-0"
          :initial="{ opacity: i === 0 ? 1 : 0 }"
          :animate="{ opacity: i === index ? 1 : 0, transition: fade }"
          :style="{ willChange: 'opacity' }"
        >
          <!-- Only the claim being read has its picture announced; the other two
               are the same frame waiting its turn, and a screen reader given all
               three would hear a gallery where the page shows one. -->
          <NuxtImg
            :src="pillar.imageUrl"
            :alt="i === index ? pillar.imageAlt : ''"
            :aria-hidden="i === index ? undefined : 'true'"
            :sizes="imageSizes({ xs: '100vw', lg: '40vw' })"
            :quality="85"
            class="absolute inset-0 size-full rounded-[20px] object-cover"
          />
        </Motion>

        <!-- The bite out of the picture's left edge — `566:13563`, a 48 × 361
             shape at `y:91` filled `#0E0E0E`. It is not a cut-out: it is the
             page background drawn ON TOP of the photograph, which is why the
             fill is a literal colour rather than a mask. That also means it only
             reads correctly over `--color-bg`, which is what this section stands
             on.

             Placed as fractions of Figma's 760 × 960 frame — 6.32% wide, 37.6%
             tall — so it holds its place as the frame scales, and moved on `y`
             so it can travel to meet the block being read without laying
             anything out. It rests at the top now rather than Figma's 9.48%;
             `utils/notch` has the three stops. Decorative: it is an edge
             treatment and says nothing (RULES §12). -->
        <Motion
          as="img"
          src="/assets/global/decor-notch.svg"
          alt=""
          aria-hidden="true"
          width="48"
          height="361"
          class="pointer-events-none absolute top-[2.5%] left-0 z-10 h-[37.6%] w-[6.32%]"
          :animate="{ y: notchY }"
          :transition="trackTransition"
          :style="{ willChange: 'transform' }"
        />
      </div>
    </div>
  </section>
</template>
