<script setup lang="ts">
import { TOURNAMENTS_COPY } from "~/content/tournaments"

/**
 * The horizontal rail the tournament row on `/tournaments` is built on
 * (`373:17423`).
 *
 * It carried Champions Hall too until that block was replaced by Executive
 * Boards, which brings About's own strip with it. The slots and the
 * `showProgress` switch stay: they are what let the rail be a row with a heading
 * beside its arrows rather than only the one row it now draws.
 *
 * **A native scroller with arrows on top of it, not a carousel.** The design
 * draws four cards side by side, arrows above them, and — on the tournament rail
 * — a progress bar underneath, which is a scrollbar drawn by hand. So the row
 * scrolls: touch and trackpad get the gesture they already expect, a keyboard
 * reaches every card by tabbing into it, and the arrows are a convenience over
 * the top rather than the only way through. A transform-based carousel would
 * have had to reimplement all three.
 *
 * The state here is only what the CONTROLS need — how far along the row is — and
 * it is read from the scroller rather than driving it. The cards themselves
 * arrive through the default slot and are never re-rendered by this component.
 *
 * Scrolling is `scroll-behavior: smooth` in CSS rather than an animation, so
 * `prefers-reduced-motion` turns it off through the media query the utility
 * already carries (RULES §12) — nothing here needs to branch on it.
 */
withDefaults(
  defineProps<{
    /** Names the rail for assistive tech. */
    label: string
    /** The tournament rail draws the bar; a plain row does not. */
    showProgress?: boolean
  }>(),
  { showProgress: false },
)

const track = useTemplateRef<HTMLDivElement>("track")

// `progress` is the thumb's left edge as a fraction, `visible` its width — both
// derived from the scroller, so the bar cannot disagree with the row.
const progress = ref(0)
const visible = ref(1)
const atStart = ref(true)
const atEnd = ref(false)

function measure() {
  const el = track.value
  if (!el) return

  const scrollable = el.scrollWidth - el.clientWidth

  visible.value = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1
  // A row that fits needs no bar and no arrows: `scrollable` is 0, so the thumb
  // fills the track and both ends read as reached.
  progress.value = scrollable > 0 ? el.scrollLeft / scrollable : 0
  atStart.value = el.scrollLeft <= 1
  atEnd.value = scrollable <= 1 || el.scrollLeft >= scrollable - 1
}

onMounted(() => {
  const el = track.value
  if (!el) return

  measure()

  // `ResizeObserver` as well as the scroll listener: the thumb's width is a
  // ratio of two measurements that both change when the window does, and a
  // scroll event never fires for a resize.
  const observer = new ResizeObserver(measure)
  observer.observe(el)

  onBeforeUnmount(() => observer.disconnect())
})

/** One card plus its gutter, so a press lands the next card at the edge. */
function step(direction: 1 | -1) {
  const el = track.value
  if (!el) return

  const card = el.firstElementChild as HTMLElement | null
  const gap = 20
  const distance = card ? card.offsetWidth + gap : el.clientWidth

  el.scrollBy({ left: distance * direction, behavior: "smooth" })
}

// 1760 × 12 in the design (`381:17551`) with a 414 thumb — a scrollbar drawn by
// hand. `translate` on a percentage of the TRACK, not the thumb: the thumb
// travels the leftover width, which is what `progress` measures against.
const thumbStyle = computed(() => ({
  width: `${visible.value * 100}%`,
  marginLeft: `${progress.value * (1 - visible.value) * 100}%`,
}))
</script>

<template>
  <div class="flex flex-col gap-10 lg:gap-[3.125vw]">
    <!-- The arrows share a row with whatever the caller puts in `#heading`.
         `581:14652` draws them inside the title frame, beside the name and the
         "View all" button, and building them as a band of their own cost the
         section a whole one: measured, the arrow row and its gap took ~124px,
         which is most of why the rail stood 213px taller than a screen and cut
         its cards' buttons off the bottom.

         With nothing in the slot the row collapses to just the arrows, pushed
         right. -->
    <div class="flex flex-wrap items-center justify-between gap-6">
      <slot name="heading"><span /></slot>

      <!-- Arrows first, then whatever the caller trails after them. The rail's
           "View all" sits on the far right of this row in the design, PAST the
           arrows rather than beside the heading — so it cannot ride in
           `#heading`, which is the other end of a `justify-between`. -->
      <div class="flex items-center gap-6 lg:gap-12">
        <UiRailArrow
          :label="TOURNAMENTS_COPY.previous"
          :disabled="atStart"
          @press="step(-1)"
        />
        <UiRailArrow
          :label="TOURNAMENTS_COPY.next"
          :disabled="atEnd"
          flipped
          @press="step(1)"
        />

        <slot name="trailing" />
      </div>
    </div>

    <!-- `-mx` + matching padding: the row bleeds to the window edge so a card is
         cut rather than floating in a gutter, which is how the design ends its
         rows. `snap-x` parks a card at the edge after a flick.

         `scrollbar-width: none` hides the native bar because the design draws
         its own below; the row is still scrollable by every other means. -->
    <div
      ref="track"
      role="group"
      :aria-label="label"
      class="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 [scrollbar-width:none] md:-mx-10 md:px-10 lg:-mx-20 lg:px-20 [&::-webkit-scrollbar]:hidden"
      @scroll="measure"
    >
      <slot />
    </div>

    <!-- `aria-hidden` because it reports the scroller's position, which
         assistive tech already gets from the scroller itself. -->
    <div
      v-if="showProgress"
      aria-hidden
      class="h-3 w-full overflow-hidden rounded-[var(--radius-glass)] bg-white/20"
    >
      <div
        class="h-full rounded-[var(--radius-glass)] bg-white"
        :style="thumbStyle"
      />
    </div>
  </div>
</template>
