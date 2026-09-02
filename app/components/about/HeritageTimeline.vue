<script setup lang="ts">
import type { HeritageMilestone } from "~/lib/api/types"
import { HERITAGE_COPY } from "~/content/about/heritage"

/**
 * Milliseconds a card rests before the strip moves to the next one.
 *
 * The first pass used 3.4s — a card's summary is three lines, and that is about
 * how long they take to read. It was too slow to watch: the strip spends most of
 * its time standing still, and a reader who is not reading a card is simply
 * waiting. The strip pauses under the pointer and under keyboard focus anyway,
 * so anyone who wants to finish a card can stop it — which means the resting
 * time only has to be long enough to take a card in, not to read every word.
 */
const DWELL_MS = 1800

/**
 * How far one step travels, as a fraction of a card-plus-gap. A whole step would
 * put the next card exactly where the last one stood, which reads as a slideshow
 * cutting between frames; a little short of one leaves the previous card's edge
 * in view, so the movement reads as travel ALONG a strip rather than a swap.
 */
const STEP_RATIO = 0.9

/**
 * The travelling half of Heritage — Figma node `88:1167`.
 *
 * The design does not fit and is not meant to: Figma places the four cards at
 * x 350, 1010, 1670 and 2330 on a 1920 frame, so the last one ends 890px past
 * the right edge. That overhang is the section's whole idea — the timeline is
 * longer than the window.
 *
 * Two versions were built before this one, and both failed in a way worth
 * recording. A continuous CSS marquee was too smooth: an even, unbroken drift
 * reads as decoration, and cards slid out from under a sentence being read.
 * Arrow buttons fixed the pacing but made the section inert — nothing happened
 * unless the reader pressed something, and the timeline is not a control panel.
 *
 * So it advances **by itself, in steps**. The strip rests on a card long enough
 * to read it, then moves to the next. The pauses are what the smooth version
 * lacked: motion that stops is motion the eye can follow, and each stop is an
 * invitation to read rather than a thing to keep up with.
 *
 * It runs on native `overflow-x` scrolling, so keyboard, trackpad, touch and
 * momentum all arrive already correct and the auto-advance simply drives the
 * same scroll position. Take hold of it and it yields; let go and it resumes.
 */
defineProps<{ milestones: HeritageMilestone[] }>()

const scroller = useTemplateRef<HTMLDivElement>("scroller")

// Paused while the reader is involved — pointer over the strip, keyboard focus
// inside it, or a drag in progress. A strip that keeps marching while someone is
// reading it, or scrolling it themselves, is fighting them.
const paused = ref(false)

onMounted(() => {
  let interval: ReturnType<typeof setInterval> | undefined

  // Which way the strip is currently travelling. It turns round at each end
  // rather than jumping back to the start: this is a history with a first and a
  // last entry, and a cut from 2003 back to 1974 would say otherwise — where
  // reversing simply reads as walking back along the same line.
  let direction: 1 | -1 = 1

  function stop() {
    if (interval) clearInterval(interval)
    interval = undefined
  }

  function start() {
    stop()

    // Read here rather than through `useReducedMotion` during render: this runs
    // after mount, so nothing in the markup depends on it and the two sides
    // cannot disagree (RULES §12). A reader who reduces motion gets a strip that
    // simply does not move on its own — still fully scrollable by hand.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    interval = setInterval(() => {
      const el = scroller.value
      if (!el) return

      const max = el.scrollWidth - el.clientWidth
      // Nothing overflows — a narrow list, or a window wide enough to hold it.
      // There is no strip to travel, so there is nothing to do.
      if (max <= 1) return

      // A pixel of slack at each end: fractional scroll positions and device
      // pixel ratios mean the arithmetic rarely lands exactly on the boundary,
      // and a strip that thinks it has further to go simply stops dead.
      if (direction === 1 && el.scrollLeft >= max - 1) direction = -1
      else if (direction === -1 && el.scrollLeft <= 1) direction = 1

      // One card-plus-gap, measured from the DOM rather than restated here: the
      // card width and the gap are both clamps, so the number only exists once
      // the browser has resolved them. Two adjacent cards give it exactly, and
      // the fallback covers a single-milestone list.
      const cards = el.querySelectorAll<HTMLElement>("[data-milestone]")
      const pitch =
        cards.length > 1
          ? cards[1]!.offsetLeft - cards[0]!.offsetLeft
          : el.clientWidth * 0.8

      el.scrollBy({ left: direction * pitch * STEP_RATIO, behavior: "smooth" })
    }, DWELL_MS)
  }

  watch(paused, (isPaused) => (isPaused ? stop() : start()), {
    immediate: true,
  })

  onBeforeUnmount(stop)
})

// Mouse drag-to-pan. Shared with the board carousel — see the composable.
const dragHandlers = useDragToPan(scroller)

// The strip has no edges of its own: it fades into the band at both sides so
// cards arrive and leave rather than being clipped. A gradient overlay would
// need to know the band's colour, which changes down the section — a mask does
// not.
const EDGE_MASK =
  "linear-gradient(90deg, transparent 0%, #000 4%, #000 96%, transparent 100%)"

/**
 * The dashed rules behind the cards — Figma `88:1169` and its ten siblings.
 *
 * Drawn rather than downloaded: it is eleven copies of one 2px dashed line at a
 * fixed 220px pitch, which is a repeating background, and an SVG of it would be
 * a file to fetch for something CSS already states in three declarations.
 *
 * It sits outside the scroller on purpose. The rules are the ground the timeline
 * travels across; moving them along with the cards would cancel the only cue
 * that anything moved at all.
 *
 * Two masks, intersected. The first chops each line into Figma's 8-on/4-off
 * dashes; the second is its stroke gradient, opaque for the top 80% and gone by
 * the foot, so the rules dissolve into the band rather than stopping on a line.
 */
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

const RULES_STYLE = {
  backgroundImage:
    "repeating-linear-gradient(90deg, var(--color-timeline-rule) 0 2px, transparent 2px 220px)",
  maskImage:
    "repeating-linear-gradient(180deg, #000 0 8px, transparent 8px 12px), linear-gradient(180deg, #000 80%, transparent 100%)",
  maskComposite: "intersect",
  WebkitMaskImage:
    "repeating-linear-gradient(180deg, #000 0 8px, transparent 8px 12px), linear-gradient(180deg, #000 80%, transparent 100%)",
  WebkitMaskComposite: "source-in",
} as const
</script>

<template>
  <!-- `focusin`/`focusout` rather than `focus`/`blur`: someone arrowing along
       the strip by keyboard is as much in the middle of reading it as someone
       hovering, and only the former pair bubbles up to this wrapper. -->
  <div
    class="relative flex h-full flex-col"
    @pointerenter="paused = true"
    @pointerleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-[clamp(60px,5.8vw,112px)] bottom-0"
      :style="RULES_STYLE"
    />

    <!-- Named and focusable so the strip is reachable by keyboard: with these,
         Tab lands on it and the arrow keys scroll it — the browser's own
         behaviour, and better than anything rebuilt here.

         Snap on PROXIMITY, not `mandatory`. Mandatory would fight both the drag
         — every position the pointer passes through is one the browser wants to
         correct — and the deliberate nine-tenths step. Proximity only tidies a
         rest that was already close to a card.

         The scrollbar is hidden because the strip sits on the section's gradient
         and a browser bar cuts across it. The affordance is carried by the
         movement itself and by the cards running off both edges. -->
    <div
      ref="scroller"
      role="region"
      :aria-label="HERITAGE_COPY.timelineLabel"
      tabindex="0"
      class="min-h-0 flex-1 overflow-x-auto overscroll-x-contain pb-16 lg:pb-[3.13vw] snap-x snap-proximity scroll-pl-[clamp(20px,18.23vw,350px)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing focus-visible:ring-gold focus-visible:ring-2 focus-visible:outline-none"
      :style="{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }"
    >
      <!-- `select-none`: without it the browser starts its own text/image
           selection the moment the pointer moves, and the drag turns into a
           highlight. -->
      <div class="h-full select-none" v-on="dragHandlers">
        <!-- The heights above this are one chain: the section fixes itself to
             the screen, the scroller takes what the title leaves, and the cards
             take what the scroller has — without it the cards size themselves
             and the section overruns the screen on any window shorter than the
             card's own `26.04vw`.

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
