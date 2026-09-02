<script setup lang="ts">
import type { BoardMember } from "~/lib/api/types"
import { BOARDS_COPY } from "~/content/about/boards"

/**
 * The strip of board portraits — Figma node `112:3587`, with the arrows from
 * `112:3610`.
 *
 * Four 540px cards and three gaps come to 2232 inside a 1760 frame, so the row
 * overflows by design, exactly as Heritage's timeline does. The difference is
 * that this one carries arrows in the design and Heritage does not, so it is
 * driven by the reader rather than advancing on its own: a board is a list to
 * look through, not a history to be walked along.
 *
 * Like Heritage it rides native `overflow-x` scrolling, so trackpad, touch,
 * momentum and keyboard arrive already correct and the buttons simply drive the
 * same scroll position. Nothing here reimplements a scroller.
 *
 * Figma draws the left arrow at 30% opacity and the right one solid — the strip
 * starting at its beginning, with nowhere to go back to. That is a disabled
 * state rather than a decoration, so both arrows carry it and it tracks the real
 * position instead of being painted on.
 *
 * The section's `<h2>` arrives through a slot rather than being rendered here.
 * Figma puts the arrows on the same row as the heading, and the arrows are
 * state — so either the heading comes inside this component or the row is split
 * across two and has to be re-aligned by hand.
 */
const props = defineProps<{ members: BoardMember[] }>()

defineSlots<{ heading: () => unknown }>()

const scroller = useTemplateRef<HTMLDivElement>("scroller")

// Which ends the strip is against. Both true means nothing overflows — a window
// wide enough to hold the whole board — and both arrows go quiet.
const atStart = ref(true)
const atEnd = ref(false)

// Which card is nearest the left edge, for the announcement below. Derived from
// the scroll position rather than from a click count, so dragging and arrowing
// by keyboard are described as accurately as pressing a button.
const current = ref(1)

const dragHandlers = useDragToPan(scroller)

function sync() {
  const el = scroller.value
  if (!el) return

  const max = el.scrollWidth - el.clientWidth
  // A pixel of slack at each end: fractional scroll offsets and device pixel
  // ratios rarely land exactly on the boundary, and an arrow that thinks it
  // still has somewhere to go is an arrow that does nothing when pressed.
  atStart.value = el.scrollLeft <= 1
  atEnd.value = el.scrollLeft >= max - 1

  const cards = el.querySelectorAll<HTMLElement>("[data-member]")
  const pitch =
    cards.length > 1 ? cards[1]!.offsetLeft - cards[0]!.offsetLeft : 0
  current.value = pitch > 0 ? Math.round(el.scrollLeft / pitch) + 1 : 1
}

// `scroll` fires for every source — button, drag, trackpad, keyboard — so one
// listener keeps the arrows and the announcement true no matter what moved it.
// The initial call covers the case where nothing overflows at all.
onMounted(() => {
  const el = scroller.value
  if (!el) return

  sync()
  el.addEventListener("scroll", sync, { passive: true })

  // A resize can turn an overflowing strip into one that fits, and the scroll
  // event will not fire for it — the arrows would stay lit with nowhere left to
  // go.
  const observer = new ResizeObserver(sync)
  observer.observe(el)

  onBeforeUnmount(() => {
    el.removeEventListener("scroll", sync)
    observer.disconnect()
  })
})

function step(direction: 1 | -1) {
  const el = scroller.value
  if (!el) return

  const cards = el.querySelectorAll<HTMLElement>("[data-member]")
  // One card-plus-gap, measured from the DOM: both are clamps, so the number
  // only exists once the browser has resolved them.
  const pitch =
    cards.length > 1
      ? cards[1]!.offsetLeft - cards[0]!.offsetLeft
      : el.clientWidth * 0.8

  // Read here rather than through `useReducedMotion` during render: this is an
  // event handler, so no markup depends on it and the two sides cannot disagree
  // (RULES §12).
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  el.scrollBy({ left: direction * pitch, behavior: reduced ? "auto" : "smooth" })
}

const position = computed(() =>
  BOARDS_COPY.position(current.value, props.members.length),
)
</script>

<template>
  <!-- Heading and arrows on one row — Figma `112:3611`, `space-between`. The
       arrows go under the heading on a phone, where a 184px control group beside
       a 72px title leaves the title two words a line. -->
  <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
    <slot name="heading" />

    <!-- `UiRailArrow`, not a third copy of the same button. `AboutBoardArrow`
         drew the same 64px control from the same asset and differed from it in
         two ways that showed: a 32px glyph inside the 64px box where the shared
         one fills it, and a round button where the shared one takes the site's
         `radius-btn`. Figma gives both places the same `vuesax/outline/arrow`
         component, so the difference was ours, not the design's.

         The shared one moved to `ui/` on its second user (D32/D43); this is the
         third, and the same rule that put it there is what removes this copy. -->
    <div class="flex shrink-0 items-center gap-[46px]">
      <UiRailArrow
        :label="BOARDS_COPY.previous"
        :disabled="atStart"
        @press="step(-1)"
      />
      <UiRailArrow
        :label="BOARDS_COPY.next"
        :disabled="atEnd"
        flipped
        @press="step(1)"
      />
    </div>
  </div>

  <!-- Named and focusable so the strip is reachable by keyboard: Tab lands on it
       and the arrow keys scroll it — the browser's own behaviour, and better
       than anything rebuilt here.

       Full-bleed: the strip is wider than the window by design, and the
       section's gutters would only cut it short. The negative margin cancels
       them and the matching padding puts the first card back where the gutter
       had it, so the row starts flush with the heading above.

       Snap on proximity rather than `mandatory`: mandatory fights a drag,
       because every position the pointer passes through is one the browser wants
       to correct.

       The scrollbar is hidden because the strip runs full-bleed across the
       section; the affordance is the arrows and the cards running off the
       edge. -->
  <div
    ref="scroller"
    role="region"
    :aria-label="BOARDS_COPY.carouselLabel"
    tabindex="0"
    class="-mx-5 mt-10 overflow-x-auto overscroll-x-contain px-5 md:-mx-10 md:px-10 lg:-mx-20 lg:mt-[3.33vw] lg:px-20 snap-x snap-proximity [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing focus-visible:ring-gold focus-visible:ring-2 focus-visible:outline-none"
  >
    <!-- `select-none`: without it the browser starts its own text/image
         selection the moment the pointer moves, and the drag turns into a
         highlight. -->
    <div class="select-none" v-on="dragHandlers">
      <ol class="flex w-max list-none gap-4 lg:gap-[1.25vw]">
        <!-- `data-member` is what the step and the position measure against: it
             marks the adjacent elements whose offset difference IS one
             card-plus-gap. -->
        <li
          v-for="member in members"
          :key="member.id"
          data-member
          class="w-[clamp(260px,28.13vw,540px)] shrink-0 snap-start"
        >
          <AboutBoardCard :member="member" />
        </li>
      </ol>
    </div>
  </div>

  <!-- Spoken, not shown: the design has no counter, but a screen-reader user
       pressing an arrow otherwise gets no confirmation that anything moved. -->
  <p aria-live="polite" class="sr-only">{{ position }}</p>
</template>
