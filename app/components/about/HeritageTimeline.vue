<script setup lang="ts">
import type { MotionValue } from "motion-v"
import type { HeritageMilestone } from "~/lib/api/types"
import { HERITAGE_COPY } from "~/content/about/heritage"

/**
 * How fast the dashed rules travel against the cards, as a fraction of their
 * speed.
 *
 * The rules used to be nailed down while the strip moved over them, on the
 * argument that a backdrop keeping pace with the cards cancels the only cue that
 * anything moved. That is true at 1. It is not true at 0.35: a ground that
 * drifts a third as far still falls behind the cards by two thirds of every
 * step, so the parallax reads as depth rather than as the cards standing still
 * — which is what the repo owner asked for.
 */
const RULES_RATE = 0.35

/**
 * The travelling half of Heritage — Figma node `88:1167`.
 *
 * The design does not fit and is not meant to: Figma places the four cards at
 * x 350, 1010, 1670 and 2330 on a 1920 frame, so the last one ends 890px past
 * the right edge. That overhang is the section's whole idea — the timeline is
 * longer than the window.
 *
 * **Three versions were built before this one, and all three failed the same
 * way: nothing the reader did moved the strip.** A continuous CSS marquee was
 * too smooth — an even, unbroken drift reads as decoration, and cards slid out
 * from under a sentence being read. Arrow buttons fixed the pacing but made the
 * section inert. A self-advancing step ran on a timer, and a timer does not know
 * whether anyone is reading: a slow reader lost the sentence mid-way, a fast one
 * waited.
 *
 * **So the page's own scroll drives it.** The section is a track several screens
 * tall with the stage pinned inside it, and the vertical scroll through that
 * track is spent as horizontal travel along this strip — the construction the
 * pillars column and the stats wheel already use, laid on its side. The reader
 * sets the pace, every date is passed on the way through, and there is nothing
 * to catch up with.
 *
 * It still runs on native `overflow-x` scrolling rather than a transform, so
 * keyboard, trackpad, touch and momentum all arrive already correct; the
 * progress simply writes the same `scrollLeft` those would. Below `lg` no track
 * exists and nothing writes it, which leaves the strip a plain scroller the
 * reader pans by hand.
 */
const props = defineProps<{
  milestones: HeritageMilestone[]
  /** The scroll through the section's track — 0 at its head, 1 at its foot. */
  progress: MotionValue<number>
}>()

const scroller = useTemplateRef<HTMLDivElement>("scroller")

/** How far the rules have fallen behind the cards, in pixels. */
const rulesOffset = ref(0)

useMotionValueEvent(props.progress, "change", (value: number) => {
  const el = scroller.value
  if (!el || !Number.isFinite(value)) return

  const max = el.scrollWidth - el.clientWidth
  // Nothing overflows — a narrow list, or a window wide enough to hold it. There
  // is no strip to travel, so there is nothing to spend the scroll on.
  if (max <= 1) return

  const travelled = Math.min(Math.max(value, 0), 1) * max

  el.scrollLeft = travelled
  rulesOffset.value = -travelled * RULES_RATE
})

// Mouse drag-to-pan. Shared with the board carousel — see the composable. It is
// what the strip answers to below `lg`, where nothing is driving it, and it
// stays available above: a drag holds until the next vertical scroll writes the
// position again, which is a correction rather than a fight.
const dragHandlers = useDragToPan(scroller)

// The strip has no edges of its own: it fades into the band at both sides so
// cards arrive and leave rather than being clipped. A gradient overlay would
// need to know the band's colour, which changes down the section — a mask does
// not.
const EDGE_MASK =
  "linear-gradient(90deg, transparent 0%, #000 4%, #000 96%, transparent 100%)"

/**
 * How far a card's whole column drops, by parity — Figma's own y 240 and 340,
 * measured down from the marker row.
 *
 * Declared here rather than on the card because the card also has to give the
 * height back: every column is `100% - DROP_MAX` tall, so the two parities keep
 * the same card size and differ only in where they hang. Two numbers in one
 * place beats the same two written three times.
 *
 * `min(..., dvh)` is the guard the width-based clamps do not have. `13.54vw` is
 * 260px on any 1920-wide window, including one 800px tall — where a 260px drop
 * would leave the card 200px of the screen to live in. The viewport-height term
 * takes over exactly when the window is too short to afford the design's offset.
 */
const DROP_STYLE = {
  "--heritage-drop-min": "min(clamp(32px,8.33vw,160px),14dvh)",
  "--heritage-drop-max": "min(clamp(32px,13.54vw,260px),22dvh)",
} as const

/**
 * The dashed rules behind the cards — Figma `88:1169` and its ten siblings.
 *
 * Drawn rather than downloaded: it is eleven copies of one 2px dashed line at a
 * fixed 220px pitch, which is a repeating background, and an SVG of it would be
 * a file to fetch for something CSS already states in three declarations.
 *
 * Two masks, intersected. The first chops each line into Figma's 8-on/4-off
 * dashes; the second is its stroke gradient, opaque for the top 80% and gone by
 * the foot, so the rules dissolve into the band rather than stopping on a line.
 *
 * It sits outside the scroller and is moved by hand, at `RULES_RATE` of the
 * cards' own travel. Inside the scroller it would keep exact pace with them and
 * there would be no parallax to see; nailed down, there would be no ground
 * moving at all.
 */
const RULES_STYLE = computed(() => ({
  backgroundImage:
    "repeating-linear-gradient(90deg, var(--color-timeline-rule) 0 2px, transparent 2px 220px)",
  maskImage:
    "repeating-linear-gradient(180deg, #000 0 8px, transparent 8px 12px), linear-gradient(180deg, #000 80%, transparent 100%)",
  maskComposite: "intersect",
  WebkitMaskImage:
    "repeating-linear-gradient(180deg, #000 0 8px, transparent 8px 12px), linear-gradient(180deg, #000 80%, transparent 100%)",
  WebkitMaskComposite: "source-in",
  // `translate3d` rather than `left`: the ground moves on every frame of a
  // scroll, and only a transform is composited (RULES §12).
  transform: `translate3d(${rulesOffset.value}px, 0, 0)`,
}))
</script>

<template>
  <div class="relative flex h-full flex-col">
    <!-- Wider than the frame by the distance it is allowed to travel, so the
         rules never run out at the right-hand edge as they fall behind. -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute top-[clamp(60px,5.8vw,112px)] right-[-40%] bottom-0 left-0"
      :style="RULES_STYLE"
    />

    <!-- Named and focusable so the strip is reachable by keyboard: with these,
         Tab lands on it and the arrow keys scroll it — the browser's own
         behaviour, and better than anything rebuilt here.

         Snapping is left to the page below `lg`, where the reader pans the strip
         themselves and a rest close to a card should be tidied to it. At `lg`
         the vertical notches are the snap, and a horizontal snap on top of them
         would correct the position this component has just written.

         The scrollbar is hidden because the strip sits on the section's gradient
         and a browser bar cuts across it. The affordance is carried by the
         movement itself and by the cards running off both edges. -->
    <div
      ref="scroller"
      role="region"
      :aria-label="HERITAGE_COPY.timelineLabel"
      tabindex="0"
      class="min-h-0 flex-1 overflow-x-auto overscroll-x-contain pb-16 lg:pb-[3.13vw] max-lg:snap-x max-lg:snap-proximity scroll-pl-[clamp(20px,18.23vw,350px)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing focus-visible:ring-gold focus-visible:ring-2 focus-visible:outline-none"
      :style="{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }"
    >
      <!-- `select-none`: without it the browser starts its own text/image
           selection the moment the pointer moves, and the drag turns into a
           highlight. -->
      <div class="h-full select-none" v-on="dragHandlers">
        <!-- The heights above this are one chain: the stage fixes itself to the
             screen, the scroller takes what the title leaves, and the cards take
             what the scroller has — without it the cards size themselves and the
             section overruns the screen on any window shorter than the card's
             own `26.04vw`.

             `items-start`, NOT `items-stretch`, and that is what lets the
             columns hang at different heights: a stretched item is forced to the
             row's full height, so the drop below would only ever shorten a card
             rather than move it. Each column states its own height instead and
             the row leaves it alone. -->
        <ol
          :style="DROP_STYLE"
          class="flex h-full w-max list-none items-start gap-[clamp(24px,9.375vw,180px)] pr-[clamp(24px,9.375vw,180px)] pl-[clamp(20px,18.23vw,350px)]"
        >
          <AboutMilestoneCard
            v-for="(milestone, i) in milestones"
            :key="milestone.id"
            :milestone="milestone"
            :index="i"
          />
        </ol>
      </div>
    </div>
  </div>
</template>
