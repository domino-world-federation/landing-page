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
 * So the column opens on the first claim, where the list starts, and travels
 * CONTINUOUSLY against the scroll — each claim drifting up the window as it is
 * read, with the next one revealed under it and the notch beside the picture
 * keeping pace. That last part is what a notch in three fixed places could not
 * do: a marker that jumps between stops points at where the list was a moment
 * ago rather than where it is.
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
const { screens, cells, index, readingProgress, travel, scrolled } =
  useTurningColumn(track, stage, PILLARS, {
    pad: false,
    viewport,
    column,
  })

/**
 * Where the bite stands — its whole travel spent across the section, top to
 * foot, so the first block has it at the top and the last at the bottom.
 *
 * It briefly followed the block being read instead. That put it wherever the
 * reading line is, which is one place near the middle, and it barely moved: the
 * marker lost both its ends and the section lost its parallax. The bite and the
 * words are supposed to travel AGAINST each other — the column climbing while
 * the marker descends — and that only happens when the marker is a measure of
 * the section rather than a mirror of the column.
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

// The picture cross-fades rather than cutting: the two frames are the same size
// in the same place, so a cut would read as a glitch where a fade reads as one
// picture answering the words beside it.
const fade = computed(() => ({ duration: DURATION, ease: EASE }))
</script>

<template>
  <!-- **A track, a screen per claim plus one, with the stage pinned inside it.**
       The scroll through it is what advances the column, so the reader cannot
       reach the next section without having passed all three claims.

       The extra screen is the last claim's own reading. A track of `n` screens
       has `n` snap positions and `n − 1` screens of travel between them, so with
       a screen per claim the last one arrives exactly as the scroll runs out and
       is never read at all — which is the fault this pays for.

       `snap-pass` because the track is several screens tall, and a snap area
       taller than the screen is a band the reader may rest ANYWHERE inside
       rather than a position — `main.css` records the rule at length. The
       notches below are the stops instead, one per screen, so every claim has a
       place to be arrived at and read.

       The track only exists from `lg`. Below it the column and the picture stack
       and the height has to come from them, and the page does not snap there at
       all — a multi-screen track with a pinned stage would be that many screens
       of nothing to scroll past. -->
  <section
    ref="track"
    :style="{ '--pillars-steps': screens, '--column-fade': '12%' }"
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
        v-for="notch in screens"
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
          :total="cells.length"
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
            :animate="{ y: travel }"
            :transition="SCROLLED"
            :style="{ willChange: 'transform' }"
          >
            <!-- The gap IS the spacing between groupings, and it is deep on
                 purpose: 160 at the design width. It began as whatever a fixed
                 slot left over — about 40px once a title wrapped, which read as
                 three paragraphs run together — and has been opened twice since,
                 the second time because a block arriving into the window still
                 had the last one's foot under it. -->
            <!-- `12dvh` is the reading line: near the top of the window, which
                 is where the claim being read belongs — the notch beside it
                 starts at the top too, and the pair only reads as a pair if both
                 begin at the same end. It was 24dvh, which sat the words halfway
                 down and left the marker looking like it pointed at nothing.

                 Padding rather than a term in the transform so the top of the
                 track needs no transform at all (see the composable's `travel`),
                 and the mask's fade comes down to 12% with it — at 30% a claim
                 resting this high would be dimmed by the very fade meant to be
                 below it. -->
            <div
              ref="column"
              class="flex flex-col gap-16 lg:gap-[clamp(88px,8.33vw,160px)] lg:pt-[12dvh]"
            >
              <!-- `progress` rather than a start signal: the sentence is lit by
                   the scroll, so it needs no on-screen gate — at the top of the
                   track the progress is zero, and a block below the fold is
                   simply unread. `focused` still decides the block's opacity,
                   and the design's resting state has one block already lit. -->
              <AboutPillarBlock
                v-for="(pillar, i) in cells"
                :key="pillar.id"
                :pillar="pillar"
                :duplicate="false"
                :focused="i === index"
                :progress="readingProgress(i)"
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
          :transition="SCROLLED"
          :style="{ willChange: 'transform' }"
        />
      </div>
    </div>
  </section>
</template>
